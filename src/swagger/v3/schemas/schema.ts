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

export type OpenAPI3SchemaContainer = { [key: string]: IOpenAPI3ObjectSchema | IOpenAPI3EnumSchema };
