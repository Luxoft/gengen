import { ParameterPlace } from '../kinds/ParameterPlace';
import { IParameter } from './IParameter';

export interface IQueryParameter extends IParameter {
    place: ParameterPlace.Query;
    optional: boolean;
    isCollection: boolean;
}
