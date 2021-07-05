import { MethodKind } from '../kinds/MethodKind';
import { MethodOperation } from '../kinds/MethodOperation';
import { IBodyParameter } from './IBodyParameter';
import { IPathParameter } from './IPathParameter';
import { IQueryParameter } from './IQueryParameter';
import { IReturnType } from './IReturnType';

export interface IMethodModel {
    kind: MethodKind;
    operation: MethodOperation;
    name: string;
    parameters: (IPathParameter | IQueryParameter | IBodyParameter)[];
    returnType: IReturnType | undefined;
    originUri: string;
}
