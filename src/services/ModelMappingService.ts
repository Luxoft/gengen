import { IEnumModel } from '../models/EnumModel';
import { IIdentityModel } from '../models/IdentityModel';
import { IInterfaceModel, IInterfaceUnionModel } from '../models/InterfaceModel';
import { PropertyKind } from '../models/kinds/PropertyKind';
import { IModelsContainer } from '../models/ModelsContainer';
import { IObjectModel, IObjectPropertyModel, IObjectUnionModel } from '../models/ObjectModel';
import { OpenAPIService } from '../swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { IOpenAPI3Reference } from '../swagger/v3/reference';
import { IOpenAPI3AllOfSchema } from '../swagger/v3/schemas/all-of-schema';
import { IOpenAPI3DiscriminatorSchema } from '../swagger/v3/schemas/discriminator-schema';
import { IOpenAPI3EnumSchema } from '../swagger/v3/schemas/enum-schema';
import { IOpenAPI3GuidSchema } from '../swagger/v3/schemas/guid-schema';
import { IOpenAPI3ObjectSchema } from '../swagger/v3/schemas/object-schema';
import { OpenAPI3Schema, OpenAPI3SchemaContainer, OpenAPI3SimpleSchema } from '../swagger/v3/schemas/schema';
import { first, getInterfaceName, sortBy } from '../utils';
import { TypesService } from './TypesService';

const IGNORE_PROPERTIES = ['startRow', 'rowCount'];

export class ModelMappingService {
    public additionalEnums: IEnumModel[] = [];
    public additionalUnions: IObjectUnionModel[] = [];

    constructor(
        private readonly openAPIService: OpenAPIService,
        private readonly typesGuard: OpenAPITypesGuard,
        private readonly typesService: TypesService
    ) {}

    public toModelsContainer(schemas: OpenAPI3SchemaContainer): IModelsContainer {
        const objects: IObjectModel[] = [];
        const enums: IEnumModel[] = [];
        const identities: IIdentityModel[] = [];

        Object.entries(schemas).forEach(([name, schema]) => {
            if (this.typesGuard.isEnum(schema)) {
                enums.push(this.toEnumModel(name, schema));
                return;
            }

            if (this.typesGuard.isObject(schema)) {
                if (this.isIdentity(schema)) {
                    identities.push({
                        name,
                        isNullable: false,
                        dtoType: getInterfaceName(name),
                        property: {
                            ...this.typesService.getSimpleType(schema.properties['id'] as IOpenAPI3GuidSchema),
                            isCollection: false,
                            name: 'id',
                            isNullable: true
                        }
                    });
                } else {
                    objects.push(this.toObjectModel(name, schema));
                }
            }
        });

        return {
            enums: [...this.additionalEnums, ...enums].sort(sortBy((z) => z.name)),
            identities: identities.sort(sortBy((z) => z.name)),
            unionInterfaces: this.getUnionInterfaces(this.additionalUnions).sort(sortBy((z) => z.name)),
            interfaces: this.getInterfaces(identities, objects).sort(sortBy((z) => z.name)),
            objects: objects.sort(sortBy((z) => z.name))
        };
    }

    private toEnumModel(name: string, schema: IOpenAPI3EnumSchema): IEnumModel {
        return {
            name,
            isNullable: schema.nullable ?? false,
            items: schema.enum
                .map((value, index) => ({
                    key: schema['x-enumNames'][index],
                    value
                }))
                .sort(sortBy((z) => z.key))
        };
    }

    private toObjectModel(name: string, schema: IOpenAPI3ObjectSchema | IOpenAPI3DiscriminatorSchema): IObjectModel {
        const model: IObjectModel = {
            name,
            isNullable: schema.nullable ?? false,
            dtoType: getInterfaceName(name),
            properties: [],
            combineTypes: []
        };

        if (this.typesGuard.isAllOf(schema)) {
            this.addCombineTypes(schema, model);
        }

        if (this.typesGuard.isDiscriminator(schema)) {
            this.addUnionTypesByDiscriminator(schema, model.name);
        }

        if (!schema.properties) {
            return model;
        }

        Object.entries(schema.properties)
            .filter(([name]) => !IGNORE_PROPERTIES.includes(name))
            .forEach(([name, propertySchema]) => this.addProperty(model, name, propertySchema));

        model.properties = model.properties.sort(sortBy((z) => z.name));

        return model;
    }

