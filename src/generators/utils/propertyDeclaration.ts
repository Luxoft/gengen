import { PropertyDeclarationStructure, Scope, StructureKind } from 'ts-morph';

import { lowerFirst } from '../../utils';

export function getGuardProperty(name: string): PropertyDeclarationStructure {
    return {
        kind: StructureKind.Property,
        scope: Scope.Private,
        name: `__${lowerFirst(name)}`,
        type: 'string',
        hasExclamationToken: true
    };
}
