import { Project } from 'ts-morph';

import { ModelsGenerator } from './generators/ModelsGenerator';
import { defaultOptions, generatorsOptions, IOptions } from './options';
import { render } from './render';
import { EndpointsConfigReader } from './services/EndpointsConfigReader';
import { EndpointsService } from './services/EndpointsService';
import { ModelMappingService } from './services/ModelMappingService';
import { OpenAPIService } from './swagger/OpenAPIService';
import { OpenAPITypesGuard } from './swagger/OpenAPITypesGuard';
import { ServicesTreeService } from './swagger/ServicesTreeService';
import { ISwaggerMeta } from './swagger/types';
import { TypesService } from './swagger/TypesService';
import { sortBy } from './swagger/utils';
import { getSwaggerJson } from './utils';

export default async function main(options: IOptions): Promise<void> {
    const settings = { ...defaultOptions, ...options };
    const swaggerJson = await getSwaggerJson(settings);

    const typesGuard = new OpenAPITypesGuard();
    const mappingService = new ModelMappingService(typesGuard);
    const openAPIService = new OpenAPIService(swaggerJson, typesGuard);
    const endpointsService = new EndpointsService(openAPIService);
    const configReader = new EndpointsConfigReader(settings);

    const actions = await (settings.all ? endpointsService.getActions() : configReader.getActions());
    const modelsContainer = mappingService.toModelsContainer(openAPIService.getSchemasByEndpoints(actions));

    const project = new Project(generatorsOptions);
    const generator = new ModelsGenerator();
    project.createSourceFile(
        `${settings.output}/models.ts`,
        { statements: generator.getModelsCodeStructure(modelsContainer) },
        { overwrite: true }
    );

    await project.save();

    // Legacy
    const meta: ISwaggerMeta = JSON.parse(swaggerJson);
    const typesService = new TypesService(meta);
    const servicesService = new ServicesTreeService(meta, typesService);
    const services = servicesService.getServicesList(actions);
    services.sort(sortBy((x) => x.name));
    render({}, './templates/guid.ejs', `${settings.output}/Guid.ts`);
    render({}, './templates/date-converters.ejs', `${settings.output}/date-converters.ts`);
    render({}, './templates/mappers.ejs', `${settings.output}/mappers.ts`);
    render({}, './templates/base-http-service.ejs', `${settings.output}/base-http.service.ts`);
    render({}, './templates/download-service.ejs', `${settings.output}/download-service.ts`);
    render({ services }, './templates/services.ejs', `${settings.output}/services.ts`);
}
