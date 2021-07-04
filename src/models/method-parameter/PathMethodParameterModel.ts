import { TypesService } from '../../services/TypesService';
import { OpenAPITypesGuard } from '../../swagger/OpenAPITypesGuard';
import { IOpenAPI3Parameter } from '../../swagger/v3/parameter';
import { ParameterPlace } from '../kinds/ParameterPlace';
import { IPathParameter } from "./IPathParameter";
import { MethodParameterModelBase } from './MethodParameterModelBase';

export class PathMethodParameterModel extends MethodParameterModelBase implements IPathParameter {
    public place: ParameterPlace.Path;

    constructor(model: IOpenAPI3Parameter, typesGuard: OpenAPITypesGuard, typesService: TypesService) {
        super(model, typesGuard, typesService);
        this.place = ParameterPlace.Path;
    }
}
