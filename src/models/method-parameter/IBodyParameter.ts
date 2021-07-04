import { ParameterPlace } from '../kinds/ParameterPlace';
import { IParameter } from './IParameter';

export interface IBodyParameter extends IParameter {
    place: ParameterPlace.Body;
    optional: boolean;
    isModel: boolean;
    isCollection: boolean;
}
