import { IEnumModel } from './EnumModel';
import { IIdentityModel } from './IdentityModel';
import { IInterfaceModel, IInterfaceUnionModel } from './InterfaceModel';
import { IObjectModel } from './ObjectModel';

export interface IModelsContainer {
    enums: IEnumModel[];
    interfaces: IInterfaceModel[];
    unionInterfaces: IInterfaceUnionModel[];
    identities: IIdentityModel[];
    objects: IObjectModel[];
}
