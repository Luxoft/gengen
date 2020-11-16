import { IOpenAPI3StringSchema } from './string-schema';

export interface IOpenAPI3BinarySchema extends IOpenAPI3StringSchema {
    format: 'binary';
}
