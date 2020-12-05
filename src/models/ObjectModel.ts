import { PropertyKind } from './kinds/PropertyKind';
import { IFullTypeModel, ITypeModel } from './TypeModel';

export interface IObjectPropertyModel extends IFullTypeModel {
    kind: PropertyKind;
    isNullable: boolean;
    isCollection: boolean;
}

export interface IObjectModel extends ITypeModel {
    properties: IObjectPropertyModel[];
}
