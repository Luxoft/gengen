import { OptionalKind, PropertyDeclarationStructure, Scope, StatementStructures, StructureKind } from 'ts-morph';

import { configOptions } from '../options';

export class ConfigGenerator {
    public getConfigCodeStructure(): StatementStructures[] {
        return [
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `./${configOptions.className.toLowerCase()}`,
                namedImports: [{ name: configOptions.className }]
            },
            {
                kind: StructureKind.ExportAssignment,
                expression: 'new Set<string>([])',
                isExportEquals: false
            }
        ];
    }

    public getEndpointsCodeStructure(controllers: Record<string, string[]>): StatementStructures[] {
        return [
            {
                kind: StructureKind.Class,
                isExported: true,
                name: configOptions.className,
                properties: this.getProperties(controllers)
            }
        ];
    }

    private getProperties(controllers: Record<string, string[]>): OptionalKind<PropertyDeclarationStructure>[] {
        return Object.entries(controllers).map(([controller, actions]) => {
            const propertyValue = actions.reduce<Record<string, string>>((store, action) => {
                store[action] = `${controller}/${action}`;
                return store;
            }, {});

            return {
                name: `${controller}Service`,
                scope: Scope.Public,
                isStatic: true,
                initializer: JSON.stringify(propertyValue)
            };
        });
    }
}
