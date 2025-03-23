import { IInterfacePropertyModel } from '../../models/InterfaceModel';
import { TYPES_NAMESPACE } from './consts';
import { typeOrUndefined } from './typeOrUndefined';

interface IType {
    name: string;
    isInterface?: boolean;
}

interface ITypeSerializerOptions {
    isCollection?: boolean;
    isNullable?: boolean;
    isOptional?: boolean;
    type: IType;
}

export class TypeSerializer {
    public static fromInterfaceProperty(param: IInterfacePropertyModel): TypeSerializer {
        return new TypeSerializer({
            isCollection: param.isCollection,
            // TODO: by design object model in strong typed (c#) languages can combine isRequired=true and isNullable=true,
            // but it's a strange for UI contract, so any required field will count as Non-Nullable
            isNullable: !param.isRequired && param.isNullable,
            isOptional: !param.isRequired,
            type: {
                name: param.dtoType,
                isInterface: true
            }
        });
    }

    public static fromTypeName(typeName: string): TypeSerializer {
        return new TypeSerializer({
            type: { name: typeName }
        });
    }

    private isCollection: boolean;
    private isNullable: boolean;
    private isOptional: boolean;
    private type: IType;

    constructor(options: ITypeSerializerOptions) {
        this.isCollection = options.isCollection ?? false;
        this.isNullable = options.isNullable ?? false;
        this.isOptional = options.isOptional ?? true;
        this.type = options.type;
    }

    public toString(): string {
        const typeName = this.isCollection ? `${this.type.name}[]` : this.type.name;

        if (this.isCollection && !this.type.isInterface) {
            return typeName;
        }

        switch (true) {
            case this.isNullable:
                return this.typeOrUndefinedNullable(typeName);
            case this.isOptional:
                return this.typeOrUndefined(typeName);
            default:
                return typeName;
        }
    }

    private typeOrUndefined(type: string): string {
        return typeOrUndefined(type);
    }

    private typeOrUndefinedNullable(type: string): string {
        return `${TYPES_NAMESPACE}.TypeOrUndefinedNullable<${type}>`;
    }
}
