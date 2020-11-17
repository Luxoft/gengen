import { IOpenAPI3PathItem } from './path-item';
import { IOpenAPI3EnumSchema } from './schemas/enum-schema';
import { IOpenAPI3ObjectSchema } from './schemas/object-schema';

export interface IOpenAPI3 {
    openapi: string;
    paths: {
        [key: string]: IOpenAPI3PathItem;
    };
    components: {
        schemas: {
            [key: string]: IOpenAPI3ObjectSchema | IOpenAPI3EnumSchema;
        }
    };
}
