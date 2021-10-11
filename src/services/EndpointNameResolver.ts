import { OpenAPIService } from '../swagger/OpenAPIService';
import { lowerFirst, SEPARATOR, upperFirst } from '../utils';
import { IEndpointInfo } from './EndpointsService';

export class EndpointNameResolver {
    private queryParameterRegExp = new RegExp('^{(.*)}$');

    constructor(private readonly openAPIService: OpenAPIService) {}

    public hasDuplicate(info: IEndpointInfo, store: Record<string, IEndpointInfo[]>): boolean {
        return Boolean(store[info.name]?.some(z => z.action.name === info.action.name));
    }

    public generateUniqueName(endpoint: IEndpointInfo): string {
        const method = this.openAPIService.getMethodByEndpoint(endpoint.origin);
        if (!method) {
            throw new Error(`Cannot find method operation for endpoint ${endpoint.origin}`);
        }

        return `${lowerFirst(method)}${upperFirst(endpoint.action.name)}`;
    }

    public generateNameByPath(path: string): string {
        return path
            .split(SEPARATOR)
            .filter((z) => z && !this.queryParameterRegExp.test(z))
            .map((z, i) => i ? upperFirst(z) : lowerFirst(z))
            .join('');
    }
}
