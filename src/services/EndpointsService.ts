import { MethodOperation } from '../models/kinds/MethodOperation';
import { pathOptions } from '../options';
import { OpenAPIService } from '../swagger/OpenAPIService';
import { first, sortBy, upperFirst } from '../utils';
import { EndpointNameResolver } from './EndpointNameResolver';

export interface IAction {
    name: string;
    origin: string;
}

export interface IEndpointInfo {
    name: string;
    origin: string;
    relativePath: string;
    actions: IAction[];
}

export class EndpointsService {
    constructor(private readonly openAPIService: OpenAPIService, private readonly endpointNameResolver: EndpointNameResolver) {}

    public getActionsGroupedByController(): Record<string, Record<string, string>> {
        const result: Record<string, Record<string, string>> = {};
        const controllers = this.getControllers();

        Object.keys(controllers)
            .sort()
            .forEach((key) => {
                result[key] = {};
                controllers[key]
                    .flatMap((endpointInfo) => endpointInfo.actions)
                    .sort(sortBy((action) => action.name))
                    .forEach((action) => {
                        const info = controllers[key].find((endpointInfo) => endpointInfo.actions.includes(action));
                        if (info) {
                            result[key][action.name] = info.origin;
                        }
                    });
            });

        return result;
    }

    public getEndpoints(): Set<string> {
        const controllers = this.getControllers();
        const actions = Object.values(controllers).reduce<string[]>((store, endpoints) => store.concat(endpoints.map((z) => z.origin)), []);

        return new Set(actions.sort());
    }

    public parse(endpoint: string): IEndpointInfo | undefined {
        const rawGroupName = first(this.openAPIService.getTagsByEndpoint(endpoint));
        if (!rawGroupName) {
            return undefined;
        }

        const groupNameStartIndex = endpoint.indexOf(rawGroupName);
        if (groupNameStartIndex < 0) {
            return undefined;
        }

        const groupName = this.normalizeGroupName(rawGroupName);
        const methods = this.openAPIService.getOperationsByEndpoint(endpoint);
        const rawEndpointName = endpoint.slice(groupNameStartIndex + rawGroupName.length + pathOptions.separator.length);

        return {
            name: groupName,
            origin: endpoint,
            relativePath: endpoint.slice(0, groupNameStartIndex) + rawGroupName,
            actions: methods.map((z) => {
                const name = rawEndpointName
                    ? this.endpointNameResolver.generateNameByPath(rawEndpointName)
                    : this.endpointNameResolver.generateNameDefault(groupName);

                return {
                    name: `${methods.length > 1 ? `${MethodOperation[z.method].toLocaleLowerCase()}${upperFirst(name)}` : name}`,
                    origin: rawEndpointName
                };
            })
        };
    }

    private getControllers(): Record<string, IEndpointInfo[]> {
        const endpoints = this.openAPIService.getEndpoints();
        const endpointInfos = endpoints.reduce<IEndpointInfo[]>((infos, endpoint) => {
            const info = this.parse(endpoint);
            if (!info) {
                return infos;
            }

            infos.push(info);
            return infos;
        }, []);

        this.endpointNameResolver.checkDuplicates(endpointInfos);
        return endpointInfos.reduce<Record<string, IEndpointInfo[]>>((store, info) => {
            store[info.name] = store[info.name] || [];
            store[info.name].push(info);
            return store;
        }, {});
    }

    private normalizeGroupName(name: string): string {
        return name
            .split('-')
            .map((x) => upperFirst(x))
            .join('');
    }
}
