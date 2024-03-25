import {
    InterfaceDeclarationStructure,
    OptionalKind,
    PropertySignatureStructure,
    StructureKind,
    TypeAliasDeclarationStructure
} from 'ts-morph';

import { IInterfaceModel, IInterfacePropertyModel, IInterfaceUnionModel } from '../../models/InterfaceModel';
import { TypeSerializer } from '../utils/TypeSerializer';
import { getInterfaceName } from '../../utils';

export class InterfacesGenerator {
    public getCodeStructure(interfaces: IInterfaceModel[]): (InterfaceDeclarationStructure | TypeAliasDeclarationStructure)[] {
        const baseInterfaces: InterfaceDeclarationStructure[] = [];
        const types: (InterfaceDeclarationStructure | TypeAliasDeclarationStructure)[] = interfaces.map((z) => {
            if (z.combineInterfaces.length) {
                const name = z.name + 'BaseInterface';
                baseInterfaces.push({
                    kind: StructureKind.Interface,
                    name: name,
                    isExported: false,
                    properties: z.properties.map((x) => this.getInterfaceProperty(x))
                });
                return {
                    kind: StructureKind.TypeAlias,
                    type: name + ' & ' + z.combineInterfaces.join(' & '),
                    name: z.name,
                    isExported: true
                };
            } else {
                return {
                    kind: StructureKind.Interface,
                    name: z.name,
                    isExported: true,
                    properties: z.properties.map((x) => this.getInterfaceProperty(x))
                };
            }
        });
        return [...baseInterfaces, ...types];
    }

    public getCodeUnionsStructure(interfaces: IInterfaceUnionModel[]): TypeAliasDeclarationStructure[] {
        const classUnion: TypeAliasDeclarationStructure[] = interfaces.map((z) => {
            return {
                kind: StructureKind.TypeAlias,
                type: z.parentInterface + '|' + z.unionInterfaces.join(' | '),
                name: z.name,
                isExported: true
            };
        });
        const interfacesUnion: TypeAliasDeclarationStructure[] = interfaces.map((z) => {
            return {
                kind: StructureKind.TypeAlias,
                type: getInterfaceName(z.parentInterface) + '|' + z.unionInterfaces.map((x) => getInterfaceName(x)).join(' | '),
                name: getInterfaceName(z.name),
                isExported: true
            };
        });
        return [...classUnion, ...interfacesUnion];
    }

    protected getInterfaceProperty(model: IInterfacePropertyModel): OptionalKind<PropertySignatureStructure> {
        return {
            name: model.name,
            type: this.getInterfacePropertyType(model)
        };
    }

    protected getInterfacePropertyType(model: IInterfacePropertyModel): string {
        return TypeSerializer.fromInterfaceProperty(model).toString();
    }
}
