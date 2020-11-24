import { IOpenAPI3Reference } from '../reference';
import { IOpenAPI3AllOfSchema } from './all-of-schema';
import { IOpenAPI3ArraySchema } from './array-schema';
import { IOpenAPI3BaseSchema } from './base-schema';
import { OpenAPI3SimpleSchema } from './schema';

export type OpenAPI3ObjectPropertySchema = OpenAPI3SimpleSchema | IOpenAPI3ArraySchema | IOpenAPI3Reference | IOpenAPI3AllOfSchema;

export interface IOpenAPI3ObjectSchema extends IOpenAPI3BaseSchema {
    type: 'object';
    properties: {
        [key: string]: OpenAPI3ObjectPropertySchema;
    };
}
