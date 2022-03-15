import { Project } from 'ts-morph';
import { ConfigGenerator } from './generators/ConfigGenerator';
import { configOptions, defaultOptions, generatorsOptions, getOptions, IOptions } from './options';
import { EndpointNameResolver } from './services/EndpointNameResolver';
import { EndpointsService } from './services/EndpointsService';
import { getOpenAPISpec } from './swagger/getOpenAPISpec';
import { OpenAPIService } from './swagger/OpenAPIService';
import { OpenAPITypesGuard } from './swagger/OpenAPITypesGuard';

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
    const settings = getOptions(options);
    const swaggerJson = await getOpenAPISpec(settings);

    const typesGuard = new OpenAPITypesGuard();
    const openAPIService = new OpenAPIService(swaggerJson, typesGuard);
    const endpointNameResolver = new EndpointNameResolver();
    const endpointsService = new EndpointsService(openAPIService, endpointNameResolver);
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
