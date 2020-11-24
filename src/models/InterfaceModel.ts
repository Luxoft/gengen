export interface IInterfacePropertyModel {
    name: string;
    dtoType: string;
}

export interface IInterfaceModel {
    name: string;

    properties: IInterfacePropertyModel[];
}
