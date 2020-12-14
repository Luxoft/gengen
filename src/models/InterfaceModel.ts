export interface IInterfacePropertyModel {
    isCollection: boolean;
    name: string;
    dtoType: string;
}

export interface IInterfaceModel {
    name: string;
    properties: IInterfacePropertyModel[];
}
