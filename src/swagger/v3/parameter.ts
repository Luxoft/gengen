import { IOpenAPI3Reference } from './reference';
import { IOpenAPI3ArraySchema } from './schemas/array-schema';
import { OpenAPI3SimpleSchema } from './schemas/schema';

export interface IOpenAPI3Parameter {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    required?: boolean;
    schema?: OpenAPI3SimpleSchema | IOpenAPI3Reference | IOpenAPI3ArraySchema;
}
