import {
    ClassDeclarationStructure,
    ConstructorDeclarationStructure,
    ImportDeclarationStructure,
    StatementStructures,
    StructureKind,
    Writers
} from 'ts-morph';
import { ServicesMethodGeneratorToken } from '../../gengen/GenGenCodeGenInjector';
import { IServiceModel } from '../../models/ServiceModel';
import { MethodKind } from '../../models/kinds/MethodKind';
import { IOptions } from '../../options';
import { AliasResolver } from '../../services/AliasResolver';
import { PathBuilder } from '../../services/PathBuilder';
import { MAPPERS_NAMESPACE, MODELS_NAMESPACE, TYPES_NAMESPACE } from '../utils/consts';
import { HTTP_REQUEST_OPTIONS } from './AngularServicesMethodGenerator';

const BASE_SERVICE = 'BaseHttpService';
const DOWNLOAD_SERVICE = 'DownloadFileService';
const HTTP_CLIENT = 'HttpClient';

const GET_BASE_PATH_FUNCTION_NAME = 'getBasePath';
const HTTP_CLIENT_VARIABLE_NAME = 'http';

export class AngularServicesGenerator {
    private pathBuilder = new PathBuilder();

    constructor(
        protected aliasResolver: AliasResolver,
        protected methodGenerator: ServicesMethodGeneratorToken,
        protected settings: IOptions
    ) {}

    public getServicesCodeStructure(services: IServiceModel[]): StatementStructures[] {
        return [...this.getImports(), ...this.getServices(services)];
    }

    protected getImports(): ImportDeclarationStructure[] {
        const path = this.pathBuilder.normalizePath(`./${this.settings.utilsRelativePath}`);
        const imports: ImportDeclarationStructure[] = [
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: '@angular/common/http',
                namedImports: [{ name: HTTP_CLIENT }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: '@angular/core',
                namedImports: [{ name: 'Injectable' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: 'rxjs',
                namedImports: [{ name: 'Observable' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/Guid`,
                namedImports: [{ name: 'Guid' }, { name: 'mapGuid' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/base-http.service`,
                namedImports: this.settings.withRequestOptions
                    ? [{ name: BASE_SERVICE }, { name: HTTP_REQUEST_OPTIONS }]
                    : [{ name: BASE_SERVICE }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/download.service`,
                namedImports: [{ name: DOWNLOAD_SERVICE }, { name: 'IDownloadResult' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/utils`,
                namedImports: [{ name: GET_BASE_PATH_FUNCTION_NAME }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/mappers`,
                namespaceImport: MAPPERS_NAMESPACE
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/types`,
                namespaceImport: TYPES_NAMESPACE,
                isTypeOnly: true
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `./${this.aliasResolver.getModelsModuleName()}`,
                namespaceImport: MODELS_NAMESPACE
            }
        ];

        return this.settings.unstrictId ? imports.filter((x) => !x.moduleSpecifier.includes('Guid')) : imports;
    }

    protected getServices(services: IServiceModel[]): ClassDeclarationStructure[] {
        return services.map(
            (service): ClassDeclarationStructure => ({
                kind: StructureKind.Class,
                isExported: true,
                name: `${service.name}Service`,
                extends: service.methods.some((x) => x.kind === MethodKind.Download) ? DOWNLOAD_SERVICE : BASE_SERVICE,
                decorators: [
                    {
                        kind: StructureKind.Decorator,
                        name: 'Injectable',
                        arguments: Writers.object({ providedIn: "'root'" })
                    }
                ],
                ctors: [this.getConstructorStatement(service)],
                methods: this.methodGenerator.getMethodsCodeStructures(service.methods)
            })
        );
    }

    protected getConstructorStatement(service: IServiceModel): ConstructorDeclarationStructure {
        const superStatement = `super(${GET_BASE_PATH_FUNCTION_NAME}('${this.aliasResolver.alias}', '${service.relativePath}'), ${HTTP_CLIENT_VARIABLE_NAME});`;
        return {
            kind: StructureKind.Constructor,
            parameters: [{ name: HTTP_CLIENT_VARIABLE_NAME, type: HTTP_CLIENT }],
            statements: superStatement
        };
    }
}
