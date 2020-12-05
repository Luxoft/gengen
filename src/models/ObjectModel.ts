import { IType } from './TypeModel';

export interface IObjectPropertyModel extends IType {
    name: string;
    isNullable: boolean;
    isCollection: boolean;
}

export interface IObjectModel {
    name: string;
    dtoType: string;
    properties: IObjectPropertyModel[];
}
