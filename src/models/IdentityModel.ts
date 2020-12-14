import { IObjectPropertyModel } from './ObjectModel';

export interface IIdentityModel {
    name: string;
    dtoType: string;
    property: IObjectPropertyModel;
}
