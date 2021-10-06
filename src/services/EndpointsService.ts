import { IServiceModel } from '../models/ServiceModel';
import { OpenAPIService } from '../swagger/OpenAPIService';
import { first, lowerFirst, sortBy, upperFirst } from '../utils';

const SEPARATOR = '/';

export interface IAction {
    name: string;
}

export interface IEndpointInfo {
    name: string;
    origin: string;
    url:string;
    relativePath: string;
    action: IAction;
}

export class EndpointsService {
    private queryParameterRegExp = new RegExp('^{(.*)}$');

    constructor(private readonly openAPIService: OpenAPIService) {}

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

    public parse(endpoint: string): IEndpointInfo | undefined {
        const controller = first(this.openAPIService.getTagsByEndpoint(endpoint));
        if (!controller) {
            return undefined;
        }

        const controllerStartIndex = endpoint.indexOf(controller);
        if (controllerStartIndex < 0) {
            return undefined;
        }

        const rawAction = endpoint.slice(controllerStartIndex + controller.length + SEPARATOR.length);
        return {
            name: controller,
            origin: endpoint,
            url:rawAction,
            relativePath: endpoint.slice(0, controllerStartIndex) + controller,
            action: {
                name: this.buildActionName(rawAction, controller)
            }
        };
    }

    public checkMethodDuplication(endpoint: IEndpointInfo, storage: IServiceModel[]): IEndpointInfo {
        const methods = storage.find(z => z.name === endpoint.name)?.methods;
        if (!methods) {
            return endpoint;
        }

        const duplication = methods.find(z => z.name === endpoint.action.name);

        if (duplication) {
            const method = this.openAPIService.getMethodByEndpoint(endpoint.origin);
            endpoint.action.name = `${lowerFirst(endpoint.action.name)}${method}`;
        }

        return endpoint;
    }

    public checkEndpointDuplication(endpoint: IEndpointInfo, storage: Record<string, IEndpointInfo[]>): IEndpointInfo {
        const duplication = storage[endpoint.name].find(z => z.action.name === endpoint.action.name);
        if (duplication) {
            const method = this.openAPIService.getMethodByEndpoint(endpoint.origin);
            endpoint.action.name = `${lowerFirst(endpoint.action.name)}${method}`;
        }

        return endpoint;
    }

    private getControllers(): Record<string, IEndpointInfo[]> {
        const endpoints = this.openAPIService.getEndpoints();
        return endpoints.reduce<Record<string, IEndpointInfo[]>>((store, endpoint) => {
            const info = this.parse(endpoint);
            if (!info) {
                return store;
            }

            store[info.name] = store[info.name] || [];

            store[info.name].push(this.checkEndpointDuplication(info, store));

            return store;
        }, {});
    }

    private buildActionName(raw: string, controller: string): string {
        if (!raw) {
            return lowerFirst(controller);
        }

        return raw
            .split(SEPARATOR)
            .filter((z) => z && !this.queryParameterRegExp.test(z))
            .map((z, i) => i ? upperFirst(z) : lowerFirst(z))
            .join('');
    }
}
