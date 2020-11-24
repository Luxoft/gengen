import { IOpenAPI3Reference } from './v3/reference';
import { IOpenAPI3AllOfSchema } from './v3/schemas/all-of-schema';
import { IOpenAPI3ArraySchema } from './v3/schemas/array-schema';
import { IOpenAPI3EnumSchema } from './v3/schemas/enum-schema';
import { IOpenAPI3GuidSchema } from './v3/schemas/guid-schema';
import { IOpenAPI3ObjectSchema } from './v3/schemas/object-schema';
import { IOpenAPI3SimpleSchema } from './v3/schemas/schema';

type SchemaType =
    | IOpenAPI3SimpleSchema
    | IOpenAPI3Reference
    | IOpenAPI3ArraySchema
    | IOpenAPI3ObjectSchema
    | IOpenAPI3EnumSchema
    | IOpenAPI3AllOfSchema
    | undefined;

export class OpenAPITypesGuard {
    public isReference(schema: SchemaType): schema is IOpenAPI3Reference {
        return Boolean((schema as IOpenAPI3Reference)?.$ref);
    }

    public isGuid(schema: SchemaType): schema is IOpenAPI3GuidSchema {
        const guidSchema = schema as IOpenAPI3GuidSchema;
        return guidSchema?.type === 'string' && guidSchema.format === 'uuid';
    }

    public isCollection(schema: SchemaType): schema is IOpenAPI3ArraySchema {
        const arraySchema = schema as IOpenAPI3ArraySchema;
        return arraySchema?.type === 'array' && this.isReference(arraySchema.items);
    }

    public isObject(schema: SchemaType): schema is IOpenAPI3ObjectSchema {
        const objectSchema = schema as IOpenAPI3ObjectSchema;
        return objectSchema?.type === 'object';
    }

    public isAllOf(schema: SchemaType): schema is IOpenAPI3AllOfSchema {
        return Boolean((schema as IOpenAPI3AllOfSchema)?.allOf);
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
}
