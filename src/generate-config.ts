import { Project } from 'ts-morph';

import { ConfigGenerator } from './generators/ConfigGenerator';
import { configOptions, defaultOptions, generatorsOptions, IOptions } from './options';
import { EndpointsService } from './services/EndpointsService';
import { OpenAPIService } from './swagger/OpenAPIService';
import { getSwaggerJson } from './utils';

export default async function main(options: IOptions): Promise<void> {
    const settings = { ...defaultOptions, ...options };
    const swaggerJson = await getSwaggerJson(settings);

    const openAPIService = new OpenAPIService(swaggerJson);
    const endpointsService = new EndpointsService(openAPIService);
    const controllers = endpointsService.getActionsGroupedByController();

    const project = new Project(generatorsOptions);
    const generator = new ConfigGenerator();
    project.createSourceFile(
        `${settings.configOutput}/${configOptions.className.toLowerCase()}.ts`,
        { statements: generator.getEndpointsCodeStructure(controllers) },
        { overwrite: true }
    );

    await project.save();
}
