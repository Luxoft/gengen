import { IServiceModel } from '../models/ServiceModel';
import { IOpenAPI3OperationContainer } from '../swagger/v3/operation';
import { EndpointsService } from './EndpointsService';

export class ServiceMappingService {
    constructor(private readonly endpointsService: EndpointsService) { }

    public toServiceModels(operations: IOpenAPI3OperationContainer): IServiceModel[] {
        return Object.entries(operations).reduce<IServiceModel[]>((store, [endpoint, operation]) => {
            const info = this.endpointsService.parse(endpoint);
            if (!info) {
                return store;
            }

            store.push({
                name: info.name,
                relativePath: info.relativePath,
                hasDownloadMethods: Boolean(operation.responses[200].content?.['application/octet-stream'])
            });
            return store;
        }, []);
    }
}
