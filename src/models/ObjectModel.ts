import { IOpenAPI3Reference } from '../swagger/v3/reference';
import { IType } from './TypeModel';

export interface IObjectPropertyModel extends IType {
    name: string;
    isNullable: boolean;
    isCollection: boolean;
}

export interface IObjectModel {
    name: string;
    dtoType: string;
    isNullable: boolean;
    properties: IObjectPropertyModel[];
    combineTypes: string[];
    combineTypesRefs: IOpenAPI3Reference[];
}
