import { OpenAPIService } from '../swagger/OpenAPIService';
import { first, lowerFirst, sortBy, upperFirst } from '../utils';

const SEPARATOR = '/';

export interface IAction {
    name: string;
}

export interface IEndpointInfo {
    name: string;
    origin: string;
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
            relativePath: endpoint.slice(0, controllerStartIndex) + controller,
            action: {
                name: rawAction ? this.buildActionName(rawAction) : ''
            }
        };
    }

    private getControllers(): Record<string, IEndpointInfo[]> {
        const endpoints = this.openAPIService.getEndpoints();

        return endpoints.reduce<Record<string, IEndpointInfo[]>>((store, endpoint) => {
            const info = this.parse(endpoint);
            if (!info) {
                return store;
            }

            store[info.name] = store[info.name] || [];
            store[info.name].push(info);
            return store;
        }, {});
    }

    private buildActionName(raw: string): string {
        return raw
            .split(SEPARATOR)
            .filter((z) => z && !this.queryParameterRegExp.test(z))
            .map((z, i) => i ? upperFirst(z) : lowerFirst(z))
            .join('');
    }
}
