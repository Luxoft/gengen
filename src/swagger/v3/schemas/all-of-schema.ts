import { IOpenAPI3Reference } from '../reference';
import { IOpenAPI3BaseSchema } from './base-schema';

export interface IOpenAPI3AllOfSchema extends IOpenAPI3BaseSchema {
    allOf: IOpenAPI3Reference[];
}
