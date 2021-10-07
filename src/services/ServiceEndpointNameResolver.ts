import { IServiceModel } from '../models/ServiceModel';
import { BaseEndpointNameResolver } from './BaseEndpointNameResolver';
import { IEndpointInfo } from './EndpointsService';

export class ServiceEndpointNameResolver extends BaseEndpointNameResolver<IServiceModel[]> {
    public hasDuplicate(info: IEndpointInfo, store: IServiceModel[]): boolean {
        const service = store.find((z) => z.name === info.name);
        if (!service) {
            return false;
        }
        
        return Boolean(service.methods.find(z => z.name === info.action.name));
    }

}
