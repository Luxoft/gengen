import { IEnumModel } from '../models/EnumModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { IOpenAPI3SchemaContainer } from '../swagger/v3/schemas/schema';
import { sortBy } from '../utils';

export class ModelMappingService {
    public static ToModelsContainer(schemas: IOpenAPI3SchemaContainer): IModelsContainer {
        const enums: IEnumModel[] = [];

        Object.entries(schemas).forEach(([name, schema]) => {
            if (OpenAPITypesGuard.isEnum(schema)) {
                enums.push({
                    name,
                    items: schema.enum.map((value, index) => ({
                        key: schema['x-enumNames'][index],
                        value
                    }))
                });
            }
        });

        return {
            enums: enums.sort(sortBy((z) => z.name))
        };
    }
}
