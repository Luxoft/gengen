import { PropertyKind } from './PropertyKind';

export interface IObjectPropertyModel {
    kind: PropertyKind;
    name: string;
    type: string;
    dtoType: string;
    isNullable: boolean;
    isCollection: boolean;
}

export interface IObjectModel {
    name: string;
    dtoType: string;
    properties: IObjectPropertyModel[];
}
