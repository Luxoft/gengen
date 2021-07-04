import { ParameterPlace } from '../../../src/models/kinds/ParameterPlace';
import { IPathParameter } from '../../../src/models/method-parameter/IPathParameter';
import { IQueryParameter } from '../../../src/models/method-parameter/IQueryParameter';
import { PathMethodParameterModel } from '../../../src/models/method-parameter/PathMethodParameterModel';
import { QueryMethodParameterModel } from '../../../src/models/method-parameter/QueryMethodParameterModel';
import { TypesService } from '../../../src/services/TypesService';
import { OpenAPITypesGuard } from '../../../src/swagger/OpenAPITypesGuard';
import { IOpenAPI3Parameter } from '../../../src/swagger/v3/parameter';

describe('MethodParameterModel tests', () => {
    let typesGuard: OpenAPITypesGuard;
    let typesService: TypesService;
    beforeEach(() => {
        typesGuard = new OpenAPITypesGuard();
        typesService = new TypesService(typesGuard);
    });

    describe('Create PathMethodParameterModel', () => {
        describe('for guid parameter', () => {
            test('should create correct object', () => {
                const model: IOpenAPI3Parameter = {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        format: 'uuid',
                        type: 'string'
                    }
                };

                const expected: IPathParameter = {
                    dtoType: 'string',
                    name: 'id',
                    place: ParameterPlace.Path
                };

                // Act
                const result = new PathMethodParameterModel(model, typesGuard, typesService);

                // Assert
                expect(result).toEqual(expected);
            });
        });
        test('should throw reference type not supported', () => {
            const model: IOpenAPI3Parameter = {
                name: 'id',
                in: 'path',
                required: true,
                schema: {
                    $ref: '#/components/schemas/Product'
                }
            };

            const expected = `Path parameter 'id' is reference type. It's not allow`;

            // Act
            // Assert
            expect(() => new PathMethodParameterModel(model, typesGuard, typesService)).toThrow(expected);
        });
    });

    describe('Create QueryMethodParameterModel', () => {
        describe('with simple param', () => {
            test('should create correct object', () => {
                const model: IOpenAPI3Parameter = {
                    name: 'name',
                    in: 'query',
                    schema: {
                        nullable: true,
                        type: 'string'
                    }
                };

                const expected: IQueryParameter = {
                    dtoType: 'string',
                    name: 'name',
                    optional: false,
                    place: ParameterPlace.Query
                };

                // Act
                const result = new QueryMethodParameterModel(model, typesGuard, typesService);

                // Assert
                expect(result).toEqual(expected);
            });
        });
        test('should throw reference type not supported', () => {
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
            expect(() => new QueryMethodParameterModel(model, typesGuard, typesService)).toThrow(expected);
        });
    });
});
