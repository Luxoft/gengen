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
