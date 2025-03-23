export interface IInterfacePropertyModel {
    isCollection: boolean;
    name: string;
    dtoType: string;
    isNullable: boolean;
    isRequired: boolean;
}

export interface IInterfaceModel {
    name: string;
    properties: IInterfacePropertyModel[];
}

export interface IExtendedInterfaceModel extends IInterfaceModel {
    extendingInterfaces: string[];
}

export type InterfaceModel = IInterfaceModel | IExtendedInterfaceModel;
