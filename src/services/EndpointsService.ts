import { OpenAPIService } from '../swagger/OpenAPIService';
import { first, last } from '../utils';

const IGNORE_LIST = [undefined, '{id}'];
const SEPARATOR = '/';

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

    private getControllers(): Record<string, string[]> {
        const endpoints = this.openAPIService.getEndpoints();

        return endpoints.reduce<Record<string, string[]>>((store, endpoint) => {
            const controller = first(this.openAPIService.getTagsByEndpoint(endpoint));
            if (!controller) {
                return store;
            }

            const fullAction = last(endpoint.split(`${SEPARATOR}${controller}${SEPARATOR}`));

            store[controller] = store[controller] || [];
            store[controller].push(fullAction);
            return store;
        }, {});
    }
}
