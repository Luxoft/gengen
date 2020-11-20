import { defaultOptions, IOptions } from './options';
import { render } from './render';
import { EndpointsConfigReader } from './services/EndpointsConfigReader';
import { EndpointsService } from './services/EndpointsService';
import { ModelsService } from './swagger/ModelsService';
import { OpenAPIService } from './swagger/OpenAPIService';
import { ServicesTreeService } from './swagger/ServicesTreeService';
import { ISwaggerMeta } from './swagger/types';
import { TypesService } from './swagger/TypesService';
import { sortBy } from './swagger/utils';
import { getSwaggerJson } from './utils';

export default async function main(options: IOptions): Promise<void> {
    const settings = { ...defaultOptions, ...options };
    const swaggerJson = await getSwaggerJson(settings);

    const openAPIService = new OpenAPIService(swaggerJson);
    const endpointsService = new EndpointsService(openAPIService);
    const configReader = new EndpointsConfigReader(settings);

    const actions = await (settings.all ? endpointsService.getActions() : configReader.getActions());

    const meta: ISwaggerMeta = JSON.parse(swaggerJson);
    const typesService = new TypesService(meta);
    const modelsService = new ModelsService(meta, typesService);
    const servicesService = new ServicesTreeService(meta, typesService);

    // Data
    const { enums, models } = modelsService.getTypesByMethodList(actions);
    const services = servicesService.getServicesList(actions);

    // Sort
    models.sort(sortBy((x) => x.name));
    enums.sort(sortBy((x) => x.name));
    services.sort(sortBy((x) => x.name));

    // Render
    render({}, './templates/guid.ejs', `${settings.output}/Guid.ts`);
    render({}, './templates/date-converters.ejs', `${settings.output}/date-converters.ts`);
    render({}, './templates/mappers.ejs', `${settings.output}/mappers.ts`);
    render({}, './templates/base-http-service.ejs', `${settings.output}/base-http.service.ts`);
    render({}, './templates/download-service.ejs', `${settings.output}/download-service.ts`);
    render({ models, enums }, './templates/models.ejs', `${settings.output}/models.ts`);
    render({ services }, './templates/services.ejs', `${settings.output}/services.ts`);
}
