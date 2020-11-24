import { IEnumModel } from './EnumModel';
import { IIdentityModel } from './IdentityModel';

export interface IModelsContainer {
    enums: IEnumModel[];

    identities: IIdentityModel[];
}
