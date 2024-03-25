import {
    ClassDeclarationStructure,
    CodeBlockWriter,
    ConstructorDeclarationStructure,
    ImportDeclarationStructure,
    OptionalKind,
    ParameterDeclarationStructure,
    PropertyDeclarationStructure,
    Scope,
    StatementStructures,
    StructureKind
} from 'ts-morph';
import { IEnumModel } from '../models/EnumModel';
import { IIdentityModel } from '../models/IdentityModel';
import { IInterfaceModel, IInterfaceUnionModel } from '../models/InterfaceModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { IObjectModel, IObjectPropertyModel } from '../models/ObjectModel';
import { PropertyKind } from '../models/kinds/PropertyKind';
import { IOptions } from '../options';
import { PathBuilder } from '../services/PathBuilder';
import { getInterfaceName, lowerFirst } from '../utils';
import { InterfacesGenerator } from './models-generator/InterfacesGenerator';
import { TypeSerializer } from './utils/TypeSerializer';
import { ARRAY_STRING, NULL_STRING, TYPES_NAMESPACE, UNDEFINED_STRING } from './utils/consts';

const TO_DTO_METHOD = 'toDTO';
const FROM_DTO_METHOD = 'fromDTO';

export class ModelsGenerator {
    private interfaceGenerator = new InterfacesGenerator();
    private pathBuilder = new PathBuilder();

    constructor(private settings: IOptions) {}

    public getModelsCodeStructure(models: IModelsContainer): StatementStructures[] {
        return [
            ...this.getImports(),
            ...this.getEnums(models.enums),
            ...this.interfaceGenerator.getCodeStructure(models.interfaces),
            ...this.interfaceGenerator.getCodeUnionsStructure(models.unionInterfaces),
            ...this.getUnionObjects(models.unionInterfaces),
            ...this.getIdentities(models.identities, models.interfaces),
            ...this.getObjects(models.objects)
        ];
    }

