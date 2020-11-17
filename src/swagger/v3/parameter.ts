import { IOpenAPI3Reference } from './reference';
import { IOpenAPI3SimpleSchema } from './schemas/schema';

export interface IOpenAPI3Parameter {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    required?: boolean;
    schema?: IOpenAPI3SimpleSchema | IOpenAPI3Reference;
}
