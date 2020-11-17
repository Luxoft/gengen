import { OpenAPIService } from '../swagger/OpenAPI.service';
import { first, last } from '../utils';

const IGNORE_LIST = [undefined, '{id}'];

export class EndpointsService {
    constructor(private readonly openAPIService: OpenAPIService) { }

    public getGroupedActionsByController(): Record<string, string[]> {
        const endpoints = this.openAPIService.getEndpoints();

        return endpoints.reduce<Record<string, string[]>>((store, endpoint) => {
            const controller = first(this.openAPIService.getTagsByEndpoint(endpoint));
            if (!controller) {
                return store;
            }

            const actionPart = last(endpoint.split(`/${controller}/`));
            const action = first(actionPart.split('/'));
            if (IGNORE_LIST.includes(action)) {
                return store;
            }

            store[controller] = store[controller] || [];
            store[controller].push(action);
            return store;
        }, {});
    }
}
