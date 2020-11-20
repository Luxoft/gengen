import { EndpointsService } from '../../src/services/EndpointsService';
import { OpenAPIService } from '../../src/swagger/OpenAPIService';

describe('EndpointsService tests', () => {
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

            const openApiService = new OpenAPIService(JSON.stringify(spec));
            const service = new EndpointsService(openApiService);

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

            const openApiService = new OpenAPIService(JSON.stringify(spec));
            const service = new EndpointsService(openApiService);

            expect(service.getActionsGroupedByController()).toEqual({});
        });
    });

    describe('getActions', () => {
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
                    }
                }
            };

            const openApiService = new OpenAPIService(JSON.stringify(spec));
            const service = new EndpointsService(openApiService);

            const result = service.getActions();
            expect(result).toEqual(new Set(['Category/AddCategory', 'Product/GetProducts', 'Product/SearchProducts']));
        });
    });
});
