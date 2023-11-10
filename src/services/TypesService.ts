import { PropertyKind } from '../models/kinds/PropertyKind';
import { IType } from '../models/TypeModel';
import { IOptions } from '../options';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { OpenAPI3SimpleSchema } from '../swagger/v3/schemas/schema';

export class TypesService {
    constructor(
        private readonly typesGuard: OpenAPITypesGuard,
        private readonly settings: IOptions
    ) {}

    public getSimpleType(schema: OpenAPI3SimpleSchema): IType {
        const isNullable = schema.nullable ?? false;
        if (!this.settings.unstrictId && this.typesGuard.isGuid(schema)) {
            return { kind: PropertyKind.Guid, type: 'Guid', dtoType: 'string', isNullable: isNullable };
        }

        if (this.typesGuard.isDate(schema)) {
            return { kind: PropertyKind.Date, type: 'Date', dtoType: 'string', isNullable: isNullable };
        }

        if (this.typesGuard.isBoolean(schema)) {
            return { kind: PropertyKind.None, type: 'boolean', dtoType: 'boolean', isNullable: isNullable };
        }

        if (this.typesGuard.isNumber(schema)) {
            return { kind: PropertyKind.None, type: 'number', dtoType: 'number', isNullable: isNullable };
        }

        return { kind: PropertyKind.None, type: 'string', dtoType: 'string', isNullable: isNullable };
    }
}
