import { IOpenAPI3BaseSchema } from './base-schema';

export interface IOpenAPI3NumberSchema extends IOpenAPI3BaseSchema {
    type: 'integer' | 'number';
}
