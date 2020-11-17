import { IOpenAPI3Reference } from '../reference';
import { IOpenAPI3BaseSchema } from './base-schema';

export interface IOpenAPI3ArraySchema extends IOpenAPI3BaseSchema {
    type: 'array';
    items: IOpenAPI3Reference;
}
