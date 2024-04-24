import { ClassDeclarationStructure, CodeBlockWriter, Scope, StructureKind } from 'ts-morph';

import { IUnionModel } from '../../models/UnionModel';
import { getInterfaceName, getClassName, getUnionName, getUnionTypesName } from '../../utils';
import { FROM_DTO_METHOD, TO_DTO_METHOD } from '../ModelsGenerator';

export class UnionGenerator {
    public getUnionObjects(objects: IUnionModel[]): ClassDeclarationStructure[] {
        return objects.map((z) => ({
            kind: StructureKind.Class,
            isExported: true,
            name: getClassName(getUnionName(z.name)),
            properties: [],
            methods: [
                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: FROM_DTO_METHOD,
                    parameters: [{ name: 'dto', type: getInterfaceName(getUnionName(z.name)) }],
                    returnType: getUnionName(z.name),
                    statements: (x) => {
                        z.unionInterfaces.forEach((i) => {
                            x.writeLine('if (this.is' + i + '(dto)){');
                            x.writeLine('return ' + i + '.fromDTO(dto);');
                            x.writeLine('}');
                        });

                        x.writeLine('return ' + z.name + '.fromDTO(dto);');
                    }
                },

                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: TO_DTO_METHOD,
                    parameters: [{ name: 'model', type: getUnionName(z.name) }],
                    returnType: getInterfaceName(getUnionName(z.name)),
                    statements: (x) => {
                        z.unionInterfaces.forEach((i) => {
                            x.writeLine('if (this.is' + getInterfaceName(i) + '(model)){');
                            x.writeLine('return ' + i + '.toDTO(model);');
                            x.writeLine('}');
                        });

                        x.writeLine('return ' + z.name + '.toDTO(model);');
                    }
                },

                ...z.unionInterfaces.map((i) => ({
                    scope: Scope.Private,
                    isStatic: true,
                    name: 'is' + i,
                    parameters: [{ name: 'dto', type: getInterfaceName(getUnionName(z.name)) }],
                    returnType: 'dto is ' + getInterfaceName(i),
                    statements: (x: CodeBlockWriter) => {
                        x.writeLine('return dto.type === ' + getUnionTypesName(z.name) + '.' + i + ';');
                    }
                })),

                ...z.unionInterfaces.map((i) => ({
                    scope: Scope.Private,
                    isStatic: true,
                    name: 'is' + getInterfaceName(i),
                    parameters: [{ name: 'dto', type: getUnionName(z.name) }],
                    returnType: 'dto is ' + i,
                    statements: (x: CodeBlockWriter) => {
                        x.writeLine('return dto.type === ' + getUnionTypesName(z.name) + '.' + i + ';');
                    }
                }))
            ]
        }));
    }
}
