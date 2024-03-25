import { IType } from './TypeModel';

export interface IObjectPropertyModel extends IType {
    name: string;
    isNullable: boolean;
    isCollection: boolean;
    typeAlias?: string;
    dtoTypeAlias?: string;
}

export interface IObjectModel {
    name: string;
    dtoType: string;
    isNullable: boolean;
    properties: IObjectPropertyModel[];
    combineTypes: string[];
}

export interface IObjectUnionModel {
    name: string;
    baseTypeName: string;
    unionTypesNames: string[];
}
