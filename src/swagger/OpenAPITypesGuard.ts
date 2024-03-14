import { IOpenAPI3Reference } from './v3/reference';
import { IOpenAPI3AllOfSchema } from './v3/schemas/all-of-schema';
import { IOpenAPI3ArraySchema } from './v3/schemas/array-schema';
import { IOpenAPI3BooleanSchema } from './v3/schemas/boolean-schema';
import { IOpenAPI3DateSchema } from './v3/schemas/date-schema';
import { IOpenAPI3EnumSchema } from './v3/schemas/enum-schema';
import { IOpenAPI3GuidSchema } from './v3/schemas/guid-schema';
import { IOpenAPI3NumberSchema } from './v3/schemas/number-schema';
import { IOpenAPI3ObjectSchema } from './v3/schemas/object-schema';
import { IOpenAPI3OneOfSchema } from './v3/schemas/one-of-schema';
import { OpenAPI3SimpleSchema } from './v3/schemas/schema';
import { IOpenAPI3StringSchema } from './v3/schemas/string-schema';

type SchemaType =
    | OpenAPI3SimpleSchema
    | IOpenAPI3Reference
    | IOpenAPI3ArraySchema
    | IOpenAPI3ObjectSchema
    | IOpenAPI3EnumSchema
    | IOpenAPI3AllOfSchema
    | IOpenAPI3OneOfSchema
    | undefined;

export class OpenAPITypesGuard {
    public isReference(schema: SchemaType): schema is IOpenAPI3Reference {
        return Boolean((schema as IOpenAPI3Reference)?.$ref);
    }

    public isGuid(schema: SchemaType): schema is IOpenAPI3GuidSchema {
        return (schema as IOpenAPI3StringSchema)?.type === 'string' && (schema as IOpenAPI3GuidSchema)?.format === 'uuid';
    }

    public isCollection(schema: SchemaType): schema is IOpenAPI3ArraySchema {
        return (schema as IOpenAPI3ArraySchema)?.type === 'array';
    }

    public isObject(schema: SchemaType): schema is IOpenAPI3ObjectSchema {
        return (schema as IOpenAPI3ObjectSchema)?.type === 'object';
    }

    public isAllOf(schema: SchemaType): schema is IOpenAPI3AllOfSchema {
        return Boolean((schema as IOpenAPI3AllOfSchema)?.allOf);
    }

    public isOneOf(schema: SchemaType): schema is IOpenAPI3OneOfSchema {
        return Boolean((schema as IOpenAPI3OneOfSchema).oneOf);
    }

    public isEnum(schema: SchemaType): schema is IOpenAPI3EnumSchema {
        const enumSchema = schema as IOpenAPI3EnumSchema;
        if (!schema) {
            return false;
        }

        return (
            enumSchema.type === 'integer' && enumSchema.format === 'int32' && Boolean(enumSchema.enum) && Boolean(enumSchema['x-enumNames'])
        );
    }

    public isNumber(schema: SchemaType): schema is IOpenAPI3NumberSchema {
        return Boolean(['integer', 'number'].includes((schema as IOpenAPI3NumberSchema)?.type));
    }

    public isString(schema: SchemaType): schema is IOpenAPI3StringSchema {
        return (schema as IOpenAPI3StringSchema)?.type === 'string' && (schema as { format: string | undefined })?.format === undefined;
    }

    public isDate(schema: SchemaType): schema is IOpenAPI3DateSchema {
        return (schema as IOpenAPI3StringSchema)?.type === 'string' && (schema as IOpenAPI3DateSchema)?.format === 'date-time';
    }

    public isBoolean(schema: SchemaType): schema is IOpenAPI3BooleanSchema {
        return (schema as IOpenAPI3BooleanSchema)?.type === 'boolean';
    }

    public isSimple(schema: SchemaType): schema is OpenAPI3SimpleSchema {
        return this.isGuid(schema) || this.isNumber(schema) || this.isDate(schema) || this.isString(schema) || this.isBoolean(schema);
    }
}