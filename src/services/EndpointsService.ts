import { OpenAPIService } from '../swagger/OpenAPIService';
import { first, last } from '../utils';

const IGNORE_LIST = [undefined, '{id}'];
const SEPARATOR = '/';

export interface IEndpointInfo {
    name: string;
    relativePath: string;
    tail: string;
}

export class EndpointsService {
    constructor(private readonly openAPIService: OpenAPIService) { }

    public getActionsGroupedByController(): Record<string, string[]> {
        const result: Record<string, string[]> = {};
        const controllers = this.getControllers();

        Object.keys(controllers)
            .sort()
            .forEach((key) => {
                result[key] = controllers[key]
                    .map((x) => first(x.split(SEPARATOR)))
                    .filter((x) => !IGNORE_LIST.includes(x))
                    .sort();
            });

        return result;
    }

    public getActions(): Set<string> {
        const controllers = this.getControllers();
        const actions = Object.entries(controllers).reduce<string[]>(
            (store, [controller, actions]) => store.concat(actions.map((z) => controller + SEPARATOR + z)),
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
        return {
            name: controller,
            tail: last(parts),
            relativePath: `${first(parts)}/${controller}`
        };
    }

    private getControllers(): Record<string, string[]> {
        const endpoints = this.openAPIService.getEndpoints();

        return endpoints.reduce<Record<string, string[]>>((store, endpoint) => {
            const info = this.parse(endpoint);
            if (!info) {
                return store;
            }

            store[info.name] = store[info.name] || [];
            store[info.name].push(info.tail);
            return store;
        }, {});
    }
}
