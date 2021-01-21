import { MethodKind } from '../models/kinds/MethodKind';
import { MethodOperation } from '../models/kinds/MethodOperation';
import { ParameterPlace } from '../models/kinds/ParameterPlace';
import { PropertyKind } from '../models/kinds/PropertyKind';
import { IMethodModel, IMethodParameterModel, IReturnType } from '../models/MethodModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { IServiceModel } from '../models/ServiceModel';
import { IOpenAPI3Operations, OpenAPIService } from '../swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { IOpenAPI3Operation } from '../swagger/v3/operation';
import { IOpenAPI3Parameter } from '../swagger/v3/parameter';
import { IOpenAPI3Reference } from '../swagger/v3/reference';
import { IOpenAPI3ArraySchema } from '../swagger/v3/schemas/array-schema';
import { OpenAPI3ResponseSchema } from '../swagger/v3/schemas/schema';
import { lowerFirst, sortBy } from '../utils';
import { EndpointsService } from './EndpointsService';
import { TypesService } from './TypesService';

interface IModel {
    name: string;
    dtoType: string;
    kind: PropertyKind;
}

export class ServiceMappingService {
    constructor(
        private readonly endpointsService: EndpointsService,
        private readonly openAPIService: OpenAPIService,
        private readonly typesService: TypesService,
        private readonly typesGuard: OpenAPITypesGuard
    ) {}

    public toServiceModels(operations: IOpenAPI3Operations, models: IModelsContainer): IServiceModel[] {
        const services = Object.entries(operations).reduce<IServiceModel[]>((store, [endpoint, model]) => {
            const info = this.endpointsService.parse(endpoint);

            // TODO Handle paths without methods
            if (!info || !info.action.name) {
                return store;
            }

            const service = store.find((z) => z.name === info.name);
            if (service) {
                service.methods.push(this.getMethod(info.action.name, model.method, model.operation, models));
                return store;
            }

            store.push({
                name: info.name,
                relativePath: info.relativePath,
                methods: [this.getMethod(info.action.name, model.method, model.operation, models)]
            });
            return store;
        }, []);

        services.forEach((z) => {
            z.methods = z.methods.sort(sortBy((x) => x.name));
        });

        return services.sort(sortBy((z) => z.name));
    }

    private getMethod(actionName: string, method: MethodOperation, operation: IOpenAPI3Operation, models: IModelsContainer): IMethodModel {
        const model: IMethodModel = {
            kind: this.hasDownloadResponse(operation) ? MethodKind.Download : MethodKind.Default,
            name: lowerFirst(actionName),
            operation: method,
            parameters: this.getQueryParameters(operation.parameters, models),
            returnType: this.getReturnType(operation.responses[200].content?.['application/json']?.schema, models)
        };

        const bodyParameter = this.getBodyParameter(operation.requestBody?.content['application/json']?.schema, models);
        if (bodyParameter) {
            model.parameters.push(bodyParameter);
        }

        if (operation.requestBody?.content['multipart/form-data']?.schema) {
            model.parameters.push({
                name: 'data',
                place: ParameterPlace.Body,
                dtoType: 'FormData',
                optional: false,
                isCollection: false,
                isModel: false
            });
        }

        if (model.kind == MethodKind.Download) {
            model.returnType = {
                isCollection: false,
                isModel: false,
                type: { kind: PropertyKind.Object, type: 'IDownloadResult', dtoType: 'IDownloadResult' }
            };

            model.parameters.push({
                name: 'saveAs',
                place: ParameterPlace.Body,
                optional: true,
                dtoType: 'string',
                isCollection: false,
                isModel: false
            });
        }

        return model;
    }

    private getQueryParameters(parameters: IOpenAPI3Parameter[] | undefined, models: IModelsContainer): IMethodParameterModel[] {
        return (
            parameters?.map((z) => {
                const parameter = {
                    name: lowerFirst(z.name),
                    optional: z.required === undefined ? false : !z.required,
                    place: ParameterPlace.Query,
                    isCollection: false,
                    dtoType: '',
                    isModel: false
                };

                if (this.typesGuard.isSimple(z.schema)) {
                    parameter.dtoType = this.typesService.getSimpleType(z.schema).dtoType;
                    return parameter;
                }

                if (this.typesGuard.isReference(z.schema)) {
                    parameter.dtoType = this.findModel(models, z.schema)?.dtoType ?? '';
                    parameter.isModel = true;
                    return parameter;
                }

                return parameter;
            }) ?? []
        );
    }

    private getBodyParameter(
        schema: IOpenAPI3ArraySchema | IOpenAPI3Reference | undefined,
        models: IModelsContainer
    ): IMethodParameterModel | undefined {
        let model: IModel | undefined;
        let isCollection = false;
        if (this.typesGuard.isReference(schema)) {
            model = this.findModel(models, schema);
        } else if (this.typesGuard.isCollection(schema) && this.typesGuard.isReference(schema.items)) {
            isCollection = true;
            model = this.findModel(models, schema.items);
        }

        if (!model) {
            return undefined;
        }

        return {
            name: lowerFirst(model.name),
            place: ParameterPlace.Body,
            optional: false,
            dtoType: model.dtoType,
            isCollection,
            isModel: true
        };
    }

    private getReturnType(schema: OpenAPI3ResponseSchema | undefined, models: IModelsContainer): IReturnType | undefined {
        let model: IModel | undefined;
        let isCollection = false;

        if (this.typesGuard.isSimple(schema)) {
            return { isCollection, isModel: false, type: this.typesService.getSimpleType(schema) };
        }

        if (this.typesGuard.isReference(schema)) {
            model = this.findModel(models, schema);
        } else if (this.typesGuard.isCollection(schema)) {
            isCollection = true;

            if (this.typesGuard.isSimple(schema.items)) {
                return { isCollection, isModel: false, type: this.typesService.getSimpleType(schema.items) };
            }

            if (this.typesGuard.isReference(schema.items)) {
                model = this.findModel(models, schema.items);
            }
        }

        if (!model) {
            return undefined;
        }

        return { isCollection, isModel: true, type: { kind: model.kind, dtoType: model.dtoType, type: model.name } };
    }

    private hasDownloadResponse(operation: IOpenAPI3Operation): boolean {
        return Boolean(operation.responses[200].content?.['application/octet-stream']);
    }

    private findModel(models: IModelsContainer, ref: IOpenAPI3Reference): IModel | undefined {
        const name = this.openAPIService.getSchemaKey(ref);

        const objectModel = models.objects.find((z) => z.name === name);
        if (objectModel) {
            return { kind: PropertyKind.Object, name, dtoType: objectModel.dtoType };
        }

        const identityModel = models.identities.find((z) => z.name === name);
        if (identityModel) {
            return { kind: PropertyKind.Identity, name, dtoType: identityModel.dtoType };
        }

        const enumModel = models.enums.find((z) => z.name === name);
        if (enumModel) {
            return { kind: PropertyKind.Enum, name, dtoType: name };
        }

        return undefined;
    }
}
