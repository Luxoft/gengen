export interface IObjectPropertyModel {
    type: string;
    isNullable: boolean;
    name: string;
    dtoType: string;
}

export interface IObjectModel {
    name: string;

    properties: IObjectPropertyModel[];
}
