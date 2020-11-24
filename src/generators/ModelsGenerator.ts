import { PropertyDeclarationStructure, Scope, StatementStructures, StructureKind } from 'ts-morph';

import { IEnumModel } from '../models/EnumModel';
import { IIdentityModel } from '../models/IdentityModel';
import { IInterfaceModel } from '../models/InterfaceModel';
import { IModelsContainer } from '../models/ModelsContainer';

export class ModelsGenerator {
    public getModelsCodeStructure(models: IModelsContainer): StatementStructures[] {
        return [
            ...this.getImports(),
            ...this.getEnums(models.enums),
            ...this.getInterfaces(models.interfaces),
            ...this.getIdentities(models.identities, models.interfaces)
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
            properties: z.properties.map((x) => ({ name: x.name, type: x.dtoType }))
        }));
    }

    private getIdentities(identities: IIdentityModel[], interfaces: IInterfaceModel[]): StatementStructures[] {
        return identities.map((z) => ({
            kind: StructureKind.Class,
            isExported: true,
            name: z.name,
            ctors: [
                {
                    parameters: [{ name: z.property.name, initializer: `${null}`, type: `${z.property.type} | ${z.property.dtoType}` }],
                    statements: `this.${z.property.name} = new ${z.property.type}(${z.property.name});`
                }
            ],
            properties: [{ scope: Scope.Public, name: z.property.name, type: z.property.type }, this.getGuardProperty(z.name)],
            methods: [
                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: 'toDTO',
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

    private getGuardProperty(name: string): PropertyDeclarationStructure {
        return {
            kind: StructureKind.Property,
            scope: Scope.Private,
            name: `_${name[0].toLowerCase()}${name.slice(1)}`,
            type: 'string'
        };
    }
}
