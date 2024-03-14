import {
    InterfaceDeclarationStructure,
    OptionalKind,
    PropertySignatureStructure,
    StructureKind,
    TypeAliasDeclarationStructure
} from 'ts-morph';

import { IInterfaceModel, IInterfacePropertyModel } from '../../models/InterfaceModel';
import { TypeSerializer } from '../utils/TypeSerializer';

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
