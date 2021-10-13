import { EndpointNameResolver } from '../../src/services/EndpointNameResolver';
import { EndpointsService } from '../../src/services/EndpointsService';
import { OpenAPIService } from '../../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';

describe('EndpointsService tests', () => {
    let guard: OpenAPITypesGuard;
    beforeEach(() => (guard = new OpenAPITypesGuard()));

    describe('getActionsGroupedByController', () => {
        test('group actions', () => {
            const spec = {
                openapi: '3.0.1',
                paths: {
                    '/Product/SearchProducts': {
                        get: { tags: ['Product'] }
                    },
                    '/api/v1/Category/AddCategory': {
                        get: { tags: ['Category'] }
                    },
                    '/Product/GetProducts': {
                        get: { tags: ['Product'] }
                    }
                }
            };

            const expected = {
                Category: ['AddCategory'],
                Product: ['GetProducts', 'SearchProducts']
            };

            const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
            const endpointNameResolver = new EndpointNameResolver(openApiService);
            const service = new EndpointsService(openApiService, endpointNameResolver);

            const result = service.getActionsGroupedByController();

            expect(Object.keys(result)).toEqual(['Category', 'Product']);
            expect(result).toEqual(expected);
        });

        test('tags does not exists', () => {
            const spec = {
                openapi: '3.0.1',
                paths: {
                    '/Product/SearchProducts': {},
                    '/api/v1/Category/AddCategory': {},
                    '/Product/GetProducts': {}
                }
            };

            const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
            const endpointNameResolver = new EndpointNameResolver(openApiService);
            const service = new EndpointsService(openApiService, endpointNameResolver);
            expect(service.getActionsGroupedByController()).toEqual({});
        });
    });

    describe('getEndpoints', () => {
        test('sort actions', () => {
            const spec = {
                openapi: '3.0.1',
                paths: {
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
            };

            const expected = new Set(['Category/AddCategory', 'Product/GetProducts', 'Product/Product/{id}', 'Product/SearchProducts']);

            const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
            const endpointNameResolver = new EndpointNameResolver(openApiService);
            const service = new EndpointsService(openApiService, endpointNameResolver);

            expect(service.getEndpoints()).toEqual(expected);
        });
    });

    describe('parse', () => {
        test('short endpoint', () => {
            const spec = {
                openapi: '3.0.1',
                paths: { '/Product/SearchProducts': { get: { tags: ['Product'] } } }
            };

            const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
            const endpointNameResolver = new EndpointNameResolver(openApiService);
            const service = new EndpointsService(openApiService,endpointNameResolver);

            expect(service.parse('/Product/SearchProducts')).toMatchObject({
                name: 'Product',
                action: { origin: 'SearchProducts', name: 'SearchProducts' },
                relativePath: '/Product'
            });
        });

        test('version endpoint', () => {
            const spec = {
                openapi: '3.0.1',
                paths: { '/api/v1/Product/SearchProducts': { get: { tags: ['Product'] } } }
            };

            const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
            const endpointNameResolver = new EndpointNameResolver(openApiService);
            const service = new EndpointsService(openApiService,endpointNameResolver);

            expect(service.parse('/api/v1/Product/SearchProducts')).toMatchObject({
                name: 'Product',
                action: { origin: 'SearchProducts', name: 'SearchProducts' },
                relativePath: '/api/v1/Product'
            });
        });

        test('long endpoint', () => {
            const spec = {
                openapi: '3.0.1',
                paths: { '/api/v1/Product/Download/{id}': { get: { tags: ['Product'] } } }
            };

            const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
            const endpointNameResolver = new EndpointNameResolver(openApiService);
            const service = new EndpointsService(openApiService,endpointNameResolver);

            expect(service.parse('/api/v1/Product/Download/{id}')).toMatchObject({
                name: 'Product',
                action: { origin: 'Download/{id}', name: 'Download' },
                relativePath: '/api/v1/Product'
            });
        });

        test('empty action', () => {
            const spec = {
                openapi: '3.0.1',
                paths: { '/api/v1/Product/{test}': { get: { tags: ['Product'] } } }
            };

            const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
            const endpointNameResolver = new EndpointNameResolver(openApiService);
            const service = new EndpointsService(openApiService,endpointNameResolver);

            expect(service.parse('/api/v1/Product/{test}')).toMatchObject({
                name: 'Product',
                action: { origin: '{test}', name: undefined },
                relativePath: '/api/v1/Product'
            });
        });
    });
});
