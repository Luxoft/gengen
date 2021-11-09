import { MethodKind } from '../kinds/MethodKind';
import { MethodOperation } from '../kinds/MethodOperation';
import { IBodyParameter } from './IBodyParameter';
import { IPathParameter } from './IPathParameter';
import { IQueryParameter } from './IQueryParameter';
import { IReturnType } from './IReturnType';

export type MethodParameter = IPathParameter | IQueryParameter | IBodyParameter;

export interface IMethodModel {
    kind: MethodKind;
    operation: MethodOperation;
    name: string;
    parameters: MethodParameter[];
    returnType: IReturnType | undefined;
    originUri: string;
}
