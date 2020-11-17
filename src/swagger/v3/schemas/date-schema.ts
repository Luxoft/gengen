import { IOpenAPI3StringSchema } from './string-schema';

export interface IOpenAPI3DateSchema extends IOpenAPI3StringSchema {
    format: 'date-time';
}
