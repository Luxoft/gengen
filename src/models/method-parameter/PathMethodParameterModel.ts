import { TypesService } from '../../services/TypesService';
import { OpenAPIService } from '../../swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../swagger/OpenAPITypesGuard';
import { IOpenAPI3Parameter } from '../../swagger/v3/parameter';
import { ParameterPlace } from '../kinds/ParameterPlace';
import { IPathParameter } from './IPathParameter';
import { MethodParameterModelBase } from './MethodParameterModelBase';

export class PathMethodParameterModel extends MethodParameterModelBase implements IPathParameter {
    public place: ParameterPlace.Path;

    constructor(model: IOpenAPI3Parameter, typesGuard: OpenAPITypesGuard, typesService: TypesService, openAPIService: OpenAPIService) {
        super(typesService, model, typesGuard, openAPIService);
        this.place = ParameterPlace.Path;
    }
}
