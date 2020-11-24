import { IEnumModel } from '../models/EnumModel';
import { IIdentityModel } from '../models/IdentityModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { IObjectModel } from '../models/ObjectModel';
import { IObjectPropertyModel } from '../models/ObjectPropertyModel';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { IOpenAPI3EnumSchema } from '../swagger/v3/schemas/enum-schema';
import { IOpenAPI3ObjectSchema, OpenAPI3ObjectPropertySchema } from '../swagger/v3/schemas/object-schema';
import { OpenAPI3SchemaContainer } from '../swagger/v3/schemas/schema';
import { sortBy } from '../utils';

const IGNORE_PROPERTIES = ['startRow', 'rowCount'];

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
                    objects.push(this.toObjectModel(name, schema));
                }
            }
        });

        return {
            enums: enums.sort(sortBy((z) => z.name)),
            identities: identities.sort(sortBy((z) => z.name)),
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

    private toObjectModel(name: string, schema: IOpenAPI3ObjectSchema): IObjectModel {
        const model: IObjectModel = {
            name,
            properties: { dates: [], guids: [], identities: [], objects: [], arrays: [] }
        };

        if (!schema.properties) {
            return model;
        }

        Object.entries(schema.properties).filter(([name]) => !IGNORE_PROPERTIES.includes(name));
        //.forEach(([name, propertySchema]) => this.addProperty(model, name, propertySchema));

        return model;
    }

    private addProperty(model: IObjectModel, name: string, schema: OpenAPI3ObjectPropertySchema): void {
        if (this.typesGuard.isSimple(schema)) {
            if (this.typesGuard.isGuid(schema)) {
                model.properties.guids.push(this.getGuidProperty(name, schema.nullable));
                return;
            }

            if (this.typesGuard.isDate(schema)) {
                model.properties.dates.push(this.getDateProperty(name, schema.nullable));
                return;
            }

            let objectProperty = this.getStringProperty(name, schema.nullable);

            if (this.typesGuard.isBoolean(schema)) {
                objectProperty = this.getBooleanProperty(name, schema.nullable);
            }

            if (this.typesGuard.isNumber(schema)) {
                objectProperty = this.getNumberProperty(name, schema.nullable);
            }

            model.properties.objects.push(objectProperty);
            return;
        }
    }

    private getGuidProperty(name: string, nullable: boolean | undefined = true): IObjectPropertyModel {
        return { name, isNullable: Boolean(nullable), type: 'Guid', dtoType: 'string' };
    }

    private getDateProperty(name: string, nullable: boolean | undefined = true): IObjectPropertyModel {
        return { name, isNullable: Boolean(nullable), type: 'Date', dtoType: 'string' };
    }

    private getBooleanProperty(name: string, nullable: boolean | undefined = true): IObjectPropertyModel {
        return { name, isNullable: Boolean(nullable), type: 'boolean', dtoType: 'boolean' };
    }

    private getNumberProperty(name: string, nullable: boolean | undefined = true): IObjectPropertyModel {
        return { name, isNullable: Boolean(nullable), type: 'number', dtoType: 'number' };
    }

    private getStringProperty(name: string, nullable: boolean | undefined = false): IObjectPropertyModel {
        return { name, isNullable: Boolean(nullable), type: 'string', dtoType: 'string' };
    }
}
