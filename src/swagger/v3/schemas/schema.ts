import { IOpenAPI3BooleanSchema } from './boolean-schema';
import { IOpenAPI3DateSchema } from './date-schema';
import { IOpenAPI3EnumSchema } from './enum-schema';
import { IOpenAPI3GuidSchema } from './guid-schema';
import { IOpenAPI3NumberSchema } from './number-schema';
import { IOpenAPI3StringSchema } from './string-schema';

export type IOpenAPI3Schema =
    IOpenAPI3StringSchema |
    IOpenAPI3NumberSchema |
    IOpenAPI3GuidSchema |
    IOpenAPI3EnumSchema |
    IOpenAPI3DateSchema |
    IOpenAPI3BooleanSchema;
