import { IOpenAPI3BooleanSchema } from './boolean-schema';
import { IOpenAPI3DateSchema } from './date-schema';
import { IOpenAPI3GuidSchema } from './guid-schema';
import { IOpenAPI3NumberSchema } from './number-schema';
import { IOpenAPI3StringSchema } from './string-schema';

export type IOpenAPI3SimpleSchema =
    IOpenAPI3StringSchema |
    IOpenAPI3NumberSchema |
    IOpenAPI3GuidSchema |
    IOpenAPI3DateSchema |
    IOpenAPI3BooleanSchema;
