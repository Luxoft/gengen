import { TypesService } from '../../services/TypesService';
import { OpenAPITypesGuard } from '../../swagger/OpenAPITypesGuard';
import { IOpenAPI3Parameter } from '../../swagger/v3/parameter';
import { ParameterPlace } from '../kinds/ParameterPlace';
import { IQueryParameter } from "./IQueryParameter";
import { MethodParameterModelBase } from './MethodParameterModelBase';

export class QueryMethodParameterModel extends MethodParameterModelBase implements IQueryParameter {
    public place: ParameterPlace.Query;
    public optional: boolean;

    constructor(model: IOpenAPI3Parameter, typesGuard: OpenAPITypesGuard, typesService: TypesService) {
        super(model, typesGuard, typesService);
        this.optional = this.getOptional(model);
        this.place = ParameterPlace.Query;
    }

    private getOptional(model: IOpenAPI3Parameter): boolean {
        return model.required === undefined ? false : !model.required;
    }
}
