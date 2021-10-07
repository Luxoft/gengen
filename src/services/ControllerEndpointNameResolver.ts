import { BaseEndpointNameResolver } from './BaseEndpointNameResolver';
import { IEndpointInfo } from './EndpointsService';

export class ControllerEndpointNameResolver extends BaseEndpointNameResolver<Record<string, IEndpointInfo[]>> {
    public hasDuplicate(info: IEndpointInfo, store: Record<string, IEndpointInfo[]>): boolean {
        return Boolean(store[info.name]?.find(z => z.action.name === info.action.name));
    }
}
