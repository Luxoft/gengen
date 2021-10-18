import { pathOptions } from '../options';
import { OpenAPIService } from '../swagger/OpenAPIService';
import { first, sortBy } from '../utils';
import { EndpointNameResolver } from './EndpointNameResolver';

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
        private readonly endpointNameResolver: EndpointNameResolver) {}

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

    public addToStore(info: IEndpointInfo, store: Record<string, IEndpointInfo[]>): void {
        const duplicate = this.endpointNameResolver.isDuplicate(info, store);
        if (duplicate) {
            info.action.name = this.endpointNameResolver.generateNameUnique(info);
        }

        store[info.name] = store[info.name] || [];
        store[info.name].push(info);
    }

    public parse(endpoint: string): IEndpointInfo | undefined {
        const controller = first(this.openAPIService.getTagsByEndpoint(endpoint));
        if (!controller) {
            return undefined;
        }

        const controllerStartIndex = endpoint.indexOf(controller);
        if (controllerStartIndex < 0) {
            return undefined;
        }

        const rawAction = endpoint.slice(controllerStartIndex + controller.length + pathOptions.separator.length);
        return {
            name: controller,
            origin: endpoint,
            relativePath: endpoint.slice(0, controllerStartIndex) + controller,
            action: {
                name: rawAction ? this.endpointNameResolver.generateNameByPath(rawAction) : this.endpointNameResolver.generateNameDefault(controller),
                origin: rawAction
            }
        };
    }

    private getControllers(): Record<string, IEndpointInfo[]> {
        const endpoints = this.openAPIService.getEndpoints();
        const store: Record<string, IEndpointInfo[]> = {};
        endpoints.forEach(endpoint => {
            const info = this.parse(endpoint);
            if (!info) {
                return;
            }

            this.addToStore(info, store)
        });
        return store
    }
}
