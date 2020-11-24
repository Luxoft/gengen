import { IEnumModel } from './EnumModel';
import { IIdentityModel } from './IdentityModel';
import { IObjectModel } from './ObjectModel';

export interface IModelsContainer {
    enums: IEnumModel[];

    identities: IIdentityModel[];

    objects: IObjectModel[];
}
