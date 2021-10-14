import { EndpointNameResolver } from '../../src/services/EndpointNameResolver';
import { OpenAPIService } from '../../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';

describe('EndpointNameResolverService tests', () => {
    let guard: OpenAPITypesGuard;

    function initNameResolverService(spec: Object) {
        const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
        return new EndpointNameResolver(openApiService);
    }

    beforeEach(() => (guard = new OpenAPITypesGuard()));

    describe('isDuplicate', () => {
        test('has duplicate', () => {
            // Arrange
            const spec = {
                openapi: '3.0.1',
                paths: {}
            };
            const service = initNameResolverService(spec);
            const store = {
                Product: [
                    {
                        name: 'Product',
                        origin: '/Product/Product',
                        relativePath: '/Product',
                        action: { name: 'product', origin: '' }
                    }
                ]
            };
            const info = {
                name: 'Product',
                origin: '/Product/Product',
                relativePath: '/Product',
                action: { name: 'product', origin: 'Product' }
            };

            // Act
            const result = service.isDuplicate(info, store);

            // Assert
            expect(result).toEqual(true);
        });

        test('doesnt have duplicate', () => {
            // Arrange
            const spec = {
                openapi: '3.0.1',
                paths: {}
            };
            const service = initNameResolverService(spec);
            const store = {
                Product: [
                    {
                        name: 'Product',
                        origin: '/Product/Download',
                        relativePath: '/Product',
                        action: { name: 'download', origin: '' }
                    }
                ]
            };
            const info = {
                name: 'Product',
                origin: '/Product/Product',
                relativePath: '/Product',
                action: { name: 'product', origin: 'Product' }
            };

            // Act
            const result = service.isDuplicate(info, store);

            // Assert
            expect(result).toEqual(false);
        });
    });

    describe('generateNameUnique', () => {
        test('info', () => {
            // Arrange
            const spec = {
                openapi: '3.0.1',
                paths: { '/api/v1/Product/Product': { put: { tags: ['Product'] } } }
            };
            const service = initNameResolverService(spec);
            const info = {
                name: 'Product',
                origin: '/api/v1/Product/Product',
                relativePath: '/api/v1/Product',
                action: { name: 'product', origin: 'Product' }
            };

            // Act
            const result = service.generateNameUnique(info);

            // Assert
            expect(result).toEqual('putProduct');
        });
    });

    describe('generateNameByPath', () => {
        test('short path', () => {
            // Arrange
            const spec = {
                openapi: '3.0.1',
                paths: {}
            };
            const service = initNameResolverService(spec);

            // Act
            const result = service.generateNameByPath('SearchProducts')

            // Assert
            expect(result).toEqual('searchProducts');
        });

        test('long path', () => {
            // Arrange
            const spec = {
                openapi: '3.0.1',
                paths: {}
            };
            const service = initNameResolverService(spec);

            // Act
            const result = service.generateNameByPath('getByCustomer/{customer}/type/{type}')

            // Assert
            expect(result).toEqual('getByCustomerType');
        });
    });

    describe('generateNameDefault', () => {
        test('name', () => {
            // Arrange
            const spec = {
                openapi: '3.0.1',
                paths: {}
            };
            const service = initNameResolverService(spec);
            const name = 'product';

            // Act
            const result = service.generateNameDefault(name);

            // Assert
            expect(result).toEqual(`${name}Default`);
        });
    });
});
