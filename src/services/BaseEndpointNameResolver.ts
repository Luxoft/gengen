import { OpenAPIService } from '../swagger/OpenAPIService';
import { first, lowerFirst, upperFirst } from '../utils';
import { IEndpointInfo } from './EndpointsService';

const SEPARATOR = '/';

export abstract class BaseEndpointNameResolver<T> {
    private queryParameterRegExp = new RegExp('^{(.*)}$');

    constructor(protected readonly openAPIService: OpenAPIService) {}

    public abstract hasDuplicate(info: IEndpointInfo, store: T): boolean

    public getEndpointInfo(endpoint: string, store: T): IEndpointInfo | undefined {
        const info = this.parse(endpoint);

        if (!info) {
            return undefined;
        }

        const duplicate = this.hasDuplicate(info, store);

        if (duplicate) {
            info.action.name = this.getDuplicateByMethod(info);
        }

        return info;
    }

    private getDuplicateByMethod(endpoint: IEndpointInfo): string {
        const method = this.openAPIService.getMethodByEndpoint(endpoint.origin);
        return `${lowerFirst(method ?? '')}${upperFirst(endpoint.action.name)}`;
    }

    private buildActionName(raw: string): string {
        return raw
            .split(SEPARATOR)
            .filter((z) => z && !this.queryParameterRegExp.test(z))
            .map((z, i) => i ? upperFirst(z) : lowerFirst(z))
            .join('');
    }

    private parse(endpoint: string): IEndpointInfo | undefined {
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
                name: rawAction ? this.buildActionName(rawAction) : lowerFirst(`${controller}Default`),
                origin: rawAction
            }
        };
    }
}
