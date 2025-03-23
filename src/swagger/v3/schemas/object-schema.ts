import { IOpenAPI3BaseSchema } from './base-schema';
import { OpenAPI3Schema } from './schema';

export interface IOpenAPI3ObjectSchema extends IOpenAPI3BaseSchema {
    type: 'object';
    required?: string[];
    properties: {
        [key: string]: OpenAPI3Schema;
    };
}
