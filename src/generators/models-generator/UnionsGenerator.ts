import { ClassDeclarationStructure, CodeBlockWriter, Scope, StructureKind } from 'ts-morph';

import { IUnionModel } from '../../models/UnionModel';
import { NameService } from '../../swagger/nameService';
import { FROM_DTO_METHOD, TO_DTO_METHOD } from '../ModelsGenerator';

export class UnionGenerator {
    private nameService = new NameService();
    public getUnionObjects(objects: IUnionModel[]): ClassDeclarationStructure[] {
        return objects.map((z) => ({
            kind: StructureKind.Class,
            isExported: true,
            name: this.nameService.getClassName(this.nameService.getUnionName(z.name)),
            properties: [],
            methods: [
                {
                    scope: Scope.Public,
                    isStatic: true,
                    name: FROM_DTO_METHOD,
                    parameters: [{ name: 'dto', type: this.nameService.getInterfaceName(this.nameService.getUnionName(z.name)) }],
                    returnType: this.nameService.getUnionName(z.name),
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
                    parameters: [{ name: 'model', type: this.nameService.getUnionName(z.name) }],
                    returnType: this.nameService.getInterfaceName(this.nameService.getUnionName(z.name)),
                    statements: (x) => {
                        z.unionInterfaces.forEach((i) => {
                            x.writeLine('if (this.is' + this.nameService.getInterfaceName(i) + '(model)){');
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
                    parameters: [{ name: 'dto', type: this.nameService.getInterfaceName(this.nameService.getUnionName(z.name)) }],
                    returnType: 'dto is ' + this.nameService.getInterfaceName(i),
                    statements: (x: CodeBlockWriter) => {
                        x.writeLine('return dto.type === ' + this.nameService.getUnionTypesName(z.name) + '.' + i + ';');
                    }
                })),

                ...z.unionInterfaces.map((i) => ({
                    scope: Scope.Private,
                    isStatic: true,
                    name: 'is' + this.nameService.getInterfaceName(i),
                    parameters: [{ name: 'dto', type: this.nameService.getUnionName(z.name) }],
                    returnType: 'dto is ' + i,
                    statements: (x: CodeBlockWriter) => {
                        x.writeLine('return dto.type === ' + this.nameService.getUnionTypesName(z.name) + '.' + i + ';');
                    }
                }))
            ]
        }));
    }
}
