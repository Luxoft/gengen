import { InterfaceDeclarationStructure, TypeAliasDeclarationStructure } from 'ts-morph';

import { IExtendedInterfaceModel, InterfaceModel } from '../../models/InterfaceModel';
import { IUnionModel } from '../../models/UnionModel';
import { PropertiesGenerator } from './PropertiesGenerator';

type InterfacesStructures = InterfaceDeclarationStructure | TypeAliasDeclarationStructure;

export class InterfacesGenerator {
    private propertiesGenerator = new PropertiesGenerator();

    public getCodeStructure(interfaces: InterfaceModel[], unions: IUnionModel[]): InterfacesStructures[] {
        const unionStructures = unions.flatMap((curr) => this.propertiesGenerator.getUnionTypeAliases(curr));
        const interfaceStructures = interfaces.flatMap((curr) =>
            this.isIExtendedInterfaceModel(curr) ? this.generateExtendedInterface(curr) : this.propertiesGenerator.getInterface(curr)
        );

        return [...unionStructures, ...interfaceStructures];
    }

    private generateExtendedInterface(curr: IExtendedInterfaceModel): InterfacesStructures[] {
        const baseInterfaceName = `${curr.name}BaseInterface`;

        return [
            this.propertiesGenerator.getExtendedInterface(baseInterfaceName, curr),
            this.propertiesGenerator.getExtendedInterfaceTypeAlias(baseInterfaceName, curr)
        ];
    }

    private isIExtendedInterfaceModel(objects: InterfaceModel): objects is IExtendedInterfaceModel {
        return Boolean((objects as IExtendedInterfaceModel)?.extendingInterfaces);
    }
}
