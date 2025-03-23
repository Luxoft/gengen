import { IEnumModel } from '../models/EnumModel';
import { IIdentityModel } from '../models/IdentityModel';
import { IInterfaceModel, InterfaceModel } from '../models/InterfaceModel';
import { PropertyKind } from '../models/kinds/PropertyKind';
import { IModelsContainer } from '../models/ModelsContainer';
import { IExtendedObjectModel, IObjectModel, IObjectPropertyModel, ObjectModel } from '../models/ObjectModel';
import { IUnionModel } from '../models/UnionModel';
import { NameService } from './NameService';
import { OpenAPIService } from '../swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { IOpenAPI3Reference } from '../swagger/v3/reference';
import { IOpenAPI3AllOfSchema } from '../swagger/v3/schemas/all-of-schema';
import { IOpenAPI3DiscriminatorSchema } from '../swagger/v3/schemas/discriminator-schema';
import { IOpenAPI3EnumSchema } from '../swagger/v3/schemas/enum-schema';
import { IOpenAPI3GuidSchema } from '../swagger/v3/schemas/guid-schema';
import { IOpenAPI3ObjectSchema } from '../swagger/v3/schemas/object-schema';
import { OpenAPI3Schema, OpenAPI3SchemaContainer, OpenAPI3SimpleSchema } from '../swagger/v3/schemas/schema';
import { first, sortBy } from '../utils';
import { TypesService } from './TypesService';

const IGNORE_PROPERTIES = ['startRow', 'rowCount'];

export class ModelMappingService {
    public additionalEnums: IEnumModel[] = [];
    public unions: IUnionModel[] = [];

    constructor(
        private readonly openAPIService: OpenAPIService,
        private readonly typesGuard: OpenAPITypesGuard,
        private readonly typesService: TypesService,
        private readonly nameService: NameService
    ) {}

    public toModelsContainer(schemas: OpenAPI3SchemaContainer): IModelsContainer {
        const objects: ObjectModel[] = [];
        const enums: IEnumModel[] = [];
        const identities: IIdentityModel[] = [];

        Object.entries(schemas).forEach(([name, schema]) => {
            if (this.typesGuard.isEnum(schema)) {
                enums.push(this.toEnumModel(name, schema));
                return;
            }

            if (this.typesGuard.isObject(schema)) {
                const idFieldName = 'id';
                if (this.isIdentity(schema)) {
                    identities.push({
                        name,
                        isNullable: false,
                        dtoType: this.nameService.getInterfaceName(name),
                        property: {
                            ...this.typesService.getSimpleType(schema.properties[idFieldName] as IOpenAPI3GuidSchema),
                            isRequired: this.isRequiredField(schema, idFieldName),
                            isCollection: false,
                            name: idFieldName,
                            isNullable: true
                        }
                    });
                } else if (this.typesGuard.isAllOf(schema)) {
                    objects.push(this.toExtendedObjectModel(name, schema));
                } else {
                    objects.push(this.toObjectModel(name, schema));
                }
            }
        });

        return {
            enums: [...this.additionalEnums, ...enums].sort(sortBy((z) => z.name)),
            identities: identities.sort(sortBy((z) => z.name)),
            unions: this.unions.sort(sortBy((z) => z.name)),
            interfaces: this.getInterfaces(identities, objects).sort(sortBy((z) => z.name)),
            objects: objects.sort(sortBy((z) => z.name))
        };
    }

