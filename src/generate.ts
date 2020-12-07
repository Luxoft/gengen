import { Project } from 'ts-morph';

import { AngularServicesGenerator } from './generators/angular/AngularServicesGenerator';
import { ModelsGenerator } from './generators/ModelsGenerator';
import { defaultOptions, generatorsOptions, IOptions } from './options';
import { render } from './render';
import { EndpointsConfigReader } from './services/EndpointsConfigReader';
import { EndpointsService } from './services/EndpointsService';
import { ModelMappingService } from './services/ModelMappingService';
import { ServiceMappingService } from './services/ServiceMappingService';
import { TypesService } from './services/TypesService';
import { OpenAPIService } from './swagger/OpenAPIService';
import { OpenAPITypesGuard } from './swagger/OpenAPITypesGuard';
import { getSwaggerJson } from './utils';

export default async function main(options: IOptions): Promise<void> {
    const settings = { ...defaultOptions, ...options };
    const swaggerJson = await getSwaggerJson(settings);

    const typesGuard = new OpenAPITypesGuard();
    const openAPIService = new OpenAPIService(swaggerJson, typesGuard);
    const endpointsService = new EndpointsService(openAPIService);
    const typesService = new TypesService(typesGuard);
    const modelMappingService = new ModelMappingService(typesGuard, typesService);
    const serviceMappingService = new ServiceMappingService(endpointsService, openAPIService, typesService, typesGuard);
    const configReader = new EndpointsConfigReader(settings);

    const actions = await (settings.all ? endpointsService.getActions() : configReader.getActions());
    const modelsContainer = modelMappingService.toModelsContainer(openAPIService.getSchemasByEndpoints(actions));
    const newServices = serviceMappingService.toServiceModels(openAPIService.getOperationsByEndpoints(actions), modelsContainer);

    const project = new Project(generatorsOptions);
    project.createSourceFile(
        `${settings.output}/models.ts`,
        { statements: new ModelsGenerator().getModelsCodeStructure(modelsContainer) },
        { overwrite: true }
    );

    const serviceFile = project.createSourceFile(
        `${settings.output}/services.ts`,
        { statements: new AngularServicesGenerator().getServicesCodeStructure(newServices) },
        { overwrite: true }
    );

    serviceFile.formatText();

    await project.save();

    // TODO Move to libs
    render({}, './templates/guid.ejs', `${settings.output}/Guid.ts`);
    render({}, './templates/date-converters.ejs', `${settings.output}/date-converters.ts`);
    render({}, './templates/mappers.ejs', `${settings.output}/mappers.ts`);
    render({}, './templates/base-http-service.ejs', `${settings.output}/base-http.service.ts`);
    render({}, './templates/download-service.ejs', `${settings.output}/download-service.ts`);
}
