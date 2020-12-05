import { MethodKind } from '../models/kinds/MethodKind';
import { MethodOperation } from '../models/kinds/MethodOperation';
import { IMethodModel } from '../models/MethodModel';
import { IServiceModel } from '../models/ServiceModel';
import { IOpenAPI3Operations } from '../swagger/OpenAPIService';
import { IOpenAPI3Operation } from '../swagger/v3/operation';
import { lowerFirst, sortBy } from '../utils';
import { EndpointsService, IEndpointInfo } from './EndpointsService';

export class ServiceMappingService {
    constructor(private readonly endpointsService: EndpointsService) { }

    public toServiceModels(operations: IOpenAPI3Operations): IServiceModel[] {
        const models = Object.entries(operations).reduce<IServiceModel[]>((store, [endpoint, model]) => {
            const info = this.endpointsService.parse(endpoint);
            if (!info) {
                return store;
            }

            const service = store.find((z) => z.name === info.name);
            if (service) {
                service.methods.push(this.toMethodModel(info, model.method, model.operation));
                return store;
            }

            store.push({
                name: info.name,
                relativePath: info.relativePath,
                methods: [this.toMethodModel(info, model.method, model.operation)]
            });
            return store;
        }, []);

        models.forEach((z) => {
            z.methods = z.methods.sort(sortBy((x) => x.name));
        });

        return models.sort(sortBy((z) => z.name));
    }

    private toMethodModel(endpointInfo: IEndpointInfo, method: MethodOperation, operation: IOpenAPI3Operation): IMethodModel {
        return {
            operation: method,
            kind: this.hasDownloadResponse(operation) ? MethodKind.Download : MethodKind.None,
            name: lowerFirst(endpointInfo.action.name),
            parameters: [],
            returnType: {
                name: '',
                type: '',
                dtoType: ''
            }
        };
    }

    private hasDownloadResponse(operation: IOpenAPI3Operation): boolean {
        return Boolean(operation.responses[200].content?.['application/octet-stream']);
    }
}
