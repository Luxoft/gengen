import { IEnumModel } from '../models/EnumModel';
import { IIdentityModel } from '../models/IdentityModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { IOpenAPI3EnumSchema } from '../swagger/v3/schemas/enum-schema';
import { IOpenAPI3SchemaContainer } from '../swagger/v3/schemas/schema';
import { sortBy } from '../utils';

export class ModelMappingService {
    public static ToModelsContainer(schemas: IOpenAPI3SchemaContainer): IModelsContainer {
        const enums: IEnumModel[] = [];
        const identities: IIdentityModel[] = [];

        Object.entries(schemas).forEach(([name, schema]) => {
            if (OpenAPITypesGuard.isEnum(schema)) {
                enums.push(this.ToEnumModel(name, schema));
                return;
            }

            if (
                OpenAPITypesGuard.isObject(schema) &&
                schema.properties &&
                Object.keys(schema.properties)?.length === 1 &&
                OpenAPITypesGuard.isGuid(schema.properties['id'])
            ) {
                identities.push({ name });
                return;
            }
        });

        return {
            enums: enums.sort(sortBy((z) => z.name)),
            identities: identities.sort(sortBy((z) => z.name))
        };
    }

    private static ToEnumModel(name: string, schema: IOpenAPI3EnumSchema): IEnumModel {
        return {
            name,
            items: schema.enum.map((value, index) => ({
                key: schema['x-enumNames'][index],
                value
            }))
        };
    }
}
