import { IEnumModel } from '../models/EnumModel';
import { IIdentityModel } from '../models/IdentityModel';
import { IInterfaceModel } from '../models/InterfaceModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { IObjectModel, IObjectPropertyModel } from '../models/ObjectModel';
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
                if (schema.properties && Object.keys(schema.properties)?.length === 1 && this.typesGuard.isGuid(schema.properties['id'])) {
                    identities.push({ name, property: this.getGuidProperty('id') });
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
        const model: IObjectModel = { name, properties: [] };
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

        if (this.typesGuard.isCollection(schema)) {
            let property: IObjectPropertyModel | undefined;
            if (this.typesGuard.isSimple(schema.items)) {
                property = this.getSimpleProperty(name, schema.items);
            } else if (this.typesGuard.isReference(schema.items)) {
                property = this.getReferenceProperty(schemas, name, schema.items);
            }

            if (property) {
                property.type = `${property.type}[]`;
                property.dtoType = `${property.dtoType}[]`;
                model.properties.push(property);
                return;
            }
        }

        let property: IOpenAPI3Reference | undefined;
        if (this.typesGuard.isReference(schema)) {
            property = schema;
        } else if (this.typesGuard.isAllOf(schema)) {
            property = first(schema.allOf);
        }

        if (property) {
            model.properties.push(this.getReferenceProperty(schemas, name, property));
            return;
        }
    }

    private getSimpleProperty(name: string, schema: OpenAPI3SimpleSchema): IObjectPropertyModel {
        if (this.typesGuard.isGuid(schema)) {
            return this.getGuidProperty(name, schema.nullable);
        }

        if (this.typesGuard.isDate(schema)) {
            return { name, isNullable: Boolean(schema.nullable), type: 'Date', dtoType: 'string' };
        }

        if (this.typesGuard.isBoolean(schema)) {
            return { name, isNullable: Boolean(schema.nullable), type: 'boolean', dtoType: 'boolean' };
        }

        if (this.typesGuard.isNumber(schema)) {
            return { name, isNullable: Boolean(schema.nullable), type: 'number', dtoType: 'number' };
        }

        return { name, isNullable: Boolean(schema.nullable), type: 'string', dtoType: 'string' };
    }

    private getGuidProperty(name: string, nullable: boolean | undefined = true): IObjectPropertyModel {
        return { name, isNullable: Boolean(nullable), type: 'Guid', dtoType: 'string' };
    }

    private getReferenceProperty(schemas: OpenAPI3SchemaContainer, name: string, schema: IOpenAPI3Reference): IObjectPropertyModel {
        const schemaKey = last(schema.$ref.split('/'));
        const referenceSchema = schemas[schemaKey];
        if (this.typesGuard.isEnum(referenceSchema)) {
            return { name, isNullable: false, type: schemaKey, dtoType: schemaKey };
        }

        return { name, isNullable: true, type: schemaKey, dtoType: this.getInterfaceName(schemaKey) };
    }

    private getInterfaces(identities: IIdentityModel[], objects: IObjectModel[]): IInterfaceModel[] {
        const interfaces: IInterfaceModel[] = [];
        if (identities.length) {
            const identityModel = first(identities);
            interfaces.push({
                name: this.getInterfaceName(COMMON_IDENTITY_NAME),
                properties: [{ name: identityModel.property.name, dtoType: identityModel.property.dtoType }]
            });
        }

        return interfaces.concat(
            objects.map((z) => ({
                name: this.getInterfaceName(z.name),
                properties: z.properties.map((x) => ({ name: x.name, dtoType: x.dtoType }))
            }))
        );
    }

    private getInterfaceName(name: string): string {
        return `I${name}`;
    }
}
