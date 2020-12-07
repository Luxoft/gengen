import { IOpenAPI3Reference } from '../reference';
import { IOpenAPI3ArraySchema } from './array-schema';
import { IOpenAPI3BooleanSchema } from './boolean-schema';
import { IOpenAPI3DateSchema } from './date-schema';
import { IOpenAPI3EnumSchema } from './enum-schema';
import { IOpenAPI3GuidSchema } from './guid-schema';
import { IOpenAPI3NumberSchema } from './number-schema';
import { IOpenAPI3ObjectSchema } from './object-schema';
import { IOpenAPI3StringSchema } from './string-schema';

export type OpenAPI3SimpleSchema =
    | IOpenAPI3StringSchema
    | IOpenAPI3NumberSchema
    | IOpenAPI3GuidSchema
    | IOpenAPI3DateSchema
    | IOpenAPI3BooleanSchema;

export type OpenAPI3ResponseSchema = IOpenAPI3ArraySchema | OpenAPI3SimpleSchema | IOpenAPI3Reference;

export type OpenAPI3SchemaContainer = { [key: string]: IOpenAPI3ObjectSchema | IOpenAPI3EnumSchema };
