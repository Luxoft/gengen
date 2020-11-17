import { IOpenAPI3BaseSchema } from './base-schema';

export interface IOpenAPI3EnumSchema extends IOpenAPI3BaseSchema {
    type: 'integer';
    format: 'int32';
    enum: number[];
    'x-enumNames': string[];
}
