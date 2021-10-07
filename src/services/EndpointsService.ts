import { OpenAPIService } from '../swagger/OpenAPIService';
import { sortBy } from '../utils';
import { ControllerEndpointNameResolver } from './ControllerEndpointNameResolver';

export interface IAction {
    name: string;
    origin: string;
}

export interface IEndpointInfo {
    name: string;
    origin: string;
    relativePath: string;
    action: IAction;
}

export class EndpointsService {
    constructor(
        private readonly openAPIService: OpenAPIService,
        private readonly endpointNameResolver: ControllerEndpointNameResolver) {}

    public getActionsGroupedByController(): Record<string, Record<string, string>> {
        const result: Record<string, Record<string, string>> = {};
        const controllers = this.getControllers();

        Object.keys(controllers)
            .sort()
            .forEach((key) => {
                result[key] = {};

                controllers[key]
                    .sort(sortBy((z) => z.action.name))
                    .forEach(z => result[key][z.action.name] = z.origin);
            });

        return result;
    }

    public getEndpoints(): Set<string> {
        const controllers = this.getControllers();
        const actions = Object.values(controllers).reduce<string[]>(
            (store, endpoints) => store.concat(endpoints.map((z) => z.origin)),
            []
        );

        return new Set(actions.sort());
    }


    private getControllers(): Record<string, IEndpointInfo[]> {
        const endpoints = this.openAPIService.getEndpoints();
        return endpoints.reduce<Record<string, IEndpointInfo[]>>((store, endpoint) => {
            const info = this.endpointNameResolver.getEndpointInfo(endpoint, store);
            if (!info) {
                return store;
            }

            store[info.name] = store[info.name] || [];
            store[info.name].push(info);

            return store;
        }, {});
    }
}
