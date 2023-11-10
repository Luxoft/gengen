import { PropertyKind } from '../models/kinds/PropertyKind';
import { IModelsContainer } from '../models/ModelsContainer';
import { OpenAPIService } from '../swagger/OpenAPIService';
import { IOpenAPI3Reference } from '../swagger/v3/reference';
import { IModel } from './ServiceMappingService';

export class ModelFinder {
    public constructor(
        private readonly openAPIService: OpenAPIService,
        private readonly models: IModelsContainer
    ) {}

    public find(ref: IOpenAPI3Reference): IModel | undefined {
        const name = this.openAPIService.getSchemaKey(ref);

        const objectModel = this.models.objects.find((x) => x.name === name);
        if (objectModel) {
            return { kind: PropertyKind.Object, name, dtoType: objectModel.dtoType, isNullable: objectModel.isNullable };
        }

        const identityModel = this.models.identities.find((x) => x.name === name);
        if (identityModel) {
            return { kind: PropertyKind.Identity, name, dtoType: identityModel.dtoType, isNullable: identityModel.isNullable };
        }

        const enumModel = this.models.enums.find((x) => x.name === name);
        if (enumModel) {
            return { kind: PropertyKind.Enum, name, dtoType: name, isNullable: enumModel.isNullable };
        }

        return undefined;
    }
}
