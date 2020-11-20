import { defaultOptions, IOptions } from './options';
import { render } from './render';
import { EndpointsService } from './services/EndpointsService';
import { OpenAPIService } from './swagger/OpenAPIService';
import { getSwaggerJson } from './utils';

export default async function main(options: IOptions): Promise<void> {
    const settings = { ...defaultOptions, ...options };
    const swaggerJson = await getSwaggerJson(settings);

    const openAPIService = new OpenAPIService(swaggerJson);
    const endpointsService = new EndpointsService(openAPIService);

    const controllers = endpointsService.getActionsGroupedByController();

    render({ controllers }, './templates/endpoints.ejs', `${settings.configOutput}/endpoints.ts`);
}
