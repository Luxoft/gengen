export interface IInterfacePropertyModel {
    name: string;
    dtoType: string;
    isCollection: boolean;
}

export interface IInterfaceModel {
    name: string;
    properties: IInterfacePropertyModel[];
}
