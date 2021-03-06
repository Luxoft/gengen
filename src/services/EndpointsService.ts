import { OpenAPIService } from '../swagger/OpenAPIService';
import { first, last } from '../utils';

const SEPARATOR = '/';

export interface IAction {
    name: string | undefined;
    origin: string;
}

export interface IEndpointInfo {
    name: string;
    relativePath: string;
    action: IAction;
}

export class EndpointsService {
    private queryParameterRegExp = new RegExp('^{(.*)}$');

    constructor(private readonly openAPIService: OpenAPIService) { }

    public getActionsGroupedByController(): Record<string, string[]> {
        const result: Record<string, string[]> = {};
        const controllers = this.getControllers();

        Object.keys(controllers)
            .sort()
            .forEach((key) => {
                result[key] = controllers[key]
                    .filter((x) => x.name)
                    .map((x) => x.name as string)
                    .sort();
            });

        return result;
    }

    public getActions(): Set<string> {
        const controllers = this.getControllers();
        const actions = Object.entries(controllers).reduce<string[]>(
            (store, [controller, actions]) => store.concat(actions.map((z) => controller + SEPARATOR + z.origin)),
            []
        );

        return new Set(actions.sort());
    }

    public parse(endpoint: string): IEndpointInfo | undefined {
        const controller = first(this.openAPIService.getTagsByEndpoint(endpoint));
        if (!controller) {
            return undefined;
        }

        const parts = endpoint.split(`${SEPARATOR}${controller}${SEPARATOR}`);
        const action = last(parts);
        return {
            name: controller,
            action: {
                origin: action,
                name: last(action.split(SEPARATOR).filter((z) => z && !this.queryParameterRegExp.test(z)))
            },
            relativePath: `${first(parts)}/${controller}`
        };
    }

    private getControllers(): Record<string, IAction[]> {
        const endpoints = this.openAPIService.getEndpoints();

        return endpoints.reduce<Record<string, IAction[]>>((store, endpoint) => {
            const info = this.parse(endpoint);
            if (!info) {
                return store;
            }

            store[info.name] = store[info.name] || [];
            store[info.name].push(info.action);
            return store;
        }, {});
    }
}
