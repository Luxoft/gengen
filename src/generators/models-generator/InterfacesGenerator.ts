import {
    InterfaceDeclarationStructure,
    OptionalKind,
    PropertySignatureStructure,
    StructureKind,
    TypeAliasDeclarationStructure
} from 'ts-morph';

import { IExtendedInterfaceModel, IInterfaceModel, IInterfacePropertyModel, InterfaceModel } from '../../models/InterfaceModel';
import { IUnionModel } from '../../models/UnionModel';
import { getInterfaceName, getUnionName } from '../../utils';
import { TypeSerializer } from '../utils/TypeSerializer';

type InterfacesSructures = InterfaceDeclarationStructure | TypeAliasDeclarationStructure;

export class InterfacesGenerator {
    public getCodeStructure(interfaces: InterfaceModel[], unions: IUnionModel[]): InterfacesSructures[] {
        return [
            ...unions.reduce((acc, curr) => {
                this.generateUnionInterface(acc, curr);
                return acc;
            }, [] as InterfacesSructures[]),
            ...interfaces.reduce((acc, curr) => {
                if (this.isIExtendedInterfaceModel(curr)) {
                    this.generateExtendednterface(acc, curr);
                } else {
                    this.generateCommonInterface(acc, curr);
                }
                return acc;
            }, [] as InterfacesSructures[])
        ];
    }

    private generateExtendednterface(acc: InterfacesSructures[], curr: IExtendedInterfaceModel): void {
        const name = curr.name + 'BaseInterface';
        acc.push({
            kind: StructureKind.Interface,
            name: name,
            isExported: false,
            properties: curr.properties.map((x) => this.getInterfaceProperty(x))
        });
        acc.push({
            kind: StructureKind.TypeAlias,
            type: name + ' & ' + curr.extendingInterfaces.join(' & '),
            name: curr.name,
            isExported: true
        });
    }

    private generateUnionInterface(acc: InterfacesSructures[], curr: IUnionModel): void {
        acc.push({
            kind: StructureKind.TypeAlias,
            type: curr.name + '|' + curr.unionInterfaces.join(' | '),
            name: getUnionName(curr.name),
            isExported: true
        });

        acc.push({
            kind: StructureKind.TypeAlias,
            type: getInterfaceName(curr.name) + '|' + curr.unionInterfaces.map((x) => getInterfaceName(x)).join(' | '),
            name: getInterfaceName(getUnionName(curr.name)),
            isExported: true
        });
    }

    private generateCommonInterface(acc: InterfacesSructures[], curr: IInterfaceModel): void {
        acc.push({
            kind: StructureKind.Interface,
            name: curr.name,
            isExported: true,
            properties: curr.properties.map((x) => this.getInterfaceProperty(x))
        });
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

    private isIExtendedInterfaceModel(objects: InterfaceModel): objects is IExtendedInterfaceModel {
        return Boolean((objects as IExtendedInterfaceModel)?.extendingInterfaces);
    }
}
