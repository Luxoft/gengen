import { MethodKind } from '../models/kinds/MethodKind';
import { MethodOperation } from '../models/kinds/MethodOperation';
import { MethodPlace } from '../models/kinds/MethodPlace';
import { PropertyKind } from '../models/kinds/PropertyKind';
import { IMethodModel, IMethodParameterModel, IReturnType } from '../models/MethodModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { IObjectModel } from '../models/ObjectModel';
import { IServiceModel } from '../models/ServiceModel';
import { IOpenAPI3Operations } from '../swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { IOpenAPI3Operation } from '../swagger/v3/operation';
import { IOpenAPI3Parameter } from '../swagger/v3/parameter';
import { IOpenAPI3Reference } from '../swagger/v3/reference';
import { IOpenAPI3ArraySchema } from '../swagger/v3/schemas/array-schema';
import { lowerFirst, sortBy } from '../utils';
import { EndpointsService, IEndpointInfo } from './EndpointsService';
import { TypesService } from './TypesService';

export class ServiceMappingService {
    constructor(
        private readonly endpointsService: EndpointsService,
        private readonly typesService: TypesService,
        private readonly typesGuard: OpenAPITypesGuard
    ) { }

    public toServiceModels(operations: IOpenAPI3Operations, models: IModelsContainer): IServiceModel[] {
        const services = Object.entries(operations).reduce<IServiceModel[]>((store, [endpoint, model]) => {
            const info = this.endpointsService.parse(endpoint);
            if (!info) {
                return store;
            }

            const service = store.find((z) => z.name === info.name);
            if (service) {
                service.methods.push(this.getMethod(info, model.method, model.operation, models));
                return store;
            }

            store.push({
                name: info.name,
                relativePath: info.relativePath,
                methods: [this.getMethod(info, model.method, model.operation, models)]
            });
            return store;
        }, []);

        services.forEach((z) => {
            z.methods = z.methods.sort(sortBy((x) => x.name));
        });

        return services.sort(sortBy((z) => z.name));
    }

    private getMethod(
        endpointInfo: IEndpointInfo,
        method: MethodOperation,
        operation: IOpenAPI3Operation,
        models: IModelsContainer
    ): IMethodModel {
        const model: IMethodModel = {
            kind: this.hasDownloadResponse(operation) ? MethodKind.Download : MethodKind.None,
            name: lowerFirst(endpointInfo.action.name),
            operation: method,
            parameters: this.getQueryParameters(operation.parameters, models),
            returnType: this.getReturnType(operation.responses[200].content?.['application/json'].schema, models)
        };

        const bodyParameter = this.getBodyParameter(operation.requestBody?.content['application/json'].schema, models);
        if (bodyParameter) {
            model.parameters.push(bodyParameter);
        }

        if (model.kind == MethodKind.Download) {
            model.returnType = {
                isCollection: false,
                type: { kind: PropertyKind.Object, type: 'IDownloadResult', dtoType: 'IDownloadResult' }
            };

            model.parameters.push({ name: 'saveAs', place: MethodPlace.Body, optional: true, dtoType: 'string', isCollection: false });
        }

        return model;
    }

    private getQueryParameters(parameters: IOpenAPI3Parameter[] | undefined, models: IModelsContainer): IMethodParameterModel[] {
        return (
            parameters?.map((z) => {
                const parameter = {
                    name: z.name,
                    optional: !z.required,
                    place: MethodPlace.Query,
                    isCollection: false,
                    dtoType: ''
                };

                if (this.typesGuard.isSimple(z.schema)) {
                    parameter.dtoType = this.typesService.getSimpleType(z.schema).dtoType;
                    return parameter;
                }

                if (this.typesGuard.isReference(z.schema)) {
                    parameter.dtoType = this.findModel(models, z.schema.$ref)?.dtoType ?? '';
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
        let model: IObjectModel | undefined;
        let isCollection = false;
        if (this.typesGuard.isReference(schema)) {
            model = this.findModel(models, schema.$ref);
        } else if (this.typesGuard.isCollection(schema) && this.typesGuard.isReference(schema.items)) {
            isCollection = true;
            model = this.findModel(models, schema.items.$ref);
        }

        if (!model) {
            return undefined;
        }

        return {
            name: model.name,
            place: MethodPlace.Body,
            optional: false,
            dtoType: model.dtoType,
            isCollection
        };
    }

    private getReturnType(
        schema: IOpenAPI3ArraySchema | IOpenAPI3Reference | undefined,
        models: IModelsContainer
    ): IReturnType | undefined {
        let model: IObjectModel | undefined;
        let isCollection = false;
        if (this.typesGuard.isReference(schema)) {
            model = this.findModel(models, schema.$ref);
        } else if (this.typesGuard.isCollection(schema)) {
            isCollection = true;

            if (this.typesGuard.isSimple(schema.items)) {
                return { isCollection, type: this.typesService.getSimpleType(schema.items) };
            }

            if (this.typesGuard.isReference(schema.items)) {
                model = this.findModel(models, schema.items.$ref);
            }
        }

        if (!model) {
            return undefined;
        }

        return { isCollection, type: { kind: PropertyKind.Object, dtoType: model.dtoType, type: model.name } };
    }

    private hasDownloadResponse(operation: IOpenAPI3Operation): boolean {
        return Boolean(operation.responses[200].content?.['application/octet-stream']);
    }

    private findModel(models: IModelsContainer, ref: string): IObjectModel | undefined {
        return models.objects.find((z) => ref.endsWith(z.name));
    }
}
