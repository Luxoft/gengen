import { MockOpenAPIService } from '../../../__mocks__/MockOpenAPIService';
import { ParameterPlace } from '../../../src/models/kinds/ParameterPlace';
import { PathMethodParameterModel } from '../../../src/models/method-parameter/PathMethodParameterModel';
import { QueryMethodParameterModel } from '../../../src/models/method-parameter/QueryMethodParameterModel';
import { defaultOptions } from '../../../src/options';
import { TypesService } from '../../../src/services/TypesService';
import { OpenAPIService } from '../../../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../../src/swagger/OpenAPITypesGuard';
import { IOpenAPI3Parameter } from '../../../src/swagger/v3/parameter';

describe('MethodParameterModel tests', () => {
    let typesGuard: OpenAPITypesGuard;
    let typesService: TypesService;
    let openAPIService: OpenAPIService;

    beforeEach(() => {
        typesGuard = new OpenAPITypesGuard();
        typesService = new TypesService(typesGuard, defaultOptions);
        openAPIService = new MockOpenAPIService(typesGuard);
    });

    describe('Create PathMethodParameterModel', () => {
        test('should create correct object for guid parameter', () => {
            const model: IOpenAPI3Parameter = {
                name: 'id',
                in: 'path',
                required: true,
                schema: {
                    format: 'uuid',
                    type: 'string'
                }
            };

            // Act
            const result = new PathMethodParameterModel(model, typesGuard, typesService, openAPIService);

            // Assert
            expect(result.dtoType).toEqual('string');
            expect(result.name).toEqual('id');
            expect(result.place).toEqual(ParameterPlace.Path);
        });
    });

    describe('Create QueryMethodParameterModel', () => {
        test('should create correct object with simple param', () => {
            const model: IOpenAPI3Parameter = {
                name: 'name',
                in: 'query',
                schema: {
                    nullable: true,
                    type: 'string'
                }
            };

            // Act
            const result = new QueryMethodParameterModel(model, typesGuard, typesService, openAPIService);

            // Assert
            expect(result.dtoType).toEqual('string');
            expect(result.name).toEqual('name');
            expect(result.optional).toEqual(false);
            expect(result.place).toEqual(ParameterPlace.Query);
        });
    });
});
