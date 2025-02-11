import { TypesService } from '../../services/TypesService';
import { OpenAPIService } from '../../swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../swagger/OpenAPITypesGuard';
import { IOpenAPI3Parameter } from '../../swagger/v3/parameter';
import { IOpenAPI3ArraySchema } from '../../swagger/v3/schemas/array-schema';
import { ParameterPlace } from '../kinds/ParameterPlace';
import { IQueryParameter } from './IQueryParameter';
import { MethodParameterModelBase } from './MethodParameterModelBase';

export class QueryMethodParameterModel extends MethodParameterModelBase implements IQueryParameter {
    public place: ParameterPlace.Query;
    public optional: boolean;
    isCollection: boolean;

    constructor(model: IOpenAPI3Parameter, typesGuard: OpenAPITypesGuard, typesService: TypesService, openAPIService: OpenAPIService, isCollection: boolean = false) {
        super(typesService, model, typesGuard, openAPIService);
        this.optional = this.getOptional(model);
        this.isCollection = this.getIsCollection(model);
        this.place = ParameterPlace.Query;
    }

    private getIsCollection(model: IOpenAPI3Parameter): boolean {
        return (model.schema as IOpenAPI3ArraySchema)?.type === 'array';
    }

    private getOptional(model: IOpenAPI3Parameter): boolean {
        return model.required === undefined ? false : !model.required;
    }
}
