import { OpenAPIService } from '../../src/swagger/OpenAPI.service';
import { EndpointsService } from '../../src/services/Endpoints.service';

describe('EndpointsService tests', () => {
    describe('getGroupedActionsByController', () => {
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

            const result = service.getGroupedActionsByController();

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

            expect(service.getGroupedActionsByController()).toEqual({});
        });
    });
});
