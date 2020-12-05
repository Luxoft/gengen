import { MethodKind } from './kinds/MethodKind';
import { MethodOperation } from './kinds/MethodOperation';
import { MethodPlace } from './kinds/MethodPlace';
import { IFullTypeModel, ITypeModel } from './TypeModel';

export interface IMethodParameterModel extends ITypeModel {
    place: MethodPlace;
    optional: boolean;
}

export interface IMethodModel {
    kind: MethodKind;
    operation: MethodOperation;
    name: string;
    parameters: IMethodParameterModel[];
    returnType: IFullTypeModel;
}
