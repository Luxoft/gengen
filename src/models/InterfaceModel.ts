export interface IInterfacePropertyModel {
    isCollection: boolean;
    name: string;
    dtoType: string;
    isNullable: boolean;
}

export interface IInterfaceModel {
    name: string;
    properties: IInterfacePropertyModel[];
    combineInterfaces: string[];
}

export interface IInterfaceUnionModel {
    name: string;
    parentInterface: string;
    unionInterfaces: string[];
}
