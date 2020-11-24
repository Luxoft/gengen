import { IOpenAPI3PathItem } from './path-item';
import { OpenAPI3SchemaContainer } from './schemas/schema';

export interface IOpenAPI3 {
    openapi: string;
    paths: {
        [key: string]: IOpenAPI3PathItem;
    };
    components: {
        schemas: OpenAPI3SchemaContainer;
    };
}
