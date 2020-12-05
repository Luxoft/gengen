import { ITypeModel } from './TypeModel';

export interface IInterfacePropertyModel extends ITypeModel {
    isCollection: boolean;
}

export interface IInterfaceModel {
    name: string;
    properties: IInterfacePropertyModel[];
}
