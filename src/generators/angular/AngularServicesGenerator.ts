import { Scope, StatementStructures, StructureKind, Writers } from 'ts-morph';

import { MethodKind } from '../../models/kinds/MethodKind';
import { IReturnType } from '../../models/MethodModel';
import { IServiceModel } from '../../models/ServiceModel';
import { IType } from '../../models/TypeModel';

const BASE_SERVICE = 'BaseHttpService';
const DOWNLOAD_SERVICE = 'DownloadFileService';
const HTTP_CLIENT = 'HttpClient';
const MODELS_NAMESPACE = '$models';

export class AngularServicesGenerator {
    public getServicesCodeStructure(services: IServiceModel[]): StatementStructures[] {
        return [...this.getImports(), ...this.getServices(services)];
    }

    private getImports(): StatementStructures[] {
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
                namedImports: [{ name: BASE_SERVICE }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: './download-service',
                namedImports: [{ name: DOWNLOAD_SERVICE }, { name: 'IDownloadResult' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: './mappers',
                namedImports: [
                    { name: 'mapCollection' },
                    { name: 'mapSingle' },
                    { name: 'mapIdentityCollection' },
                    { name: 'mapIdentitySingle' }
                ]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: './models',
                namespaceImport: MODELS_NAMESPACE
            }
        ];
    }

    private getServices(services: IServiceModel[]): StatementStructures[] {
        return services.map((z) => ({
            kind: StructureKind.Class,
            isExported: true,
            name: `${z.name}Service`,
            extends: z.methods.some((x) => x.kind === MethodKind.Download) ? DOWNLOAD_SERVICE : BASE_SERVICE,
            decorators: [
                {
                    kind: StructureKind.Decorator,
                    name: 'Injectable',
                    arguments: Writers.object({ providedIn: "'root'" })
                }
            ],
            ctors: [
                {
                    parameters: [{ name: 'http', type: HTTP_CLIENT }],
                    statements: `super('${z.relativePath}', http);`
                }
            ],
            methods: z.methods.map((x) => ({
                scope: Scope.Public,
                name: x.name,
                parameters: x.parameters.map((p) => ({
                    name: p.name,
                    type: this.getFullTypeName(p.dtoType, p.isCollection)
                })),
                returnType:
                    x.kind === MethodKind.Download
                        ? `Promise<${x.returnType?.type.type}>`
                        : `Observable<${this.getReturnTypeName(x.returnType)}>`
            }))
        }));
    }

    private getReturnTypeName(returnType: IReturnType | undefined): string {
        if (!returnType) {
            return 'void';
        }

        return this.getFullTypeName(returnType.type.type, returnType.isCollection);
    }

    private getFullTypeName(type: string, isCollection: boolean): string {
        const arraySymbol = isCollection ? '[]' : '';
        return `${MODELS_NAMESPACE}.${type}${arraySymbol}`;
    }
}
