import { existsSync, mkdirSync, promises } from 'fs';
import { resolve } from 'path';
import { Project, StatementStructures } from 'ts-morph';
import { IOptions, generatorsOptions } from '../options';
import { PathBuilder } from '../services/PathBuilder';
import { IOpenAPI3 } from '../swagger/v3/open-api';
import { GenGenCodeGenInjector } from './GenGenCodeGenInjector';

export class GenGenCodeGen {
    protected injector: GenGenCodeGenInjector;
    constructor(protected options: IOptions, protected spec: IOpenAPI3) {
        this.injector = this.getInjector(options, spec);
    }

    public async run(): Promise<void> {
        const { endpointsService, modelMappingService, openAPIService, serviceMappingService } = this.injector;

        const endpoints = await endpointsService.getEndpoints();
        const modelsContainer = modelMappingService.toModelsContainer(openAPIService.getSchemasByEndpoints(endpoints));
        const newServices = serviceMappingService.toServiceModels(openAPIService.getOperationsByEndpoints(endpoints), modelsContainer);

        const project = this.generateProject(
            this.injector.modelsGenerator.getModelsCodeStructure(modelsContainer),
            this.injector.servicesGenerator.getServicesCodeStructure(newServices)
        );
        await project.save();

        this.copyLibs(this.options);
    }

    protected getInjector(options: IOptions, spec: IOpenAPI3): GenGenCodeGenInjector {
        return new GenGenCodeGenInjector(options, spec);
    }

    protected generateProject(modelsCode: StatementStructures[], servicesCode: StatementStructures[]): Project {
        const project = new Project(generatorsOptions);

        project
            .createSourceFile(
                `${this.options.output}/${this.injector.aliasResolver.getModelsFileName()}`,
                { statements: modelsCode },
                { overwrite: true }
            )
            .formatText();

        project
            .createSourceFile(
                `${this.options.output}/${this.injector.aliasResolver.getServicesFileName()}`,
                { statements: servicesCode },
                { overwrite: true }
            )
            .formatText();

        return project;
    }

    protected copyLibs(settings: IOptions): void {
        const output = new PathBuilder().normalizePath(`${settings.output}/${settings.utilsRelativePath}`);

        if (!existsSync(output)) {
            mkdirSync(output, { recursive: true });
        }

        promises.copyFile(resolve(__dirname, '../../libs/types.ts'), `${output}/types.ts`);
        promises.copyFile(resolve(__dirname, '../../libs/utils.ts'), `${output}/utils.ts`);
        promises.copyFile(resolve(__dirname, '../../libs/mappers.ts'), `${output}/mappers.ts`);
        promises.copyFile(resolve(__dirname, '../../libs/date-converters.ts'), `${output}/date-converters.ts`);
        promises.copyFile(resolve(__dirname, '../../libs/base-http.service.ts'), `${output}/base-http.service.ts`);
        promises.copyFile(resolve(__dirname, '../../libs/download.service.ts'), `${output}/download.service.ts`);

        if (!settings.unstrictId) {
            promises.copyFile(resolve(__dirname, '../../libs/Guid.ts'), `${output}/Guid.ts`);
        }
    }
}
