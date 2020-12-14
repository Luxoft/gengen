import { IEnumModel } from './EnumModel';
import { IIdentityModel } from './IdentityModel';
import { IInterfaceModel } from './InterfaceModel';
import { IObjectModel } from './ObjectModel';

export interface IModelsContainer {
    enums: IEnumModel[];
    interfaces: IInterfaceModel[];
    identities: IIdentityModel[];
    objects: IObjectModel[];
}
