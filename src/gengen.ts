import { promises } from 'fs';
import { resolve } from 'path';
import { Project } from 'ts-morph';

import { AngularServicesGenerator } from './generators/angular/AngularServicesGenerator';
import { ConfigGenerator } from './generators/ConfigGenerator';
import { ModelsGenerator } from './generators/ModelsGenerator';
import { configOptions, defaultOptions, generatorsOptions, IOptions } from './options';
import { AliasResolver } from './services/AliasResolver';
import { EndpointsConfigReader } from './services/EndpointsConfigReader';
import { EndpointsService } from './services/EndpointsService';
import { ModelMappingService } from './services/ModelMappingService';
import { ServiceMappingService } from './services/ServiceMappingService';
import { TypesService } from './services/TypesService';
import { OpenAPIService } from './swagger/OpenAPIService';
import { OpenAPITypesGuard } from './swagger/OpenAPITypesGuard';
import { getSwaggerJson } from './utils';

export async function init(options: IOptions = defaultOptions): Promise<void> {
    const generator = new ConfigGenerator();
    const project = new Project(generatorsOptions);

    project.createSourceFile(
        `${options.configOutput}/${configOptions.filename}`,
        { statements: generator.getConfigCodeStructure() },
        { overwrite: true }
    );

    await project.save();
}

export async function config(options: IOptions): Promise<void> {
    const settings = { ...defaultOptions, ...options };
    const swaggerJson = await getSwaggerJson(settings);

    const typesGuard = new OpenAPITypesGuard();
    const openAPIService = new OpenAPIService(swaggerJson, typesGuard);
    const endpointsService = new EndpointsService(openAPIService);
    const controllers = endpointsService.getActionsGroupedByController();

    const project = new Project(generatorsOptions);
    const generator = new ConfigGenerator();
    const sourceFile = project.createSourceFile(
        `${settings.configOutput}/${configOptions.className.toLowerCase()}.ts`,
        { statements: generator.getEndpointsCodeStructure(controllers) },
        { overwrite: true }
    );

    sourceFile.formatText();

    await project.save();
}

export async function main(options: IOptions): Promise<void> {
    const settings = { ...defaultOptions, ...options };
    const swaggerJson = await getSwaggerJson(settings);

    const typesGuard = new OpenAPITypesGuard();
    const openAPIService = new OpenAPIService(swaggerJson, typesGuard);
    const endpointsService = new EndpointsService(openAPIService);
    const typesService = new TypesService(typesGuard);
    const modelMappingService = new ModelMappingService(typesGuard, typesService);
    const serviceMappingService = new ServiceMappingService(endpointsService, openAPIService, typesService, typesGuard);
    const configReader = new EndpointsConfigReader(settings);
    const aliasResolver = new AliasResolver(settings);

    const endpoints = await (settings.all ? endpointsService.getEndpoints() : configReader.getEndpoints());
    const modelsContainer = modelMappingService.toModelsContainer(openAPIService.getSchemasByEndpoints(endpoints));
    const newServices = serviceMappingService.toServiceModels(openAPIService.getOperationsByEndpoints(endpoints), modelsContainer);

    const project = new Project(generatorsOptions);
    project.createSourceFile(
        `${settings.output}/${aliasResolver.getModelsFileName()}`,
        { statements: new ModelsGenerator().getModelsCodeStructure(modelsContainer) },
        { overwrite: true }
    );

    const serviceFile = project.createSourceFile(
        `${settings.output}/${aliasResolver.getServicesFileName()}`,
        { statements: new AngularServicesGenerator(aliasResolver).getServicesCodeStructure(newServices) },
        { overwrite: true }
    );

    serviceFile.formatText();

    await project.save();

    promises.copyFile(resolve(__dirname, '../libs/Guid.ts'), `${settings.output}/Guid.ts`);
    promises.copyFile(resolve(__dirname, '../libs/utils.ts'), `${settings.output}/utils.ts`);
    promises.copyFile(resolve(__dirname, '../libs/mappers.ts'), `${settings.output}/mappers.ts`);
    promises.copyFile(resolve(__dirname, '../libs/date-converters.ts'), `${settings.output}/date-converters.ts`);
    promises.copyFile(resolve(__dirname, '../libs/base-http.service.ts'), `${settings.output}/base-http.service.ts`);
    promises.copyFile(resolve(__dirname, '../libs/download.service.ts'), `${settings.output}/download.service.ts`);
}
