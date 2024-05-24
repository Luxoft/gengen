import {
    InterfaceDeclarationStructure,
    OptionalKind,
    PropertyDeclarationStructure,
    PropertySignatureStructure,
    Scope,
    StructureKind,
    TypeAliasDeclarationStructure
} from 'ts-morph';

import { IExtendedInterfaceModel, IInterfaceModel, IInterfacePropertyModel } from '../../models/InterfaceModel';
import { IObjectPropertyModel } from '../../models/ObjectModel';
import { IUnionModel } from '../../models/UnionModel';
import { NameService } from '../../services/NameService';
import { lowerFirst } from '../../utils';
import { TypeSerializer } from '../utils/TypeSerializer';

export class PropertiesGenerator {
    constructor(private readonly nameService: NameService) {}
    public getGuardProperty(name: string): PropertyDeclarationStructure {
        return {
            kind: StructureKind.Property,
            scope: Scope.Private,
            name: `__${lowerFirst(name)}`,
            type: 'string',
            hasExclamationToken: true
        };
    }

    public getObjectProperty(property: IObjectPropertyModel): OptionalKind<PropertyDeclarationStructure> {
        return { scope: Scope.Public, name: property.name, type: property.type };
    }

    public getUnionTypeAliases(unionModel: IUnionModel): TypeAliasDeclarationStructure[] {
        const unionName = this.nameService.getUnionName(unionModel.name);
        const interfaceName = this.nameService.getInterfaceName(unionModel.name);

        return [
            {
                kind: StructureKind.TypeAlias,
                type: `${unionModel.name} | ${unionModel.unionInterfaces.join(' | ')}`,
                name: unionName,
                isExported: true
            },
            {
                kind: StructureKind.TypeAlias,
                type: `${interfaceName} | ${unionModel.unionInterfaces.map((x) => this.nameService.getInterfaceName(x)).join(' | ')}`,
                name: this.nameService.getInterfaceName(unionName),
                isExported: true
            }
        ];
    }

    public getExtendedInterfaceTypeAlias(
        baseInterfaceName: string,
        extendedInterfaceModel: IExtendedInterfaceModel
    ): TypeAliasDeclarationStructure {
        return {
            kind: StructureKind.TypeAlias,
            type: `${baseInterfaceName} & ${extendedInterfaceModel.extendingInterfaces.join(' & ')}`,
            name: extendedInterfaceModel.name,
            isExported: true
        };
    }

    public getExtendedInterface(baseInterfaceName: string, extendedInterfaceModel: IExtendedInterfaceModel): InterfaceDeclarationStructure {
        return {
            kind: StructureKind.Interface,
            name: baseInterfaceName,
            isExported: false,
            properties: extendedInterfaceModel.properties.map((property) => this.createInterfaceProperty(property))
        };
    }

    public getInterface(interfaceModel: IInterfaceModel): InterfaceDeclarationStructure[] {
        return [
            {
                kind: StructureKind.Interface,
                name: interfaceModel.name,
                isExported: true,
                properties: interfaceModel.properties.map((property) => this.createInterfaceProperty(property))
            }
        ];
    }

    private createInterfaceProperty(propertyModel: IInterfacePropertyModel): OptionalKind<PropertySignatureStructure> {
        return {
            name: propertyModel.name,
            type: this.getInterfacePropertyType(propertyModel)
        };
    }

    private getInterfacePropertyType(propertyModel: IInterfacePropertyModel): string {
        return TypeSerializer.fromInterfaceProperty(propertyModel).toString();
    }
}
