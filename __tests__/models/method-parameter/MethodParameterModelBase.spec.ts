import { MockOpenAPIService } from '../../../__mocks__/MockOpenAPIService';
import { ParameterPlace } from '../../../src/models/kinds/ParameterPlace';
import { MethodParameterModelBase } from '../../../src/models/method-parameter/MethodParameterModelBase';
import { defaultOptions } from '../../../src/options';
import { TypesService } from '../../../src/services/TypesService';
import { OpenAPIService } from '../../../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../../src/swagger/OpenAPITypesGuard';
import { IOpenAPI3Parameter } from '../../../src/swagger/v3/parameter';
import { IOpenAPI3EnumSchema } from '../../../src/swagger/v3/schemas/enum-schema';

describe('MethodParameterModelBase tests', () => {
    let typesGuard: OpenAPITypesGuard;
    let typesService: TypesService;
    let openAPIService: OpenAPIService;

    class MethodParameterModelTest extends MethodParameterModelBase {
        public place: ParameterPlace = ParameterPlace.Path;
    }

    beforeEach(() => {
        typesGuard = new OpenAPITypesGuard();
        typesService = new TypesService(typesGuard, defaultOptions);
        openAPIService = new MockOpenAPIService(typesGuard);
    });

    describe('Create', () => {
        test('should create correct object for ref enum parameter', () => {
            const model: IOpenAPI3Parameter = {
                name: 'enumParam',
                in: 'path',
                required: true,
                schema: {
                    $ref: '#/components/schemas/MyEnum'
                }
            };

            // Act
            const mockOpenAPIService = new MockOpenAPIService(typesGuard, {
                enum: [0, 1, 2],
                'x-enumNames': ['Zero', 'One', 'Two'],
                format: 'int32',
                type: 'integer'
            } as IOpenAPI3EnumSchema);
            const result = new MethodParameterModelTest(typesService, model, typesGuard, mockOpenAPIService);

            // Assert
            expect(result.name).toEqual('enumParam');
            expect(result.place).toEqual(ParameterPlace.Path);
            expect(result.isModel).toEqual(true);
            expect(result.dtoType).toEqual('MyEnum');
        });

        test('should throw reference type not supported in path', () => {
            const model: IOpenAPI3Parameter = {
                name: 'product',
                in: 'path',
                required: true,
                schema: {
                    $ref: '#/components/schemas/Product'
                }
            };

            const expected = `Path parameter 'product' is reference type. It's not allow`;

            // Act
            // Assert
            expect(() => new MethodParameterModelTest(typesService, model, typesGuard, openAPIService)).toThrow(expected);
        });

        test('should throw reference type not supported in query', () => {
            const model: IOpenAPI3Parameter = {
                name: 'name',
                in: 'query',
                schema: {
                    $ref: '#/components/schemas/Category'
                }
            };

            const expected = `Query parameter 'name' is reference type. It's not allow`;

            // Act
            // Assert
            expect(() => new MethodParameterModelTest(typesService, model, typesGuard, openAPIService)).toThrow(expected);
        });
    });
});
