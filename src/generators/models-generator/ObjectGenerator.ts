import { ClassDeclarationStructure, CodeBlockWriter, PropertyDeclarationStructure, Scope, StructureKind } from 'ts-morph';

import { PropertyKind } from '../../models/kinds/PropertyKind';
import { IExtendedObjectModel, IObjectPropertyModel, ObjectModel } from '../../models/ObjectModel';
import { NameService } from '../../swagger/nameService';
import { FROM_DTO_METHOD, TO_DTO_METHOD } from '../ModelsGenerator';
import { ARRAY_STRING, NULL_STRING, UNDEFINED_STRING } from '../utils/consts';
import { PropertiesGenerator } from './PropertiesGenerator';
import { TypeSerializer } from '../utils/TypeSerializer';

export class ObjectGenerator {
    private nameService = new NameService();
    private propertiesGenerator = new PropertiesGenerator();

    public getObjects(objects: ObjectModel[]): ClassDeclarationStructure[] {
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
                isNullable: objectProperty.isNullable,
                isCollection: objectProperty.isCollection
            }).toString(),
            initializer: objectProperty.isCollection ? ARRAY_STRING : UNDEFINED_STRING
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

            case PropertyKind.Union:
                if (property.isCollection) {
                    return `${modelProperty} ? ${modelProperty}.map(x => ${this.nameService.getClassName(
                        property.type
                    )}.${TO_DTO_METHOD}(x)) : ${UNDEFINED_STRING}`;
                }

                return `${modelProperty} ? ${this.nameService.getClassName(
                    property.type
                )}.${TO_DTO_METHOD}(${modelProperty}) : ${UNDEFINED_STRING}`;

            case PropertyKind.Object:
                if (property.isCollection) {
                    return `${modelProperty} ? ${modelProperty}.map(x => ${property.type}.${TO_DTO_METHOD}(x)) : ${UNDEFINED_STRING}`;
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

            case PropertyKind.Union:
                if (property.isCollection) {
                    return `${dtoProperty} ? ${dtoProperty}.map(x => ${this.nameService.getClassName(
                        property.type
                    )}.${FROM_DTO_METHOD}(x)) : ${ARRAY_STRING}`;
                }

                return `${dtoProperty} ? ${this.nameService.getClassName(
                    property.type
                )}.${FROM_DTO_METHOD}(${dtoProperty}) : ${UNDEFINED_STRING}`;

            case PropertyKind.Object:
                if (property.isCollection) {
                    return `${dtoProperty} ? ${dtoProperty}.map(x => ${property.type}.${FROM_DTO_METHOD}(x)) : ${ARRAY_STRING}`;
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