    private addProperty(model: IObjectModel, name: string, schema: OpenAPI3Schema): void {
        if (this.typesGuard.isSimple(schema)) {
            model.properties.push(this.getSimpleProperty(name, schema));
            return;
        }

        let property: IObjectPropertyModel | undefined;
        if (this.typesGuard.isCollection(schema)) {
            if (this.typesGuard.isSimple(schema.items)) {
                property = this.getSimpleProperty(name, schema.items);
            } else if (this.typesGuard.isReference(schema.items)) {
                property = this.getReferenceProperty(name, schema.items);
            }
            if (this.typesGuard.isOneOf(schema.items)) {
                property = this.getReferenceProperty(name, first(schema.items.oneOf));
                this.updateOneOfProperty(first(schema.items.oneOf), property);
            }

            if (property) {
                property.isCollection = true;
                model.properties.push(property);
                return;
            }
        }

        if (this.typesGuard.isReference(schema)) {
            property = this.getReferenceProperty(name, schema);
        } else if (this.typesGuard.isAllOf(schema)) {
            property = this.getReferenceProperty(name, first(schema.allOf));
        } else if (this.typesGuard.isOneOf(schema)) {
            property = this.getReferenceProperty(name, first(schema.oneOf));
            this.updateOneOfProperty(first(schema.oneOf), property);
        }

        if (property) {
            model.properties.push(property);
            return;
        }
    }

    private addCombineTypes(schema: IOpenAPI3AllOfSchema, model: IObjectModel): void {
        schema.allOf.forEach((x) => {
            const refSchema = this.openAPIService.getRefSchema(x);
            const schemaKey = this.openAPIService.getSchemaKey(x);
            if (this.typesGuard.isObject(refSchema)) {
                model.combineTypes = [...model.combineTypes, schemaKey];
            }
        });
    }

    private updateOneOfProperty(firstObj: IOpenAPI3Reference, property: IObjectPropertyModel): void {
        const schemaKey = this.openAPIService.getSchemaKey(firstObj);
        property.typeAlias = schemaKey + 'Union';
        property.typeAlias = schemaKey + 'UnionClass';
    }

    private addUnionTypesByDiscriminator(schema: IOpenAPI3DiscriminatorSchema, modelName: string): void {
        const unionModel: IObjectUnionModel = {
            name: modelName + 'Union',
            unionTypesNames: [],
            baseTypeName: modelName
        };

        Object.keys(schema.discriminator.mapping).forEach((key) => {
            const value = schema.discriminator!.mapping[key];
            const refSchema = this.openAPIService.getRefSchema({ $ref: value });
            const schemaKey = this.openAPIService.getSchemaKey({ $ref: value });
            if (this.typesGuard.isObject(refSchema)) {
                unionModel.unionTypesNames.push(schemaKey);
            }
        });

        this.additionalUnions.push(unionModel);

        this.additionalEnums.push({
            name: modelName + 'UnionTypes',
            isNullable: false,
            items: Object.keys(schema.discriminator.mapping).map((key) => {
                const value = schema.discriminator!.mapping[key];
                const schemaKey = this.openAPIService.getSchemaKey({ $ref: value });
                return {
                    key: schemaKey,
                    value: key
                };
            })
        });
    }

    private getSimpleProperty(name: string, schema: OpenAPI3SimpleSchema): IObjectPropertyModel {
        return {
            ...this.typesService.getSimpleType(schema),
            name,
            isCollection: false,
            isNullable: Boolean(schema.nullable)
        };
    }

    private getReferenceProperty(name: string, schema: IOpenAPI3Reference): IObjectPropertyModel {
        const schemaKey = this.openAPIService.getSchemaKey(schema);
        const refSchema = this.openAPIService.getRefSchema(schema);

        if (this.typesGuard.isEnum(refSchema)) {
            return {
                kind: PropertyKind.Enum,
                isCollection: false,
                name,
                isNullable: false,
                type: schemaKey,
                dtoType: schemaKey
            };
        }

        const kind = this.isIdentity(refSchema) ? PropertyKind.Identity : PropertyKind.Object;

        return {
            kind,
            isCollection: false,
            name,
            isNullable: true,
            type: schemaKey,
            dtoType: getInterfaceName(schemaKey)
        };
    }

    private getInterfaces(identities: IIdentityModel[], objects: IObjectModel[]): IInterfaceModel[] {
        const interfaces: IInterfaceModel[] = identities.map((z) => ({
            name: getInterfaceName(z.name),
            properties: [{ name: z.property.name, dtoType: z.property.dtoType, isCollection: false, isNullable: false }],
            combineInterfaces: []
        }));

        return interfaces.concat(
            objects.map((z) => ({
                name: getInterfaceName(z.name),
                combineInterfaces: z.combineTypes.map((x) => getInterfaceName(x)),
                properties: z.properties.map((x) => ({
                    name: x.name,
                    dtoType: x.dtoType,
                    isCollection: x.isCollection,
                    isNullable: x.isNullable
                }))
            }))
        );
    }

    private getUnionInterfaces(objects: IObjectUnionModel[]): IInterfaceUnionModel[] {
        return objects.map((z) => ({
            name: z.name,
            unionInterfaces: z.unionTypesNames.map((x) => x),
            parentInterface: z.baseTypeName
        }));
    }

    private isIdentity(schema: IOpenAPI3ObjectSchema | undefined): boolean {
        if (!schema) {
            return false;
        }
        return schema.properties && Object.keys(schema.properties)?.length === 1 && this.typesGuard.isGuid(schema.properties['id']);
    }
}
