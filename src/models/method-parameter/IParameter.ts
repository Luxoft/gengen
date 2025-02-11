import { ParameterPlace } from '../kinds/ParameterPlace';

export interface IParameter {
    name: string;
    dtoType: string;
    place: ParameterPlace;
    isModel: boolean;
    isCollection: boolean;
}
