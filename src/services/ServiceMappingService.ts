import { IServiceModel } from '../models/ServiceModel';
import { IOpenAPI3Operations } from '../swagger/OpenAPIService';
import { sortBy } from '../utils';
import { EndpointsService } from './EndpointsService';

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
                return store;
            }

            store.push({
                name: info.name,
                relativePath: info.relativePath,
                hasDownloadMethods: Boolean(model.operation.responses[200].content?.['application/octet-stream']),
                methods: []
            });
            return store;
        }, []);

        return models.sort(sortBy((z) => z.name));
    }
}