    private getImports(): ImportDeclarationStructure[] {
        const path = this.pathBuilder.normalizePath(`./${this.settings.utilsRelativePath}`);
        const imports: ImportDeclarationStructure[] = [
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/Guid`,
                namedImports: [{ name: 'Guid' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/date-converters`,
                namedImports: [{ name: 'toDateIn' }, { name: 'toDateOut' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/types`,
                namespaceImport: TYPES_NAMESPACE,
                isTypeOnly: true
            }
        ];

        return this.settings.unstrictId ? imports.filter((x) => !x.moduleSpecifier.includes('Guid')) : imports;
    }

    private getEnums(enums: IEnumModel[]): StatementStructures[] {
        return enums.map((z) => ({
            kind: StructureKind.Enum,
            isExported: true,
            name: z.name,
            members: z.items.map((x) => ({ name: x.key, value: x.value }))
        }));
    }

    private getIdentities(identities: IIdentityModel[], interfaces: IInterfaceModel[]): StatementStructures[] {
        return identities.map(
            (z): ClassDeclarationStructure => ({
                kind: StructureKind.Class,
                isExported: true,
                name: z.name,
                ctors: [
                    {
                        parameters: [
                            {
                                name: z.property.name,
                                hasQuestionToken: true,
                                type: TypeSerializer.fromTypeName(
                                    z.property.type !== z.property.dtoType
                                        ? `${z.property.type} | ${z.property.dtoType}`
                                        : `${z.property.type}`
                                ).toString()
                            }
                        ] as OptionalKind<ParameterDeclarationStructure>[],
                        statements: this.settings.unstrictId
                            ? `this.${z.property.name} = ${z.property.name} ?? '';`
                            : `this.${z.property.name} = new ${z.property.type}(${z.property.name});`
                    }
                ] as OptionalKind<ConstructorDeclarationStructure>[],
                properties: [{ scope: Scope.Public, name: z.property.name, type: z.property.type }, this.getGuardProperty(z.name)],
                methods: [
                    {
                        scope: Scope.Public,
                        isStatic: true,
                        name: TO_DTO_METHOD,
                        parameters: [{ name: z.property.name, type: z.property.type }],
                        // TODO: would find first identity interface everytime
                        returnType: interfaces.find(
                            (i) =>
                                i.properties.length === 1 &&
                                i.properties.every((x) => x.dtoType === z.property.dtoType && x.name === z.property.name)
                        )?.name,
                        statements: this.settings.unstrictId
                            ? `return { ${z.property.name}: ${z.property.name} };`
                            : `return { ${z.property.name}: ${z.property.name}.toString() };`
                    }
                ]
            })
        );
    }
    private getUnionObjects(objects: IInterfaceUnionModel[]): ClassDeclarationStructure[] {
        return objects.map((z) => ({
            kind: StructureKind.Class,
            isExported: true,
            name: z.name + 'Class',
            properties: [],
            methods: [
                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: FROM_DTO_METHOD,
                    parameters: [{ name: 'dto', type: getInterfaceName(z.name) }],
                    returnType: z.name,
                    statements: (x) => {
                        z.unionInterfaces.forEach((i) => {
                            x.writeLine('if (this.is' + i + '(dto)){');
                            x.writeLine('return ' + i + '.fromDTO(dto);');
                            x.writeLine('}');
                        });

                        x.writeLine('return ' + z.parentInterface + '.fromDTO(dto);');
                    }
                },

                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: TO_DTO_METHOD,
                    parameters: [{ name: 'model', type: z.name }],
                    returnType: getInterfaceName(z.name),
                    statements: (x) => {
                        z.unionInterfaces.forEach((i) => {
                            x.writeLine('if (this.is' + getInterfaceName(i) + '(model)){');
                            x.writeLine('return ' + i + '.toDTO(model);');
                            x.writeLine('}');
                        });

                        x.writeLine('return ' + z.parentInterface + '.toDTO(model);');
                    }
                },

                ...z.unionInterfaces.map((i) => ({
                    scope: Scope.Private,
                    isStatic: true,
                    name: 'is' + i,
                    parameters: [{ name: 'dto', type: getInterfaceName(z.name) }],
                    returnType: 'dto is ' + getInterfaceName(i),
                    statements: (x: CodeBlockWriter) => {
                        x.writeLine('return dto.type === ' + z.name + 'Types.' + i + ';');
                    }
                })),

                ...z.unionInterfaces.map((i) => ({
                    scope: Scope.Private,
                    isStatic: true,
                    name: 'is' + getInterfaceName(i),
                    parameters: [{ name: 'dto', type: z.name }],
                    returnType: 'dto is ' + i,
                    statements: (x: CodeBlockWriter) => {
                        x.writeLine('return dto.type === ' + z.name + 'Types.' + i + ';');
                    }
                }))
            ]
        }));
    }

    private getObjects(objects: IObjectModel[]): ClassDeclarationStructure[] {
        return objects.map((z) => ({
            kind: StructureKind.Class,
            isExported: true,
            name: z.name,
            properties: this.getObjectProperties(z, objects),
            methods: [
                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: TO_DTO_METHOD,
                    parameters: [{ name: 'model', type: `Partial<${z.name}>` }],
                    returnType: z.dtoType,
                    statements: (x) => {
                        x.writeLine('return {');
                        z.properties.forEach((p) =>
                            x.withIndentationLevel(3, () => x.writeLine(`${p.name}: ${this.getToDtoPropertyInitializer(p)},`))
                        );
                        this.printCombinedProprs(z, x, objects, (p) =>
                            x.withIndentationLevel(3, () => x.writeLine(`${p.name}: ${this.getToDtoPropertyInitializer(p)},`))
                        );
                        x.writeLine('};');
                    }
                },
                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: FROM_DTO_METHOD,
                    parameters: [{ name: 'dto', type: z.dtoType }],
                    returnType: z.name,
                    statements: (x) => {
                        x.writeLine(`const model = new ${z.name}();`);
                        z.properties.forEach((p) =>
                            x.withIndentationLevel(2, () => x.writeLine(`model.${p.name} = ${this.getFromDtoPropertyInitializer(p)};`))
                        );
                        this.printCombinedProprs(z, x, objects, (p) =>
                            x.withIndentationLevel(2, () => x.writeLine(`model.${p.name} = ${this.getFromDtoPropertyInitializer(p)};`))
                        );
                        x.writeLine('return model;');
                    }
                }
            ]
        }));
    }

    private getObjectProperties(objectModel: IObjectModel, objects: IObjectModel[]): PropertyDeclarationStructure[] {
        return [
            ...this.getObjectCombinedProperties(objectModel, objects),
            ...objectModel.properties.map((objectProperty) => this.getDeclarationStructure(objectProperty)),
            this.getGuardProperty(objectModel.name)
        ];
    }

    private getObjectCombinedProperties(objectModel: IObjectModel, objects: IObjectModel[]): PropertyDeclarationStructure[] {
        return objectModel.combineTypes.reduce((acc, item) => {
            const model = objects.find((x) => x.name === item);
            const props = (model?.properties ?? []).map((objectProperty) => this.getDeclarationStructure(objectProperty));
            if (model) {
                props.push(...this.getObjectCombinedProperties(model, objects));
            }
            return [...acc, ...props];
        }, [] as PropertyDeclarationStructure[]);
    }

    private getDeclarationStructure(objectProperty: IObjectPropertyModel): PropertyDeclarationStructure {
        return {
            kind: StructureKind.Property,
            scope: Scope.Public,
            name: objectProperty.name,
            type: new TypeSerializer({
                type: { name: objectProperty.typeAlias ?? objectProperty.type },
                isNullable: objectProperty.isNullable,
                isCollection: objectProperty.isCollection
            }).toString(),
            initializer: objectProperty.isCollection ? ARRAY_STRING : UNDEFINED_STRING
        };
    }

    private getGuardProperty(name: string): PropertyDeclarationStructure {
        return {
            kind: StructureKind.Property,
            scope: Scope.Private,
            name: `__${lowerFirst(name)}`,
            type: 'string',
            hasExclamationToken: true
        };
    }

    private getToDtoPropertyInitializer(property: IObjectPropertyModel): string {
        const modelProperty = `model.${property.name}`;

        switch (property.kind) {
            case PropertyKind.Date:
                if (property.isCollection) {
                    return `${modelProperty} ? ${modelProperty}.map(toDateOut) : ${UNDEFINED_STRING}`;
                }

                return `toDateOut(${modelProperty})`;

            case PropertyKind.Guid:
                if (property.isCollection) {
                    return `${modelProperty} ? ${modelProperty}.map(x => x.toString()) : ${UNDEFINED_STRING}`;
                }

                return (
                    `${modelProperty} ? ${modelProperty}.toString()` +
                    ` : ${property.isNullable ? NULL_STRING : `${property.type}.empty.toString()`}`
                );

            case PropertyKind.Identity:
                if (property.isCollection) {
                    return `${modelProperty} ? ${modelProperty}.map(x => ${property.type}.${TO_DTO_METHOD}(x.id)) : ${UNDEFINED_STRING}`;
                }

                return `${modelProperty} ? ${property.type}.${TO_DTO_METHOD}(${modelProperty}.id) : ${UNDEFINED_STRING}`;

            case PropertyKind.Object:
                if (property.isCollection) {
                    return `${modelProperty} ? ${modelProperty}.map(x => ${
                        property.dtoTypeAlias ?? property.type
                    }.${TO_DTO_METHOD}(x)) : ${UNDEFINED_STRING}`;
                }

                return `${modelProperty} ? ${property.type}.${TO_DTO_METHOD}(${modelProperty}) : ${UNDEFINED_STRING}`;
        }

        return modelProperty;
    }

    private getFromDtoPropertyInitializer(property: IObjectPropertyModel): string {
        const dtoProperty = `dto.${property.name}`;

        switch (property.kind) {
            case PropertyKind.Date:
                if (property.isCollection) {
                    return `${dtoProperty} ? ${dtoProperty}.map(toDateIn) : ${ARRAY_STRING}`;
                }

                return `toDateIn(${dtoProperty})`;

            case PropertyKind.Guid:
                if (property.isCollection) {
                    return `${dtoProperty} ? ${dtoProperty}.map(x => new ${property.type}(x)) : ${ARRAY_STRING}`;
                }

                if (property.isNullable) {
                    return `${dtoProperty} ? new ${property.type}(${dtoProperty}) : ${NULL_STRING}`;
                }

                return `new ${property.type}(${dtoProperty})`;

            case PropertyKind.Identity:
                if (property.isCollection) {
                    return `${dtoProperty} ? ${dtoProperty}.map(x => new ${property.type}(x.id)) : ${ARRAY_STRING}`;
                }

                return `${dtoProperty} ? new ${property.type}(${dtoProperty}.id) : ${UNDEFINED_STRING}`;

            case PropertyKind.Object:
                if (property.isCollection) {
                    return `${dtoProperty} ? ${dtoProperty}.map(x => ${
                        property.dtoTypeAlias ?? property.type
                    }.${FROM_DTO_METHOD}(x)) : ${ARRAY_STRING}`;
                }

                return `${dtoProperty} ? ${property.type}.${FROM_DTO_METHOD}(${dtoProperty}) : ${UNDEFINED_STRING}`;

            default:
                if (property.isCollection) {
                    return `${dtoProperty} ? ${dtoProperty} : ${ARRAY_STRING}`;
                }

                return dtoProperty;
        }
    }

    private printCombinedProprs(
        model: IObjectModel | undefined,
        writer: CodeBlockWriter,
        objectsCollection: IObjectModel[],
        printFunction: (p: IObjectPropertyModel) => void
    ): void {
        if (!model) {
            return;
        }
        model.combineTypes.forEach((y) => {
            (objectsCollection.find((x) => x.name === y)?.properties ?? []).forEach((p) => printFunction(p));
            this.printCombinedProprs(
                objectsCollection.find((x) => x.name === y),
                writer,
                objectsCollection,
                printFunction
            );
        });
    }
}
