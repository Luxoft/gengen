import {
    ClassDeclarationStructure,
    ConstructorDeclarationStructure,
    OptionalKind,
    ParameterDeclarationStructure,
    Scope,
    StatementStructures,
    StructureKind
} from 'ts-morph';

import { IIdentityModel } from '../../models/IdentityModel';
import { InterfaceModel } from '../../models/InterfaceModel';
import { IOptions } from '../../options';
import { TO_DTO_METHOD } from '../ModelsGenerator';
import { PropertiesGenerator } from './PropertiesGenerator';
import { TypeSerializer } from '../utils/TypeSerializer';

export class IdentitiesGenerator {
    private propertiesGenerator = new PropertiesGenerator();

    constructor(private settings: IOptions) {}
    public getIdentities(identities: IIdentityModel[], interfaces: InterfaceModel[]): StatementStructures[] {
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
                properties: [this.propertiesGenerator.getObjectProperty(z.property), this.propertiesGenerator.getGuardProperty(z.name)],
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
}
