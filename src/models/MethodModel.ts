import { MethodKind } from './kinds/MethodKind';
import { MethodOperation } from './kinds/MethodOperation';
import { MethodPlace } from './kinds/MethodPlace';
import { IType } from './TypeModel';

export interface IMethodParameterModel {
    name: string;
    isCollection: boolean;
    dtoType: string;
    place: MethodPlace;
    optional: boolean;
    isModel: boolean;
}

export interface IReturnType {
    isCollection: boolean;
    type: IType;
    isModel: boolean;
}

export interface IMethodModel {
    kind: MethodKind;
    operation: MethodOperation;
    name: string;
    parameters: IMethodParameterModel[];
    returnType: IReturnType | undefined;
}
