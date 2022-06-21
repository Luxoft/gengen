import { HTTP_REQUEST_OPTIONS } from '../generators/angular/AngularServicesMethodGenerator';
import { MethodKind } from '../models/kinds/MethodKind';
import { MethodOperation } from '../models/kinds/MethodOperation';
import { ParameterPlace } from '../models/kinds/ParameterPlace';
import { PropertyKind } from '../models/kinds/PropertyKind';
import { IBodyParameter } from '../models/method-parameter/IBodyParameter';
import { IMethodModel } from '../models/method-parameter/IMethodModel';
import { IPathParameter } from '../models/method-parameter/IPathParameter';
import { IQueryParameter } from '../models/method-parameter/IQueryParameter';
import { IReturnType } from '../models/method-parameter/IReturnType';
import { PathMethodParameterModel } from '../models/method-parameter/PathMethodParameterModel';
import { QueryMethodParameterModel } from '../models/method-parameter/QueryMethodParameterModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { IServiceModel } from '../models/ServiceModel';
import { IOptions } from '../options';
import { IOpenAPI3Operations, OpenAPIService } from '../swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { IOpenAPI3Operation } from '../swagger/v3/operation';
import { IOpenAPI3Parameter } from '../swagger/v3/parameter';
import { IOpenAPI3Reference } from '../swagger/v3/reference';
import { IOpenAPI3ArraySchema } from '../swagger/v3/schemas/array-schema';
import { OpenAPI3Schema } from '../swagger/v3/schemas/schema';
import { first, lowerFirst, sortBy } from '../utils';
import { EndpointNameResolver } from './EndpointNameResolver';
import { EndpointsService, IEndpointInfo } from './EndpointsService';
import { TypesService } from './TypesService';

interface IModel {
    name: string;
    dtoType: string;
    kind: PropertyKind;
}

export class ServiceMappingService {
    constructor(
        private readonly openAPIService: OpenAPIService,
        private readonly typesService: TypesService,
        private readonly typesGuard: OpenAPITypesGuard,
        private readonly endpointsService: EndpointsService,
        private readonly endpointNameResolver: EndpointNameResolver,
        private readonly settings: IOptions
    ) {}

    public toServiceModels(operations: IOpenAPI3Operations, models: IModelsContainer): IServiceModel[] {
        const endpointInfos = Object.keys(operations).reduce<IEndpointInfo[]>((infos, endpoint) => {
            const info = this.endpointsService.parse(endpoint);
            if (!info) {
                return infos;
            }

            infos.push(info);
            return infos;
        }, []);

        this.endpointNameResolver.checkDuplicates(endpointInfos);

        const services = Object.entries(operations).reduce<IServiceModel[]>((store, [endpoint, model]) => {
            const info = endpointInfos.find((z) => z.origin === endpoint);
            if (!info) {
                return store;
            }

            const service = store.find((z) => z.name === info.name);

            model.forEach((z) => {
                const action =
                    model.length > 1
                        ? info.actions.find((x) => x.name.startsWith(MethodOperation[z.method].toLocaleLowerCase()))
                        : first(info.actions);

                if (!action) {
                    throw new Error(`Cannot find action in service ${info.name} by method ${z}`);
                }

                if (service) {
                    service.methods.push(this.getMethod(action.name, z.method, z.operation, models, action.origin));
                    return store;
                }

                store.push({
                    name: info.name,
                    relativePath: info.relativePath,
                    methods: [this.getMethod(action.name, z.method, z.operation, models, action.origin)]
                });
            });

            return store;
        }, []);

        services.forEach((z) => {
            z.methods = z.methods.sort(sortBy((x) => x.name));
        });

        return services.sort(sortBy((z) => z.name));
    }

    private getMethod(
        actionName: string,
        method: MethodOperation,
        operation: IOpenAPI3Operation,
        models: IModelsContainer,
        originUri: string
    ): IMethodModel {
        const model: IMethodModel = {
            kind: this.hasDownloadResponse(operation) ? MethodKind.Download : MethodKind.Default,
            name: lowerFirst(actionName),
            operation: method,
            parameters: this.getUriParameters(operation.parameters),
            returnType: this.getReturnType(operation.responses[200].content?.['application/json']?.schema, models),
            originUri
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

        if (this.settings.withRequestOptions) {
            model.parameters.push({
                name: 'options',
                place: ParameterPlace.Body,
                optional: true,
                dtoType: HTTP_REQUEST_OPTIONS,
                isCollection: false,
                isModel: false
            });
        }

        return model;
    }

    private getUriParameters(parameters: IOpenAPI3Parameter[] | undefined): (IQueryParameter | IPathParameter)[] {
        if (!parameters) {
            return [];
        }

        const pathParams = parameters
            .filter((z) => z.in === 'path')
            .map((parameter) => new PathMethodParameterModel(parameter, this.typesGuard, this.typesService, this.openAPIService));

        const queryParams = parameters
            .filter((z) => z.in === 'query')
            .map((parameter) => new QueryMethodParameterModel(parameter, this.typesGuard, this.typesService, this.openAPIService));

        return [...pathParams.sort(sortBy((z) => z.name)), ...queryParams.sort(sortBy((z) => z.name))];
    }

    private getBodyParameter(
        schema: IOpenAPI3ArraySchema | IOpenAPI3Reference | undefined,
        models: IModelsContainer
    ): IBodyParameter | undefined {
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

    private getReturnType(schema: OpenAPI3Schema | undefined, models: IModelsContainer): IReturnType | undefined {
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
