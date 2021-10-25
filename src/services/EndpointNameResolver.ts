import { pathOptions } from '../options';
import { OpenAPIService } from '../swagger/OpenAPIService';
import { lowerFirst, upperFirst } from '../utils';
import { IEndpointInfo } from './EndpointsService';

export class EndpointNameResolver {
    private queryParameterRegExp = new RegExp('^{(.*)}$');

    constructor(private readonly openAPIService: OpenAPIService) {}

    public deduplicate(infos: IEndpointInfo[]): void {
        infos.forEach(info => {
            const duplicate = this.isDuplicate(info, infos);
            if (duplicate) {
                info.action.name = this.generateNameUnique(info);
            }
        })
    }

    public generateNameByPath(path: string): string {
        return path
            .split(pathOptions.separator)
            .filter((z) => z && !this.queryParameterRegExp.test(z))
            .map((z, i) => i ? upperFirst(z) : lowerFirst(z))
            .join('');
    }

    public generateNameDefault(name: string): string {
        return lowerFirst(`${name}Default`);
    }

    private generateNameUnique(endpoint: IEndpointInfo): string {
        const method = this.openAPIService.getMethodByEndpoint(endpoint.origin);
        if (!method) {
            throw new Error(`Cannot find method operation for endpoint '${endpoint.origin}'`);
        }

        return `${lowerFirst(method)}${upperFirst(endpoint.action.name)}`;
    }

    private isDuplicate(info: IEndpointInfo, infos: IEndpointInfo[]): boolean {
        return infos.filter(z => z.action.name === info.action.name && z.name == info.name).length > 1;
    }
}
