import { IOpenAPI3Reference } from '../reference';
import { IOpenAPI3BaseSchema } from './base-schema';
import { OpenAPI3SimpleSchema } from './schema';

export interface IOpenAPI3ArraySchema extends IOpenAPI3BaseSchema {
    type: 'array';
    items: OpenAPI3SimpleSchema | IOpenAPI3Reference;
}
