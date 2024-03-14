import { IOpenAPI3Reference } from '../reference';
import { IOpenAPI3BaseSchema } from './base-schema';

export interface IOpenAPI3OneOfSchema extends IOpenAPI3BaseSchema {
    oneOf: IOpenAPI3Reference[];
}
