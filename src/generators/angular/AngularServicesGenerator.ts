import {
    ClassDeclarationStructure,
    ConstructorDeclarationStructure,
    ImportDeclarationStructure,
    StatementStructures,
    StructureKind,
    Writers,
} from 'ts-morph';

import { MethodKind } from '../../models/kinds/MethodKind';
import { IServiceModel } from '../../models/ServiceModel';
import { IOptions } from '../../options';
import { AliasResolver } from '../../services/AliasResolver';
import { UriBuilder } from '../../services/UriBuilder';
import { MAPPERS_NAMESPACE, MODELS_NAMESPACE, TYPES_NAMESPACE } from '../utils/consts';
import { AngularServicesMethodGenerator, HTTP_REQUEST_OPTIONS } from './AngularServicesMethodGenerator';

const BASE_SERVICE = 'BaseHttpService';
const DOWNLOAD_SERVICE = 'DownloadFileService';
const HTTP_CLIENT = 'HttpClient';

const GET_BASE_PATH_FUNCTION_NAME = 'getBasePath';
const HTTP_CLIENT_VARIABLE_NAME = 'http';

export class AngularServicesGenerator {
    private methodGenerator: AngularServicesMethodGenerator;
    constructor(protected aliasResolver: AliasResolver, uriBuilder: UriBuilder, private settings: IOptions) {
        this.methodGenerator = new AngularServicesMethodGenerator(uriBuilder);
    }
    public getServicesCodeStructure(services: IServiceModel[]): StatementStructures[] {
        return [...this.getImports(), ...this.getServices(services)];
    }

    private getImports(): ImportDeclarationStructure[] {
        return [
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
                moduleSpecifier: './Guid',
                namedImports: [{ name: 'Guid' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: './base-http.service',
                namedImports: this.settings.withRequestOptions
                    ? [{ name: BASE_SERVICE }, { name: HTTP_REQUEST_OPTIONS }]
                    : [{ name: BASE_SERVICE }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: './download.service',
                namedImports: [{ name: DOWNLOAD_SERVICE }, { name: 'IDownloadResult' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: './utils',
                namedImports: [{ name: GET_BASE_PATH_FUNCTION_NAME }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: './mappers',
                namespaceImport: MAPPERS_NAMESPACE
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: './types',
                namespaceImport: TYPES_NAMESPACE,
                isTypeOnly: true
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `./${this.aliasResolver.getModelsModuleName()}`,
                namespaceImport: MODELS_NAMESPACE
            }
        ];
    }

    private getServices(services: IServiceModel[]): ClassDeclarationStructure[] {
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

    private getConstructorStatement(service: IServiceModel): ConstructorDeclarationStructure {
        const superStatement = `super(${GET_BASE_PATH_FUNCTION_NAME}('${this.aliasResolver.alias}', '${service.relativePath}'), ${HTTP_CLIENT_VARIABLE_NAME});`;
        return {
            kind: StructureKind.Constructor,
            parameters: [{ name: HTTP_CLIENT_VARIABLE_NAME, type: HTTP_CLIENT }],
            statements: superStatement
        };
    }
}
