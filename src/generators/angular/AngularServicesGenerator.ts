import { CodeBlockWriter, Scope, StatementStructures, StructureKind, Writers } from 'ts-morph';

import { MethodKind } from '../../models/kinds/MethodKind';
import { MethodOperation } from '../../models/kinds/MethodOperation';
import { MethodPlace } from '../../models/kinds/MethodPlace';
import { PropertyKind } from '../../models/kinds/PropertyKind';
import { IMethodModel, IReturnType } from '../../models/MethodModel';
import { IServiceModel } from '../../models/ServiceModel';
import { first } from '../../utils';

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
                    type: this.getFullTypeName(p.dtoType, p.isCollection, p.isModel),
                    initializer: p.optional ? `${undefined}` : undefined
                })),
                returnType:
                    x.kind === MethodKind.Download
                        ? `Promise<${x.returnType?.type.type}>`
                        : `Observable<${this.getReturnTypeName(x.returnType, x.returnType?.type.type)}>`,
                statements: (w) => {
                    x.kind === MethodKind.Download ? this.createDownloadMethod(w, x) : this.createMethod(w, x);
                }
            }))
        }));
    }

    private getReturnTypeName(returnType: IReturnType | undefined, targetType: string | undefined): string {
        if (!returnType || !targetType) {
            return 'void';
        }

        return this.getFullTypeName(targetType, returnType.isCollection, returnType.isModel);
    }

    private getFullTypeName(type: string, isCollection: boolean, isModel: boolean): string {
        const arraySymbol = isCollection ? '[]' : '';
        return `${isModel ? `${MODELS_NAMESPACE}.` : ''}${type}${arraySymbol}`;
    }

    private getFullMethodName(model: IMethodModel): string {
        const pairs = model.parameters
            .filter((z) => z.place === MethodPlace.Query)
            .map((z) => `${z.name}=\${encodeURIComponent(${z.name})}`);

        if (!pairs.length) {
            return '`' + `${model.name}` + '`';
        }

        return '`' + `${model.name}?${pairs.join('&')}` + '`';
    }

    private createDownloadMethod(writer: CodeBlockWriter, model: IMethodModel): void {
        const parameter = first(model.parameters.filter((z) => z.place === MethodPlace.Body));

        if (!model.parameters.find((z) => z.name === 'saveAs')) {
            throw new Error(`Cannot find 'saveAs' parameter for method ${model.name}`);
        }

        writer.writeLine('return this.downloadFile(');
        writer.withIndentationLevel(3, () => writer.writeLine(`${this.getFullMethodName(model)},`));
        writer.withIndentationLevel(3, () => writer.writeLine(`'${MethodOperation[model.operation].toLowerCase()}',`));
        writer.withIndentationLevel(3, () => writer.writeLine(`${parameter?.name ?? `${undefined}`},`));
        writer.withIndentationLevel(3, () => writer.writeLine('saveAs'));

        writer.writeLine(');');
    }

    private createMethod(writer: CodeBlockWriter, model: IMethodModel): void {
        writer.writeLine(
            `return this.${MethodOperation[model.operation].toLowerCase()}<${this.getReturnTypeName(
                model.returnType,
                model.returnType?.type.dtoType
            )}>(`
        );
        writer.withIndentationLevel(3, () => writer.writeLine(`${this.getFullMethodName(model)},`));
        model.parameters
            .filter((z) => z.place === MethodPlace.Body)
            .forEach((z) => {
                writer.withIndentationLevel(3, () => writer.writeLine(`${z.name},`));
            });

        if (!model.returnType?.isModel) {
            writer.writeLine(');');
            return;
        }

        writer.writeLine(`).pipe(${this.createPipe(model.returnType)});`);
    }

    private createPipe(returnType: IReturnType): string {
        const type = `${MODELS_NAMESPACE}.${returnType.type.type}`;
        if (returnType.isCollection) {
            if (returnType.type.kind === PropertyKind.Identity) {
                return `mapIdentityCollection(${type})`;
            }

            return `mapCollection(${type})`;
        }

        if (returnType.type.kind === PropertyKind.Identity) {
            return `mapIdentitySingle(${type})`;
        }

        return `mapSingle(${type})`;
    }
}
