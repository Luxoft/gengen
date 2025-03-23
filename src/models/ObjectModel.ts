import { IType } from './TypeModel';

export interface IObjectPropertyModel extends IType {
    name: string;
    isCollection: boolean;
    isRequired: boolean;
}

export interface IObjectModel {
    name: string;
    dtoType: string;
    isNullable: boolean;
    properties: IObjectPropertyModel[];
}

export interface IExtendedObjectModel extends IObjectModel {
    extendingTypes: string[];
}

export type ObjectModel = IObjectModel | IExtendedObjectModel;
