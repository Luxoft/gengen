import { IObjectPropertyModel } from './ObjectModel';

export interface IIdentityModel {
    name: string;
    isNullable: boolean;
    dtoType: string;
    property: IObjectPropertyModel;
}
