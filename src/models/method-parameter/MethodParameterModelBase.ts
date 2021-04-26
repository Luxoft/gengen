import { TypesService } from '../../services/TypesService';
import { OpenAPITypesGuard } from '../../swagger/OpenAPITypesGuard';
import { IOpenAPI3Parameter } from '../../swagger/v3/parameter';
import { lowerFirst } from '../../utils';
import { ParameterPlace } from '../kinds/ParameterPlace';
import { IParameter } from "./IParameter";

export abstract class MethodParameterModelBase implements IParameter {
    public name: string;
    public dtoType: string;
    public abstract place: ParameterPlace;

    constructor(model: IOpenAPI3Parameter, typesGuard: OpenAPITypesGuard, typesService: TypesService) {
        this.name = lowerFirst(model.name);
        this.dtoType = '';

        if (typesGuard.isSimple(model.schema)) {
            this.dtoType = typesService.getSimpleType(model.schema).dtoType;
        }

        if (typesGuard.isReference(model.schema)) {
            throw new Error(`${model.in === 'path' ? 'Path' : 'Query'} parameter '${this.name}' is reference type. It's not allow`);
        }
    }
}
