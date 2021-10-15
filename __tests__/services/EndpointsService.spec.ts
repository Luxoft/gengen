import { EndpointNameResolver } from '../../src/services/EndpointNameResolver';
import { EndpointsService } from '../../src/services/EndpointsService';
import { OpenAPIService } from '../../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';

describe('EndpointsService tests', () => {
    let guard: OpenAPITypesGuard;

    function initEndpointService(paths: Object = {}): EndpointsService {
        const spec = {
            openapi: '3.0.1',
            paths
        };
        const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
        const endpointNameResolver = new EndpointNameResolver(openApiService);
        return new EndpointsService(openApiService, endpointNameResolver);
    }

    beforeEach(() => (guard = new OpenAPITypesGuard()));

    describe('getActionsGroupedByController', () => {
        test('group actions', () => {
            // Arrange
            const paths = {
                '/Product/SearchProducts': {
                    get: { tags: ['Product'] }
                },
                '/api/v1/Category/AddCategory': {
                    get: { tags: ['Category'] }
                },
                '/Product/GetProducts': {
                    get: { tags: ['Product'] }
                }
            };

            const expected = {
                Category: { addCategory: "/api/v1/Category/AddCategory" },
                Product: {
                    getProducts: "/Product/GetProducts",
                    searchProducts: "/Product/SearchProducts",
                }
            };

            const service = initEndpointService(paths);

            // Act
            const result = service.getActionsGroupedByController();

            // Assert
            expect(Object.keys(result)).toEqual(['Category', 'Product']);
            expect(result).toEqual(expected);
        });

        test('tags does not exists', () => {
            // Arrange
            const paths = {
                '/Product/SearchProducts': {},
                '/api/v1/Category/AddCategory': {},
                '/Product/GetProducts': {}
            }

            // Act
            const service = initEndpointService(paths);

            // Assert
            expect(service.getActionsGroupedByController()).toEqual({});
        });
    });

    describe('getEndpoints', () => {
        test('sort actions', () => {
            // Arrange
            const paths = {
                '/Product/SearchProducts': {
                    get: { tags: ['Product'] }
                },
                '/api/v1/Category/AddCategory': {
                    get: { tags: ['Category'] }
                },
                '/Product/GetProducts': {
                    get: { tags: ['Product'] }
                },
                '/api/v1/Product/Product/{id}': {
                    get: { tags: ['Product'] }
                }
            }

            // Act
            const expected = new Set(['/Product/GetProducts', '/Product/SearchProducts', '/api/v1/Category/AddCategory', '/api/v1/Product/Product/{id}']);
            const service = initEndpointService(paths);

            // Assert
            expect(service.getEndpoints()).toEqual(expected);
        });
    });

    describe('parse', () => {
        test('short endpoint', () => {
            // Arrange
            const paths = { '/Product/SearchProducts': { get: { tags: ['Product'] } } }

            // Act
            const service = initEndpointService(paths);

            // Assert
            expect(service.parse('/Product/SearchProducts')).toMatchObject({
                name: 'Product',
                action: { origin: 'SearchProducts', name: 'searchProducts' },
                relativePath: '/Product'
            });
        });

        test('version endpoint', () => {
            // Arrange
            const paths = { '/api/v1/Product/SearchProducts': { get: { tags: ['Product'] } } }

            // Act
            const service = initEndpointService(paths);

            // Assert
            expect(service.parse('/api/v1/Product/SearchProducts')).toMatchObject({
                name: 'Product',
                action: { origin: 'SearchProducts', name: 'searchProducts' },
                relativePath: '/api/v1/Product'
            });
        });

        test('long endpoint', () => {
            // Arrange
            const paths = { '/api/v1/Product/Download/{id}': { get: { tags: ['Product'] } } }

            // Act
            const service = initEndpointService(paths);

            // Assert
            expect(service.parse('/api/v1/Product/Download/{id}')).toMatchObject({
                name: 'Product',
                action: { origin: 'Download/{id}', name: 'download' },
                relativePath: '/api/v1/Product'
            });
        });
    });

    describe('addToStore', () => {
        test('spec with duplicates of endpoints', () => {
            // Arrange
            const paths = {
                '/api/v1/Product/Product': {
                    get: { tags: ['Product'] },
                    post: { tags: ['Product'] }
                }
            };
            const service = initEndpointService(paths);
            const info1 = {
                name: 'Product',
                origin: '/api/v1/Product/Product',
                relativePath: '/api/v1/Product',
                action: { name: 'product', origin: 'Product' }
            };
            const info2 = {
                name: 'Product',
                origin: '/api/v1/Product/Product',
                relativePath: '/api/v1/Product',
                action: { name: 'getProduct', origin: 'Product' }
            };
            const expectedStore = {
                Product: [info1, info2]
            };
            const resultstore = {};
            service.addToStore(info1, resultstore);

            // Act
            service.addToStore(info2, resultstore);

            // Assert
            expect(resultstore).toMatchObject(expectedStore);
        });
    });
});
