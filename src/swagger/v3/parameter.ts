import { IOpenAPI3Reference } from './reference';
import { IOpenAPI3Schema } from './schemas/schema';

export interface IOpenAPI3Parameter {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    required?: boolean;
    schema?: IOpenAPI3Schema | IOpenAPI3Reference;
}
