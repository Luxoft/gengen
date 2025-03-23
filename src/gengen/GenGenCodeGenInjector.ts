import { MethodDeclarationStructure, OptionalKind } from 'ts-morph';
import { Injector } from '../container/Injector';
import { ModelsGenerator } from '../generators/ModelsGenerator';
import { AngularServicesGenerator } from '../generators/angular/AngularServicesGenerator';
import { AngularServicesMethodGenerator } from '../generators/angular/AngularServicesMethodGenerator';
import { IMethodModel } from '../models/method-parameter/IMethodModel';
import { IOptions } from '../options';
import { AliasResolver } from '../services/AliasResolver';
import { EndpointNameResolver } from '../services/EndpointNameResolver';
import { EndpointsConfigReader } from '../services/EndpointsConfigReader';
import { EndpointsService } from '../services/EndpointsService';
import { ModelMappingService } from '../services/ModelMappingService';
import { ServiceMappingService } from '../services/ServiceMappingService';
import { TypesService } from '../services/TypesService';
import { UriBuilder } from '../services/UriBuilder';
import { OpenAPIService } from '../swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../swagger/OpenAPITypesGuard';
import { IOpenAPI3 } from '../swagger/v3/open-api';
import { NameService } from '../services/NameService';
import { InterfacesGenerator } from '../generators/models-generator/InterfacesGenerator';
import { UnionGenerator } from '../generators/models-generator/UnionsGenerator';
import { IdentitiesGenerator } from '../generators/models-generator/IdentitiesGenerator';
import { ObjectGenerator } from '../generators/models-generator/ObjectGenerator';
import { PropertiesGenerator } from '../generators/models-generator/PropertiesGenerator';

export abstract class EndpointsToken {
    public abstract getEndpoints(): Promise<Set<string>> | Set<string>;
}

export abstract class ServicesMethodGeneratorToken {
    public abstract getMethodsCodeStructures(methodModels: IMethodModel[]): OptionalKind<MethodDeclarationStructure>[];
}

export class GenGenCodeGenInjector {
    public get servicesGenerator(): AngularServicesGenerator {
        return this.injector.get(AngularServicesGenerator);
    }

    public get endpointsService(): EndpointsToken {
        return this.injector.get(EndpointsToken);
    }

    public get modelsGenerator(): ModelsGenerator {
        return this.injector.get(ModelsGenerator);
    }

    public get modelMappingService(): ModelMappingService {
        return this.injector.get(ModelMappingService);
    }

    public get openAPIService(): OpenAPIService {
        return this.injector.get(OpenAPIService);
    }
    public get serviceMappingService(): ServiceMappingService {
        return this.injector.get(ServiceMappingService);
    }

    public get aliasResolver(): AliasResolver {
        return this.injector.get(AliasResolver);
    }

    public injector: Injector = new Injector((factory) =>
        factory
            .provide(
                AngularServicesGenerator,
                (x) => new AngularServicesGenerator(x.get(AliasResolver), x.get(ServicesMethodGeneratorToken), this.options)
            )
            .provide(OpenAPITypesGuard)
            .provide(EndpointNameResolver)
            .provide(
                ModelsGenerator,
                (x) =>
                    new ModelsGenerator(
                        this.options,
                        x.get(InterfacesGenerator),
                        x.get(UnionGenerator),
                        x.get(IdentitiesGenerator),
                        x.get(ObjectGenerator)
                    )
            )
            .provide(UriBuilder)
            .provide(ServicesMethodGeneratorToken, (x) => new AngularServicesMethodGenerator(x.get(UriBuilder)))
            .provide(AliasResolver, () => new AliasResolver(this.options))
            .provide(EndpointsService, (x) => new EndpointsService(x.get(OpenAPIService), x.get(EndpointNameResolver)))
            .provide(EndpointsToken, (x) =>
                this.options.all
                    ? new EndpointsService(x.get(OpenAPIService), x.get(EndpointNameResolver))
                    : new EndpointsConfigReader(this.options)
            )
            .provide(
                ServiceMappingService,
                (x) =>
                    new ServiceMappingService(
                        x.get(OpenAPIService),
                        x.get(TypesService),
                        x.get(OpenAPITypesGuard),
                        x.get(EndpointsService),
                        x.get(EndpointNameResolver),
                        this.options
                    )
            )
            .provide(ModelMappingService, (x) => this.getModelMappingService(x))
            .provide(TypesService, (x) => new TypesService(x.get(OpenAPITypesGuard), this.options))
            .provide(OpenAPIService, (x) => new OpenAPIService(this.spec, x.get(OpenAPITypesGuard)))

            .provide(InterfacesGenerator, (x) => new InterfacesGenerator(x.get(PropertiesGenerator)))
            .provide(ObjectGenerator, (x) => this.getObjectGenerator(x))
            .provide(UnionGenerator, (x) => new UnionGenerator(x.get(NameService)))
            .provide(IdentitiesGenerator, (x) => new IdentitiesGenerator(x.get(PropertiesGenerator), this.options))
            .provide(PropertiesGenerator, (x) => new PropertiesGenerator(x.get(NameService)))
            .provide(NameService)
    );
    constructor(
        private options: IOptions,
        private spec: IOpenAPI3
    ) {}

    private getObjectGenerator(injector: Injector): ObjectGenerator {
        if (!this.options.withLegacyUndefineGeneration) {
            return new ObjectGenerator(injector.get(NameService), injector.get(PropertiesGenerator));
        }

        class LegacyObjectGenerator extends ObjectGenerator {
            protected override getToDtoArgumentType(x: string): string {
                return `Partial<${x}>`;
            }
        }

        return new LegacyObjectGenerator(injector.get(NameService), injector.get(PropertiesGenerator));
    }

    private getModelMappingService(injector: Injector): ModelMappingService {
        if (!this.options.withLegacyUndefineGeneration) {
            return new ModelMappingService(
                injector.get(OpenAPIService),
                injector.get(OpenAPITypesGuard),
                injector.get(TypesService),
                injector.get(NameService)
            );
        }

        class LegacyModelMappingService extends ModelMappingService {
            protected isRequiredField(): boolean {
                return false;
            }
        }

        return new LegacyModelMappingService(
            injector.get(OpenAPIService),
            injector.get(OpenAPITypesGuard),
            injector.get(TypesService),
            injector.get(NameService)
        );
    }
}