    protected isRequiredField(schema: IOpenAPI3ObjectSchema, fieldName: string): boolean {
        return schema.required?.includes(fieldName) ?? false;
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

    private toExtendedObjectModel(
        name: string,
        schema: IOpenAPI3AllOfSchema & (IOpenAPI3ObjectSchema | IOpenAPI3DiscriminatorSchema)
    ): IExtendedObjectModel {
        const model: IExtendedObjectModel = {
            name,
            isNullable: schema.nullable ?? false,
            dtoType: this.nameService.getInterfaceName(name),
            properties: [],
            extendingTypes: []
        };

        schema.allOf.forEach((x) => {
            const refSchema = this.openAPIService.getRefSchema(x);
            const schemaKey = this.openAPIService.getSchemaKey(x);
            if (this.typesGuard.isObject(refSchema)) {
                model.extendingTypes = [...model.extendingTypes, schemaKey];
            }
        });

        this.addUnionTypesByDiscriminator(model.name, schema);
        this.addProperties(model, schema);

        return model;
    }

    private toObjectModel(name: string, schema: IOpenAPI3ObjectSchema | IOpenAPI3DiscriminatorSchema): IObjectModel {
        const model: IObjectModel = {
            name,
            isNullable: schema.nullable ?? false,
            dtoType: this.nameService.getInterfaceName(name),
            properties: []
        };
        this.addUnionTypesByDiscriminator(model.name, schema);
        this.addProperties(model, schema);
        return model;
    }

    private addProperties<T extends ObjectModel>(model: T, schema: IOpenAPI3ObjectSchema): void {
        if (!schema.properties) {
            return;
        }

        Object.entries(schema.properties)
            .filter(([name]) => !IGNORE_PROPERTIES.includes(name))
            .forEach(([name, propertySchema]) => this.addProperty(model, name, propertySchema, this.isRequiredField(schema, name)));

        model.properties = model.properties.sort(sortBy((z) => z.name));
    }

    private addProperty(model: IObjectModel, name: string, schema: OpenAPI3Schema, isRequired: boolean): void {
        if (this.typesGuard.isSimple(schema)) {
            model.properties.push(this.getSimpleProperty(name, schema, isRequired));
            return;
        }

        let property: IObjectPropertyModel | undefined;
        if (this.typesGuard.isCollection(schema)) {
            if (this.typesGuard.isSimple(schema.items)) {
                property = this.getSimpleProperty(name, schema.items, isRequired);
            } else if (this.typesGuard.isReference(schema.items)) {
                property = this.getReferenceProperty(name, schema.items, isRequired);
            }
            if (this.typesGuard.isOneOf(schema.items)) {
                property = this.getUnionReferenceProperty(name, first(schema.items.oneOf), isRequired);
            }

            if (property) {
                property.isCollection = true;
                model.properties.push(property);
                return;
            }
        }

        if (this.typesGuard.isReference(schema)) {
            property = this.getReferenceProperty(name, schema, isRequired);
        } else if (this.typesGuard.isAllOf(schema)) {
            property = this.getReferenceProperty(name, first(schema.allOf), isRequired);
        } else if (this.typesGuard.isOneOf(schema)) {
            property = this.getUnionReferenceProperty(name, first(schema.oneOf), isRequired);
        }

        if (property) {
            model.properties.push(property);
            return;
        }
    }

    private addUnionTypesByDiscriminator(modelName: string, schema: IOpenAPI3ObjectSchema | IOpenAPI3DiscriminatorSchema): void {
        if (!this.typesGuard.isDiscriminator(schema)) {
            return;
        }

        const unionModel: IUnionModel = {
            name: modelName,
            unionInterfaces: []
        };

        Object.keys(schema.discriminator.mapping).forEach((key) => {
            const value = schema.discriminator!.mapping[key];
            const refSchema = this.openAPIService.getRefSchema({ $ref: value });
            const schemaKey = this.openAPIService.getSchemaKey({ $ref: value });
            if (this.typesGuard.isObject(refSchema)) {
                unionModel.unionInterfaces.push(schemaKey);
            }
        });

        this.unions.push(unionModel);

        this.additionalEnums.push({
            name: this.nameService.getUnionTypesName(modelName),
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

    private getSimpleProperty(name: string, schema: OpenAPI3SimpleSchema, isRequired: boolean): IObjectPropertyModel {
        return {
            ...this.typesService.getSimpleType(schema),
            name,
            isCollection: false,
            isRequired
            // TODO: its always return from getSimpleType
            //isNullable: Boolean(schema.nullable)
        };
    }

    private getUnionReferenceProperty(name: string, schema: IOpenAPI3Reference, isRequired: boolean): IObjectPropertyModel {
        const schemaKey = this.openAPIService.getSchemaKey(schema);

        return {
            kind: PropertyKind.Union,
            isCollection: false,
            name: name,
            isNullable: false,
            isRequired,
            type: this.nameService.getUnionName(schemaKey),
            dtoType: this.nameService.getInterfaceName(this.nameService.getUnionName(schemaKey))
        };
    }

    private getReferenceProperty(name: string, schema: IOpenAPI3Reference, isRequired: boolean): IObjectPropertyModel {
        const schemaKey = this.openAPIService.getSchemaKey(schema);
        const refSchema = this.openAPIService.getRefSchema(schema);

        if (this.typesGuard.isEnum(refSchema)) {
            return {
                kind: PropertyKind.Enum,
                isCollection: false,
                name,
                isNullable: false,
                isRequired,
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
            isRequired,
            dtoType: this.nameService.getInterfaceName(schemaKey)
        };
    }

    private getInterfaces(identities: IIdentityModel[], objects: ObjectModel[]): InterfaceModel[] {
        const interfaces: IInterfaceModel[] = identities.map((z) => ({
            name: this.nameService.getInterfaceName(z.name),
            properties: [
                {
                    name: z.property.name,
                    dtoType: z.property.dtoType,
                    isRequired: z.property.isRequired,
                    isCollection: false,
                    isNullable: false
                }
            ]
        }));

        return interfaces.concat(
            objects.map((z) => {
                if (this.isExtendedObjectModel(z)) {
                    return {
                        name: this.nameService.getInterfaceName(z.name),
                        extendingInterfaces: z.extendingTypes.map((x) => this.nameService.getInterfaceName(x)),
                        properties: z.properties.map((x) => ({
                            name: x.name,
                            dtoType: x.dtoType,
                            isCollection: x.isCollection,
                            isNullable: x.isNullable,
                            isRequired: x.isRequired
                        }))
                    };
                } else {
                    return {
                        name: this.nameService.getInterfaceName(z.name),
                        properties: z.properties.map((x) => ({
                            name: x.name,
                            dtoType: x.dtoType,
                            isCollection: x.isCollection,
                            isNullable: x.isNullable,
                            isRequired: x.isRequired
                        }))
                    };
                }
            })
        );
    }

    private isExtendedObjectModel(objects: ObjectModel): objects is IExtendedObjectModel {
        return Boolean((objects as IExtendedObjectModel)?.extendingTypes);
    }

    private isIdentity(schema: IOpenAPI3ObjectSchema | undefined): boolean {
        if (!schema) {
            return false;
        }
        return schema.properties && Object.keys(schema.properties)?.length === 1 && this.typesGuard.isGuid(schema.properties['id']);
    }
}
