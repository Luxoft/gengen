import { IInterfacePropertyModel } from '../../models/InterfaceModel';
import { TYPES_NAMESPACE } from './consts';
import { typeOrUndefined } from './typeOrUndefined';

interface ITypeSerializerOptions {
    isCollection?: boolean;
    isNullable?: boolean;
    isOptional?: boolean;
    type: string;
}

export class TypeSerializer {
    public static fromInterfaceProperty(param: IInterfacePropertyModel): TypeSerializer {
        return new TypeSerializer({
            isCollection: param.isCollection,
            isNullable: param.isNullable,
            type: param.dtoType
        });
    }

    public static fromTypeName(typeName: string): TypeSerializer {
        return new TypeSerializer({
            type: typeName
        });
    }

    private isCollection: boolean;
    private isNullable: boolean;
    private isOptional: boolean;
    private type: string;

    constructor(options: ITypeSerializerOptions) {
        this.isCollection = options.isCollection ?? false;
        this.isNullable = options.isNullable ?? false;
        this.isOptional = options.isOptional ?? true;
        this.type = options.type;
    }

    public toString(): string {
        const typeName = this.isCollection ? `${this.type}[]` : this.type;
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
