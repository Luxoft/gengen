import { OpenAPIService } from '../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../src/swagger/OpenAPITypesGuard';
import { IOpenAPI3Reference } from '../src/swagger/v3/reference';
import { IOpenAPI3EnumSchema } from '../src/swagger/v3/schemas/enum-schema';
import { IOpenAPI3ObjectSchema } from '../src/swagger/v3/schemas/object-schema';

export class MockOpenAPIService extends OpenAPIService {
    constructor(
        typesGuard: OpenAPITypesGuard, 
        public getRefSchemaResult: IOpenAPI3ObjectSchema | IOpenAPI3EnumSchema | undefined = undefined) {
        super('{ "openapi": "3.0.1" }', typesGuard);
    }

    public getRefSchema(reference: IOpenAPI3Reference): IOpenAPI3ObjectSchema | IOpenAPI3EnumSchema | undefined {
        return this.getRefSchemaResult;
    }
}