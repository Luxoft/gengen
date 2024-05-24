import { ImportDeclarationStructure, StatementStructures, StructureKind } from 'ts-morph';

import { IEnumModel } from '../models/EnumModel';
import { IModelsContainer } from '../models/ModelsContainer';
import { IOptions } from '../options';
import { PathBuilder } from '../services/PathBuilder';
import { IdentitiesGenerator } from './models-generator/IdentitiesGenerator';
import { InterfacesGenerator } from './models-generator/InterfacesGenerator';
import { ObjectGenerator } from './models-generator/ObjectGenerator';
import { UnionGenerator } from './models-generator/UnionsGenerator';
import { TYPES_NAMESPACE } from './utils/consts';

export const TO_DTO_METHOD = 'toDTO';
export const FROM_DTO_METHOD = 'fromDTO';

export class ModelsGenerator {
    private pathBuilder = new PathBuilder();

    constructor(
        private settings: IOptions,
        private readonly interfaceGenerator: InterfacesGenerator,
        private readonly unionGenerator: UnionGenerator,
        private readonly identitiesGenerator: IdentitiesGenerator,
        private readonly objectGenerator: ObjectGenerator
    ) {}

    public getModelsCodeStructure(models: IModelsContainer): StatementStructures[] {
        return [
            ...this.getImports(),
            ...this.getEnums(models.enums),
            ...this.interfaceGenerator.getCodeStructure(models.interfaces, models.unions),
            ...this.unionGenerator.getUnionObjects(models.unions),
            ...this.identitiesGenerator.getIdentities(models.identities, models.interfaces),
            ...this.objectGenerator.getObjects(models.objects)
        ];
    }

    private getImports(): ImportDeclarationStructure[] {
        const path = this.pathBuilder.normalizePath(`./${this.settings.utilsRelativePath}`);
        const imports: ImportDeclarationStructure[] = [
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/Guid`,
                namedImports: [{ name: 'Guid' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/date-converters`,
                namedImports: [{ name: 'toDateIn' }, { name: 'toDateOut' }]
            },
            {
                kind: StructureKind.ImportDeclaration,
                moduleSpecifier: `${path}/types`,
                namespaceImport: TYPES_NAMESPACE,
                isTypeOnly: true
            }
        ];

        return this.settings.unstrictId ? imports.filter((x) => !x.moduleSpecifier.includes('Guid')) : imports;
    }

    private getEnums(enums: IEnumModel[]): StatementStructures[] {
        return enums.map((z) => ({
            kind: StructureKind.Enum,
            isExported: true,
            name: z.name,
            members: z.items.map((x) => ({ name: x.key, value: x.value }))
        }));
    }
}
