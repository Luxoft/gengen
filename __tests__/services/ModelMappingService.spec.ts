import { MockOpenAPIService } from '../../__mocks__/MockOpenAPIService';
import { ModelMappingService } from '../../src/services/ModelMappingService';
import { TypesService } from '../../src/services/TypesService';
import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';
import { OpenAPI3SchemaContainer } from '../../src/swagger/v3/schemas/schema';
import { first } from '../../src/utils';

describe('ModelMappingService tests', () => {
    let service: ModelMappingService;

    beforeEach(() => {
        const guard = new OpenAPITypesGuard();
        const openAPIService = new MockOpenAPIService(guard);
        service = new ModelMappingService(openAPIService, guard, new TypesService(guard));
    });

    describe('toModelsContainer', () => {
        describe('toEnumModel', () => {
            test('must be sorted after matching', () => {
                const schemas: OpenAPI3SchemaContainer = {
                    status: {
                        enum: [0, -1, 1],
                        type: 'integer',
                        format: 'int32',
                        'x-enumNames': ['InStock', 'OutOfStock', 'UnderTheOrder']
                    }
                };

                const enumModel = first(service.toModelsContainer(schemas).enums);
                expect(enumModel).toMatchObject({
                    name: 'status',
                    items: [
                        { key: 'InStock', value: 0 },
                        { key: 'OutOfStock', value: -1 },
                        { key: 'UnderTheOrder', value: 1 }
                    ]
                });
            });
        });
    });
});