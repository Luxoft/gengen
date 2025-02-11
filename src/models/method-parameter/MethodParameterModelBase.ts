import { TypesService } from '../../services/TypesService';
import { OpenAPIService } from '../../swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../swagger/OpenAPITypesGuard';
import { IOpenAPI3Parameter } from '../../swagger/v3/parameter';
import { IOpenAPI3Reference } from '../../swagger/v3/reference';
import { IOpenAPI3ArraySchema } from '../../swagger/v3/schemas/array-schema';
import { OpenAPI3SimpleSchema } from '../../swagger/v3/schemas/schema';
import { lowerFirst } from '../../utils';
import { ParameterPlace } from '../kinds/ParameterPlace';
import { IParameter } from './IParameter';

export abstract class MethodParameterModelBase implements IParameter {
    public name: string;
    public dtoType!: string;
    public isModel!: boolean;
    public isCollection: boolean = false;
    public abstract place: ParameterPlace;

    constructor(
        private typesService: TypesService,
        private model: IOpenAPI3Parameter,
        private typesGuard: OpenAPITypesGuard,
        private openAPIService: OpenAPIService
    ) {
        this.name = lowerFirst(this.model.name);
        this.validate();
        this.setup();
    }
    private setup(): void {
        if (!this.model.schema) {
            throw new Error(`model.schema is not defined for parameter '${this.name}'`);
        }

        if (this.typesGuard.isSimple(this.model.schema)) {
            this.setupSimple(this.model.schema);
            return;
        }

        if (this.typesGuard.isCollection(this.model.schema)) {
            this.setupCollection(this.model.schema);
            return;
        }

        if (this.typesGuard.isEnum(this.openAPIService.getRefSchema(this.model.schema))) {
            this.setupRef(this.model.schema);
            return;
        }

        throw new Error(`Type for parameter ${this.name} is not found. Schema ${JSON.stringify(this.model.schema)}`);
    }

    private setupRef(schema: IOpenAPI3Reference): void {
        this.dtoType = this.openAPIService.getSchemaKey(schema);
        this.isModel = true;
    }

    private setupCollection(schema: IOpenAPI3ArraySchema): void {
        this.dtoType = this.typesService.getSimpleType(schema.items as OpenAPI3SimpleSchema).dtoType;
        this.isModel = false;
        this.isCollection = true;
    }

    private setupSimple(schema: OpenAPI3SimpleSchema): void {
        this.dtoType = this.typesService.getSimpleType(schema).dtoType;
        this.isModel = false;
    }

    private validate(): void {
        if (!this.typesGuard.isReference(this.model.schema)) {
            return;
        }

        const refSchema = this.openAPIService.getRefSchema(this.model.schema);
        if (this.typesGuard.isEnum(refSchema)) {
            return;
        }

        throw new Error(`${this.model.in === 'path' ? 'Path' : 'Query'} parameter '${this.name}' is reference type. It's not allow`);
    }
}
