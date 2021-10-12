import { EndpointNameResolver } from '../../src/services/EndpointNameResolver';
import { OpenAPIService } from '../../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';

describe('EndpointNameResolverService tests', () => {
    let guard: OpenAPITypesGuard;
    beforeEach(() => (guard = new OpenAPITypesGuard()));

    describe('getActionsGroupedByController', () => {
        test('hasDuplicate', () => {
            const spec = {
                openapi: '3.0.1',
                paths: {}
            };

            const store = {
                Product: [
                    {
                        name: 'Product',
                        origin: '/Product/Download',
                        relativePath: '/Product',
                        action: { name: 'download', origin: '' }
                    },
                    {
                        name: 'Product',
                        origin: '/Product/Product',
                        relativePath: '/Product',
                        action: { name: 'product', origin: '' }
                    },
                    {
                        name: 'Product',
                        origin: '/Product',
                        relativePath: '/Product',
                        action: { name: 'productDefault', origin: '' }
                    }
                ]
            };


            const expected = true;

            const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
            const service = new EndpointNameResolver(openApiService);

            const info = {
                name: 'Product',
                origin: '/Product/Product',
                relativePath: '/Product',
                action: { name: 'product', origin: 'Product' }
            };

            const result = service.hasDuplicate(info, store);

            expect(result).toEqual(expected);
        });

    });


});
