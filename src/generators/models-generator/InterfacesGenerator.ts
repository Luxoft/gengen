import { InterfaceDeclarationStructure, OptionalKind, PropertySignatureStructure, StructureKind } from 'ts-morph';
import { IInterfaceModel, IInterfacePropertyModel } from '../../models/InterfaceModel';
import { TypeSerializer } from '../utils/TypeSerializer';

export class InterfacesGenerator {
    public getCodeStructure(interfaces: IInterfaceModel[]): InterfaceDeclarationStructure[] {
        return interfaces.map((z) => ({
            kind: StructureKind.Interface,
            name: z.name,
            isExported: true,
            properties: z.properties.map((x) => this.getInterfaceProperty(x))
        }));
    }

    private getInterfaceProperty(model: IInterfacePropertyModel): OptionalKind<PropertySignatureStructure> {
        return {
            name: model.name,
            type: TypeSerializer.fromInterfaceProperty(model).toString()
        };
    }
}
