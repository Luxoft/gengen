import { IOpenAPI3StringSchema } from './string-schema';

export interface IOpenAPI3GuidSchema extends IOpenAPI3StringSchema {
    format: 'uuid';
}
