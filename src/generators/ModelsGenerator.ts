import { PropertyDeclarationStructure, Scope, StatementStructures, StructureKind } from 'ts-morph';

import { IEnumModel } from '../models/EnumModel';
import { IIdentityModel } from '../models/IdentityModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { first } from '../utils';

const COMMON_IDENTITY_NAME = 'IdentityDTO';

export class ModelsGenerator {
    public getModelsCodeStructure(models: IModelsContainer): StatementStructures[] {
        return [
            ...this.getImports(),
            ...this.getEnums(models.enums),
            ...this.getInterfaces(models.identities),
            ...this.getIdentities(models.identities)
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

    private getInterfaces(identities: IIdentityModel[]): StatementStructures[] {
        const result: StatementStructures[] = [];
        if (identities.length) {
            const identityModel = first(identities);
            result.push({
                kind: StructureKind.Interface,
                name: this.getInterfaceName(COMMON_IDENTITY_NAME),
                isExported: true,
                properties: [{ name: identityModel.property.name, type: identityModel.property.dtoType }]
            });
        }

        return result;
    }

    private getIdentities(identities: IIdentityModel[]): StatementStructures[] {
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
            properties: [
                { scope: Scope.Public, name: z.property.name, type: z.property.type, initializer: `${undefined}` },
                this.getGuardProperty(z.name)
            ],
            methods: [
                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: 'toDTO',
                    parameters: [{ name: z.property.name, type: z.property.type }],
                    returnType: this.getInterfaceName(COMMON_IDENTITY_NAME),
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

    private getInterfaceName(name: string): string {
        return `I${name}`;
    }
}
