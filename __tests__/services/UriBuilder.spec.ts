import { MethodKind } from '../../src/models/kinds/MethodKind';
import { MethodOperation } from '../../src/models/kinds/MethodOperation';
import { ParameterPlace } from '../../src/models/kinds/ParameterPlace';
import { PropertyKind } from '../../src/models/kinds/PropertyKind';
import { IMethodModel } from '../../src/models/method-parameter/IMethodModel';
import { UriBuilder } from '../../src/services/UriBuilder';

describe('UriBuilder tests', () => {
    let uriBuilder: UriBuilder;
    beforeEach(() => (uriBuilder = new UriBuilder()));

    describe('buildUri', () => {
        describe('return correct name', () => {
            test('method with one path param', () => {
                // Arrange
                const model: IMethodModel = {
                    kind: MethodKind.Default,
                    name: 'get',
                    operation: MethodOperation.GET,
                    parameters: [
                        {
                            dtoType: 'string',
                            name: 'id',
                            place: ParameterPlace.Path
                        }
                    ],
                    returnType: {
                        isCollection: false,
                        isModel: true,
                        type: {
                            dtoType: 'IProduct',
                            kind: PropertyKind.Object,
                            type: 'Product'
                        }
                    },
                    originUri: 'get/{id}'
                };

                const expected = '`get/${encodeURIComponent(id)}`';

                // Act
                const result = uriBuilder.buildUri(model);

                // Assert
                expect(result).toEqual(expected);
            });

            test('method with one query param', () => {
                // Arrange
                const model: IMethodModel = {
                    kind: MethodKind.Default,
                    name: 'get',
                    operation: MethodOperation.GET,
                    parameters: [
                        {
                            dtoType: 'string',
                            name: 'name',
                            optional: false,
                            place: ParameterPlace.Query
                        }
                    ],
                    returnType: {
                        isCollection: false,
                        isModel: true,
                        type: {
                            dtoType: 'IProduct',
                            kind: PropertyKind.Object,
                            type: 'Product'
                        }
                    },
                    originUri: 'get'
                };

                const expected = '`get?name=${encodeURIComponent(name)}`';

                // Act
                const result = uriBuilder.buildUri(model);

                // Assert
                expect(result).toEqual(expected);
            });

            test('method with one path and one query params', () => {
                // Arrange
                const model: IMethodModel = {
                    kind: MethodKind.Default,
                    name: 'get',
                    operation: MethodOperation.GET,
                    parameters: [
                        {
                            dtoType: 'string',
                            name: 'id',
                            place: ParameterPlace.Path
                        },
                        {
                            dtoType: 'string',
                            name: 'name',
                            optional: false,
                            place: ParameterPlace.Query
                        }
                    ],
                    returnType: {
                        isCollection: false,
                        isModel: true,
                        type: {
                            dtoType: 'IProduct',
                            kind: PropertyKind.Object,
                            type: 'Product'
                        }
                    },
                    originUri: 'get/{id}'
                };

                const expected = '`get/${encodeURIComponent(id)}?name=${encodeURIComponent(name)}`';

                // Act
                const result = uriBuilder.buildUri(model);

                // Assert
                expect(result).toEqual(expected);
            });

            test('method with two path and one query params', () => {
                // Arrange
                const model: IMethodModel = {
                    kind: MethodKind.Default,
                    name: 'type',
                    operation: MethodOperation.GET,
                    parameters: [
                        {
                            dtoType: 'string',
                            name: 'customer',
                            place: ParameterPlace.Path
                        },
                        {
                            dtoType: 'string',
                            name: 'type',
                            place: ParameterPlace.Path
                        },
                        {
                            dtoType: 'string',
                            name: 'date',
                            optional: false,
                            place: ParameterPlace.Query
                        }
                    ],
                    returnType: {
                        isCollection: false,
                        isModel: true,
                        type: {
                            dtoType: 'IProduct',
                            kind: PropertyKind.Object,
                            type: 'Product'
                        }
                    },
                    originUri: 'getByCustomer/{customer}/type/{type}'
                };

                const expected =
                    '`getByCustomer/${encodeURIComponent(customer)}/type/${encodeURIComponent(type)}?date=${encodeURIComponent(date)}`';

                // Act
                const result = uriBuilder.buildUri(model);

                // Assert
                expect(result).toEqual(expected);
            });
        });
    });
});
