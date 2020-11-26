import { PropertyDeclarationStructure, Scope, StatementStructures, StructureKind } from 'ts-morph';

import { IEnumModel } from '../models/EnumModel';
import { IIdentityModel } from '../models/IdentityModel';
import { IInterfaceModel } from '../models/InterfaceModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { IObjectModel, IObjectPropertyModel } from '../models/ObjectModel';
import { PropertyKind } from '../models/PropertyKind';

const TO_DTO_METHOD = 'toDTO';
const FROM_DTO_METHOD = 'fromDTO';

export class ModelsGenerator {
    public getModelsCodeStructure(models: IModelsContainer): StatementStructures[] {
        return [
            ...this.getImports(),
            ...this.getEnums(models.enums),
            ...this.getInterfaces(models.interfaces),
            ...this.getIdentities(models.identities, models.interfaces),
            ...this.getObjects(models.objects)
        ];
    }

    private getImports(): StatementStructures[] {
        return [
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: './Guid',
                namedImports: [{ name: 'Guid' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: './date-converters',
                namedImports: [{ name: 'toDateIn' }, { name: 'toDateOut' }]
            }
        ];
    }

    private getEnums(enums: IEnumModel[]): StatementStructures[] {
        return enums.map((z) => ({
            kind: StructureKind.Enum,
            isExported: true,
            name: z.name,
            members: z.items.map((x) => ({ name: x.key, value: x.value }))
        }));
    }

    private getInterfaces(interfaces: IInterfaceModel[]): StatementStructures[] {
        return interfaces.map((z) => ({
            kind: StructureKind.Interface,
            name: z.name,
            isExported: true,
            properties: z.properties.map((x) => ({ name: x.name, type: x.isCollection ? `${x.dtoType}[]` : x.dtoType }))
        }));
    }

    private getIdentities(identities: IIdentityModel[], interfaces: IInterfaceModel[]): StatementStructures[] {
        return identities.map((z) => ({
            kind: StructureKind.Class,
            isExported: true,
            name: z.name,
            ctors: [
                {
                    parameters: [
                        { name: z.property.name, initializer: this.nullString, type: `${z.property.type} | ${z.property.dtoType}` }
                    ],
                    statements: `this.${z.property.name} = new ${z.property.type}(${z.property.name});`
                }
            ],
            properties: [{ scope: Scope.Public, name: z.property.name, type: z.property.type }, this.getGuardProperty(z.name)],
            methods: [
                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: TO_DTO_METHOD,
                    parameters: [{ name: z.property.name, type: z.property.type }],
                    returnType: interfaces.find(
                        (i) =>
                            i.properties.length === 1 &&
                            i.properties.every((x) => x.dtoType === z.property.dtoType && x.name === z.property.name)
                    )?.name,
                    statements: `return { ${z.property.name}: ${z.property.name}.toString() };`
                }
            ]
        }));
    }

    private getObjects(objects: IObjectModel[]): StatementStructures[] {
        return objects.map((z) => ({
            kind: StructureKind.Class,
            isExported: true,
            name: z.name,
            properties: [
                ...z.properties.map((x) => ({
                    scope: Scope.Public,
                    name: x.name,
                    type: x.isCollection ? `${x.type}[]` : x.type,
                    initializer: this.undefinedString
                })),
                this.getGuardProperty(z.name)
            ],
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
                        x.writeLine('return model;');
                    }
                }
            ]
        }));
    }

    private getGuardProperty(name: string): PropertyDeclarationStructure {
        return {
            kind: StructureKind.Property,
            scope: Scope.Private,
            name: `__${name[0].toLowerCase()}${name.slice(1)}`,
            type: 'string'
        };
    }

    private getToDtoPropertyInitializer(property: IObjectPropertyModel): string {
        const modelProperty = `model.${property.name}`;

        switch (property.kind) {
            case PropertyKind.Date:
                return `toDateOut(${modelProperty})`;

            case PropertyKind.Guid:
                if (property.isCollection) {
                    return `${modelProperty} ? ${modelProperty}.map(x => x.toString()) : ${this.undefinedString}`;
                }

                return (
                    `${modelProperty} ? ${modelProperty}.toString()` +
                    ` : ${property.isNullable ? this.nullString : `${property.type}.empty.toString()`}`
                );

            case PropertyKind.Identity:
                if (property.isCollection) {
                    return `${modelProperty} ? ${modelProperty}.map(x => ${property.type}.${TO_DTO_METHOD}(x.id)) : ${this.undefinedString}`;
                }

                return `${modelProperty} ? ${property.type}.${TO_DTO_METHOD}(${modelProperty}.id) : ${this.undefinedString}`;

            case PropertyKind.Object:
                if (property.isCollection) {
                    return `${modelProperty} ? ${modelProperty}.map(x => ${property.type}.${TO_DTO_METHOD}(x)) : ${this.undefinedString}`;
                }

                return `${modelProperty} ? ${property.type}.${TO_DTO_METHOD}(${modelProperty}) : ${this.undefinedString}`;
        }

        return modelProperty;
    }

    private getFromDtoPropertyInitializer(property: IObjectPropertyModel): string {
        const dtoProperty = `dto.${property.name}`;
        switch (property.kind) {
            case PropertyKind.Date:
                return `toDateIn(${dtoProperty})`;

            case PropertyKind.Guid:
                if (property.isCollection) {
                    return `${dtoProperty} ? ${dtoProperty}.map(x => new ${property.type}(x)) : []`;
                }

                if (property.isNullable) {
                    return `${dtoProperty} ? new ${property.type}(${dtoProperty}) : ${this.nullString}`;
                }

                return `new ${property.type}(${dtoProperty})`;

            case PropertyKind.Identity:
                if (property.isCollection) {
                    return `${dtoProperty} ? ${dtoProperty}.map(x => new ${property.type}.${FROM_DTO_METHOD}(x.id)) : []`;
                }

                return `${dtoProperty} ? new ${property.type}(${dtoProperty}.id) : ${this.undefinedString}`;

            case PropertyKind.Object:
                if (property.isCollection) {
                    return `${dtoProperty} ? ${dtoProperty}.map(x => ${property.type}.${FROM_DTO_METHOD}(x)) : []`;
                }

                return `${dtoProperty} ? ${property.type}.${FROM_DTO_METHOD}(${dtoProperty}) : ${this.undefinedString}`;
        }

        return dtoProperty;
    }

    private get undefinedString(): string {
        return `${undefined}`;
    }

    private get nullString(): string {
        return `${null}`;
    }
}
