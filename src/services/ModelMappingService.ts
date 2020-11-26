import { IEnumModel } from '../models/EnumModel';
import { IIdentityModel } from '../models/IdentityModel';
import { IInterfaceModel } from '../models/InterfaceModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { IObjectModel, IObjectPropertyModel } from '../models/ObjectModel';
import { PropertyKind } from '../models/PropertyKind';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { IOpenAPI3Reference } from '../swagger/v3/reference';
import { IOpenAPI3EnumSchema } from '../swagger/v3/schemas/enum-schema';
import { IOpenAPI3ObjectSchema, OpenAPI3ObjectPropertySchema } from '../swagger/v3/schemas/object-schema';
import { OpenAPI3SchemaContainer, OpenAPI3SimpleSchema } from '../swagger/v3/schemas/schema';
import { first, last, sortBy } from '../utils';

const IGNORE_PROPERTIES = ['startRow', 'rowCount'];
const COMMON_IDENTITY_NAME = 'IdentityDTO';

export class ModelMappingService {
    constructor(private readonly typesGuard: OpenAPITypesGuard) { }

    public toModelsContainer(schemas: OpenAPI3SchemaContainer): IModelsContainer {
        const enums: IEnumModel[] = [];
        const identities: IIdentityModel[] = [];
        const objects: IObjectModel[] = [];

        Object.entries(schemas).forEach(([name, schema]) => {
            if (this.typesGuard.isEnum(schema)) {
                enums.push(this.toEnumModel(name, schema));
                return;
            }

            if (this.typesGuard.isObject(schema)) {
                if (this.isIdentity(schema)) {
                    identities.push({ name, property: this.getGuidProperty('id', true) });
                } else {
                    objects.push(this.toObjectModel(schemas, name, schema));
                }
            }
        });

        return {
            enums: enums.sort(sortBy((z) => z.name)),
            identities: identities.sort(sortBy((z) => z.name)),
            interfaces: this.getInterfaces(identities, objects).sort(sortBy((z) => z.name)),
            objects: objects.sort(sortBy((z) => z.name))
        };
    }

    private toEnumModel(name: string, schema: IOpenAPI3EnumSchema): IEnumModel {
        return {
            name,
            items: schema.enum.sort().map((value, index) => ({
                key: schema['x-enumNames'][index],
                value
            }))
        };
    }

    private toObjectModel(schemas: OpenAPI3SchemaContainer, name: string, schema: IOpenAPI3ObjectSchema): IObjectModel {
        const model: IObjectModel = { name, dtoType: this.getInterfaceName(name), properties: [] };
        if (!schema.properties) {
            return model;
        }

        Object.entries(schema.properties)
            .filter(([name]) => !IGNORE_PROPERTIES.includes(name))
            .forEach(([name, propertySchema]) => this.addProperty(schemas, model, name, propertySchema));

        model.properties = model.properties.sort(sortBy((z) => z.name));
        return model;
    }

    private addProperty(schemas: OpenAPI3SchemaContainer, model: IObjectModel, name: string, schema: OpenAPI3ObjectPropertySchema): void {
        if (this.typesGuard.isSimple(schema)) {
            model.properties.push(this.getSimpleProperty(name, schema));
            return;
        }

        let property: IObjectPropertyModel | undefined;
        if (this.typesGuard.isCollection(schema)) {
            if (this.typesGuard.isSimple(schema.items)) {
                property = this.getSimpleProperty(name, schema.items);
            } else if (this.typesGuard.isReference(schema.items)) {
                property = this.getReferenceProperty(schemas, name, schema.items);
            }

            if (property) {
                property.isCollection = true;
                model.properties.push(property);
                return;
            }
        }

        if (this.typesGuard.isReference(schema)) {
            property = this.getReferenceProperty(schemas, name, schema);
        } else if (this.typesGuard.isAllOf(schema)) {
            property = this.getReferenceProperty(schemas, name, first(schema.allOf));
        }

        if (property) {
            model.properties.push(property);
            return;
        }
    }

    private getSimpleProperty(name: string, schema: OpenAPI3SimpleSchema): IObjectPropertyModel {
        const common = { name, isCollection: false, isNullable: Boolean(schema.nullable) };
        if (this.typesGuard.isGuid(schema)) {
            return this.getGuidProperty(name, common.isNullable);
        }

        if (this.typesGuard.isDate(schema)) {
            return {
                ...common,
                kind: PropertyKind.Date,
                type: 'Date',
                dtoType: 'string'
            };
        }

        if (this.typesGuard.isBoolean(schema)) {
            return {
                ...common,
                kind: PropertyKind.None,
                type: 'boolean',
                dtoType: 'boolean'
            };
        }

        if (this.typesGuard.isNumber(schema)) {
            return {
                ...common,
                kind: PropertyKind.None,
                type: 'number',
                dtoType: 'number'
            };
        }

        return {
            ...common,
            kind: PropertyKind.None,
            type: 'string',
            dtoType: 'string'
        };
    }

    private getGuidProperty(name: string, isNullable: boolean): IObjectPropertyModel {
        return { kind: PropertyKind.Guid, isCollection: false, name, isNullable, type: 'Guid', dtoType: 'string' };
    }

    private getReferenceProperty(schemas: OpenAPI3SchemaContainer, name: string, schema: IOpenAPI3Reference): IObjectPropertyModel {
        const schemaKey = last(schema.$ref.split('/'));
        const referenceSchema = schemas[schemaKey];
        if (this.typesGuard.isEnum(referenceSchema)) {
            return {
                kind: PropertyKind.None,
                isCollection: false,
                name,
                isNullable: false,
                type: schemaKey,
                dtoType: schemaKey
            };
        }

        let kind = PropertyKind.Object;
        if (this.isIdentity(referenceSchema)) {
            kind = PropertyKind.Identity;
        }

        return {
            kind,
            isCollection: false,
            name,
            isNullable: true,
            type: schemaKey,
            dtoType: this.getInterfaceName(schemaKey)
        };
    }

    private getInterfaces(identities: IIdentityModel[], objects: IObjectModel[]): IInterfaceModel[] {
        const interfaces: IInterfaceModel[] = [];
        if (identities.length) {
            const identityModel = first(identities);
            interfaces.push({
                name: this.getInterfaceName(COMMON_IDENTITY_NAME),
                properties: [{ name: identityModel.property.name, dtoType: identityModel.property.dtoType, isCollection: false }]
            });
        }

        return interfaces.concat(
            objects.map((z) => ({
                name: this.getInterfaceName(z.name),
                properties: z.properties.map((x) => ({ name: x.name, dtoType: x.dtoType, isCollection: x.isCollection }))
            }))
        );
    }

    private getInterfaceName(name: string): string {
        return `I${name}`;
    }

    private isIdentity(schema: IOpenAPI3ObjectSchema): boolean {
        return schema.properties && Object.keys(schema.properties)?.length === 1 && this.typesGuard.isGuid(schema.properties['id']);
    }
}
