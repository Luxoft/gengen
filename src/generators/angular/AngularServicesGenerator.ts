import {
    CodeBlockWriter,
    Scope,
    StatementStructures,
    StructureKind,
    Writers,
    ClassDeclarationStructure,
    ConstructorDeclarationStructure
} from 'ts-morph';
import { MethodKind } from '../../models/kinds/MethodKind';
import { MethodOperation } from '../../models/kinds/MethodOperation';
import { ParameterPlace } from '../../models/kinds/ParameterPlace';
import { PropertyKind } from '../../models/kinds/PropertyKind';
import { IMethodModel, IReturnType } from '../../models/MethodModel';
import { IServiceModel } from '../../models/ServiceModel';
import { AliasResolver } from '../../services/AliasResolver';
import { first } from '../../utils';

const BASE_SERVICE = 'BaseHttpService';
const DOWNLOAD_SERVICE = 'DownloadFileService';
const HTTP_CLIENT = 'HttpClient';
const MODELS_NAMESPACE = '$models';
const MAPPERS_NAMESPACE = '$mappers';
const GET_BASE_PATH_FUNCTION_NAME = 'getBasePath';
const HTTP_CLIENT_VARIABLE_NAME = 'http';

export class AngularServicesGenerator {
    constructor(protected aliasResolver: AliasResolver) {}
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
                moduleSpecifier: `./${this.aliasResolver.getModelsModuleName()}`,
                namespaceImport: MODELS_NAMESPACE
            }
        ];
    }

    private getServices(services: IServiceModel[]): ClassDeclarationStructure[] {
        return services.map(
            (z): ClassDeclarationStructure => ({
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
                ctors: [this.getConstructorStatement(z)],
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
            .filter((z) => z.place === ParameterPlace.Query)
            .map((z) => `${z.name}=\${encodeURIComponent(${z.name})}`);

        if (!pairs.length) {
            return '`' + `${model.name}` + '`';
        }

        return '`' + `${model.name}?${pairs.join('&')}` + '`';
    }

    private createDownloadMethod(writer: CodeBlockWriter, model: IMethodModel): void {
        const parameter = first(model.parameters.filter((z) => z.name !== 'saveAs' && z.place === ParameterPlace.Body));

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
            .filter((z) => z.place === ParameterPlace.Body)
            .forEach((z) => {
                writer.withIndentationLevel(3, () => writer.writeLine(`${z.name},`));
            });

        if (this.needPipe(model.returnType)) {
            writer.writeLine(`).pipe(${this.createPipe(model.returnType)});`);
            return;
        }

        writer.writeLine(');');
    }

    private needPipe(returnType: IReturnType | undefined): returnType is IReturnType {
        if (!returnType) {
            return false;
        }

        return [PropertyKind.Object, PropertyKind.Identity, PropertyKind.Guid, PropertyKind.Date].includes(returnType.type.kind);
    }

    private createPipe(returnType: IReturnType): string {
        if (returnType.type.kind === PropertyKind.Guid) {
            return `${MAPPERS_NAMESPACE}.mapGuid()`;
        }

        if (returnType.type.kind === PropertyKind.Date) {
            return `${MAPPERS_NAMESPACE}.mapDate()`;
        }

        const type = `${MODELS_NAMESPACE}.${returnType.type.type}`;
        if (returnType.isCollection) {
            if (returnType.type.kind === PropertyKind.Identity) {
                return `${MAPPERS_NAMESPACE}.mapIdentityCollection(${type})`;
            }

            return `${MAPPERS_NAMESPACE}.mapCollection(${type})`;
        }

        if (returnType.type.kind === PropertyKind.Identity) {
            return `${MAPPERS_NAMESPACE}.mapIdentitySingle(${type})`;
        }

        return `${MAPPERS_NAMESPACE}.mapSingle(${type})`;
    }
}
