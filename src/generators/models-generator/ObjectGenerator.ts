import {
    ClassDeclarationStructure,
    CodeBlockWriter,
    ConstructorDeclarationStructure,
    PropertyDeclarationStructure,
    Scope,
    StructureKind
} from 'ts-morph';

import { PropertyKind } from '../../models/kinds/PropertyKind';
import { IExtendedObjectModel, IObjectPropertyModel, ObjectModel } from '../../models/ObjectModel';
import { NameService } from '../../services/NameService';
import { FROM_DTO_METHOD, TO_DTO_METHOD } from '../ModelsGenerator';
import { ARRAY_STRING, NULL_STRING, UNDEFINED_STRING } from '../utils/consts';
import { TypeSerializer } from '../utils/TypeSerializer';
import { PropertiesGenerator } from './PropertiesGenerator';
import { publicFields } from '../utils/typeOrUndefined';

export class ObjectGenerator {
    constructor(
        private readonly nameService: NameService,
        private readonly propertiesGenerator: PropertiesGenerator
    ) {}

    public getObjects(objects: ObjectModel[]): ClassDeclarationStructure[] {
        return objects.map((z) => ({
            kind: StructureKind.Class,
            isExported: true,
            name: z.name,
            properties: this.getObjectProperties(z, objects),
            ctors: [
                {
                    kind: StructureKind.Constructor,
                    scope: Scope.Protected,
                    parameters: [{ name: 'dto', type: z.dtoType }],
                    statements: (x) => {
                        z.properties.forEach((p) => x.writeLine(`this.${p.name} = ${this.getFromDtoPropertyInitializer(p)};`));
                        this.printCombinedProprs(z, x, objects, (p) =>
                            x.writeLine(`this.${p.name} = ${this.getFromDtoPropertyInitializer(p)};`)
                        );
                    }
                } satisfies ConstructorDeclarationStructure
            ],
            methods: [
                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: TO_DTO_METHOD,
                    parameters: [{ name: 'model', type: this.getToDtoArgumentType(z.name) }],
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
                    statements: (x) => x.writeLine(`return new ${z.name}(dto);`)
                }
            ]
        }));
    }

    protected getToDtoArgumentType(originType: string): string {
        return publicFields(originType);
    }

    private getObjectProperties(objectModel: ObjectModel, objects: ObjectModel[]): PropertyDeclarationStructure[] {
        return [
            ...this.getObjectCombinedProperties(objectModel, objects),
            ...objectModel.properties.map((objectProperty) => this.getDeclarationStructure(objectProperty)),
            this.propertiesGenerator.getGuardProperty(objectModel.name)
        ];
    }

    private getObjectCombinedProperties(objectModel: ObjectModel, objects: ObjectModel[]): PropertyDeclarationStructure[] {
        if (this.isIExtendedObjectModel(objectModel)) {
            return objectModel.extendingTypes.reduce((acc, item) => {
                const model = objects.find((x) => x.name === item);
                const props = (model?.properties ?? []).map((objectProperty) => this.getDeclarationStructure(objectProperty));
                if (model) {
                    props.push(...this.getObjectCombinedProperties(model, objects));
                }
                return [...acc, ...props];
            }, [] as PropertyDeclarationStructure[]);
        }
        return [];
    }

    private getDeclarationStructure(objectProperty: IObjectPropertyModel): PropertyDeclarationStructure {
        return {
            kind: StructureKind.Property,
            scope: Scope.Public,
            name: objectProperty.name,
            type: new TypeSerializer({
                type: { name: objectProperty.type },
                isNullable: !objectProperty.isRequired && objectProperty.isNullable,
                isOptional: !objectProperty.isRequired,
                isCollection: objectProperty.isCollection
            }).toString(),
            initializer: undefined
        };
    }

    private getToDtoPropertyInitializer(property: IObjectPropertyModel): string {
        const modelProperty = `model.${property.name}`;

        switch (property.kind) {
            case PropertyKind.Date:
                if (property.isCollection) {
                    const collectionMap = `${modelProperty}.map(toDateOut)`;
                    return property.isRequired ? collectionMap : `${modelProperty} ? ${collectionMap} : ${UNDEFINED_STRING}`;
                }

                return `toDateOut(${modelProperty})`;

            case PropertyKind.Guid: {
                if (property.isCollection) {
                    const collectionMap = `${modelProperty}.map(x => x.toString())`;
                    return property.isRequired ? collectionMap : `${modelProperty} ? ${collectionMap} : ${UNDEFINED_STRING}`;
                }

                const valueMap = `${modelProperty}.toString()`;
                return property.isRequired
                    ? valueMap
                    : `${modelProperty} ? ${valueMap} : ${property.isNullable ? NULL_STRING : `${property.type}.empty.toString()`}`;
            }

            case PropertyKind.Identity: {
                if (property.isCollection) {
                    const collectionMap = `${modelProperty}.map(x => ${property.type}.${TO_DTO_METHOD}(x.id))`;
                    return property.isRequired ? collectionMap : `${modelProperty} ? ${collectionMap} : ${UNDEFINED_STRING}`;
                }

                const valueMap = `${property.type}.${TO_DTO_METHOD}(${modelProperty}.id)`;
                return property.isRequired ? valueMap : `${modelProperty} ? ${valueMap} : ${UNDEFINED_STRING}`;
            }

            case PropertyKind.Union: {
                if (property.isCollection) {
                    const collectionMap = `${modelProperty}.map(x => ${this.nameService.getClassName(property.type)}.${TO_DTO_METHOD}(x))`;
                    return property.isRequired ? collectionMap : `${modelProperty} ? ${collectionMap} : ${UNDEFINED_STRING}`;
                }

                const valueMap = `${this.nameService.getClassName(property.type)}.${TO_DTO_METHOD}(${modelProperty})`;
                return property.isRequired ? valueMap : `${modelProperty} ? ${valueMap} : ${UNDEFINED_STRING}`;
            }

            case PropertyKind.Object: {
                if (property.isCollection) {
                    const collectionMap = `${modelProperty}.map(x => ${property.type}.${TO_DTO_METHOD}(x))`;
                    return property.isRequired ? collectionMap : `${modelProperty} ? ${collectionMap} : ${UNDEFINED_STRING}`;
                }

                const valueMap = `${property.type}.${TO_DTO_METHOD}(${modelProperty})`;
                return property.isRequired ? valueMap : `${modelProperty} ? ${valueMap} : ${UNDEFINED_STRING}`;
            }
        }

        return modelProperty;
    }

    private getFromDtoPropertyInitializer(property: IObjectPropertyModel): string {
        const dtoProperty = `dto.${property.name}`;

        switch (property.kind) {
            case PropertyKind.Date:
                if (property.isCollection) {
                    const collectionMap = `${dtoProperty}.map(toDateIn)`;
                    return property.isRequired ? collectionMap : `${dtoProperty} ? ${collectionMap} : ${ARRAY_STRING}`;
                }

                return `toDateIn(${dtoProperty})`;

            case PropertyKind.Guid:
                if (property.isCollection) {
                    const collectionMap = ` ${dtoProperty}.map(x => new ${property.type}(x))`;
                    return property.isRequired ? collectionMap : `${dtoProperty} ? ${collectionMap} : ${ARRAY_STRING}`;
                }

                if (property.isNullable && !property.isRequired) {
                    return `${dtoProperty} ? new ${property.type}(${dtoProperty}) : ${NULL_STRING}`;
                }

                return `new ${property.type}(${dtoProperty})`;

            case PropertyKind.Identity: {
                if (property.isCollection) {
                    const collectionMap = `${dtoProperty}.map(x => new ${property.type}(x.id))`;
                    return property.isRequired ? collectionMap : `${dtoProperty} ? ${collectionMap} : ${ARRAY_STRING}`;
                }

                const createValue = `new ${property.type}(${dtoProperty}.id)`;
                return property.isRequired ? createValue : `${dtoProperty} ? ${createValue} : ${UNDEFINED_STRING}`;
            }

            case PropertyKind.Union: {
                if (property.isCollection) {
                    const collectionMap = `${dtoProperty}.map(x => ${this.nameService.getClassName(property.type)}.${FROM_DTO_METHOD}(x))`;
                    return property.isRequired ? collectionMap : `${dtoProperty} ? ${collectionMap} : ${ARRAY_STRING}`;
                }

                const createValue = `${this.nameService.getClassName(property.type)}.${FROM_DTO_METHOD}(${dtoProperty})`;
                return property.isRequired ? createValue : `${dtoProperty} ? ${createValue} : ${UNDEFINED_STRING}`;
            }

            case PropertyKind.Object: {
                if (property.isCollection) {
                    const collectionMap = `${dtoProperty}.map(x => ${property.type}.${FROM_DTO_METHOD}(x))`;
                    return property.isRequired ? collectionMap : `${dtoProperty} ? ${collectionMap} : ${ARRAY_STRING}`;
                }

                const valueMap = `${property.type}.${FROM_DTO_METHOD}(${dtoProperty})`;
                return property.isRequired ? valueMap : `${dtoProperty} ? ${valueMap} : ${UNDEFINED_STRING}`;
            }

            default:
                if (property.isCollection && !property.isRequired) {
                    return `${dtoProperty} ? ${dtoProperty} : ${ARRAY_STRING}`;
                }

                return dtoProperty;
        }
    }

    private printCombinedProprs(
        model: ObjectModel | undefined,
        writer: CodeBlockWriter,
        objectsCollection: ObjectModel[],
        printFunction: (p: IObjectPropertyModel) => void
    ): void {
        if (!model || !this.isIExtendedObjectModel(model)) {
            return;
        }
        model.extendingTypes.forEach((y) => {
            (objectsCollection.find((x) => x.name === y)?.properties ?? []).forEach((p) => printFunction(p));
            this.printCombinedProprs(
                objectsCollection.find((x) => x.name === y),
                writer,
                objectsCollection,
                printFunction
            );
        });
    }

    private isIExtendedObjectModel(objects: ObjectModel): objects is IExtendedObjectModel {
        return Boolean((objects as IExtendedObjectModel)?.extendingTypes);
    }
}
