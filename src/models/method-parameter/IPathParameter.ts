import { ParameterPlace } from '../kinds/ParameterPlace';
import { IParameter } from './IParameter';

export interface IPathParameter extends IParameter {
    place: ParameterPlace.Path;
}
