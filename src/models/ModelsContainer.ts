import { IEnumModel } from './EnumModel';
import { IIdentityModel } from './IdentityModel';
import { InterfaceModel } from './InterfaceModel';
import { ObjectModel } from './ObjectModel';
import { IUnionModel } from './UnionModel';

export interface IModelsContainer {
    enums: IEnumModel[];
    interfaces: InterfaceModel[];
    unions: IUnionModel[];
    identities: IIdentityModel[];
    objects: ObjectModel[];
}
