import { EndpointNameResolver } from '../../src/services/EndpointNameResolver';
import { IEndpointInfo } from '../../src/services/EndpointsService';
import { OpenAPIService } from '../../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';

describe('EndpointNameResolver tests', () => {
    let guard: OpenAPITypesGuard;

    function initNameResolverService(paths: Object = {}): EndpointNameResolver {
        const spec = {
            openapi: '3.0.1',
            paths
        };
        const openApiService = new OpenAPIService(JSON.stringify(spec), guard);
        return new EndpointNameResolver(openApiService);
    }

    function toEndpointInfo(info: Partial<IEndpointInfo>): IEndpointInfo {
        return {
            name: '',
            origin: '',
            relativePath: '',
            action: { name: '', origin: '' },
            ...info
        };
    }

    beforeEach(() => (guard = new OpenAPITypesGuard()));

    describe('isDuplicate', () => {
        test('has duplicate', () => {
            // Arrange
            const service = initNameResolverService();
            const store = {
                Product: [
                    toEndpointInfo({ action: { name: 'product', origin: '' } })
                ]
            };
            const info = toEndpointInfo({
                name: 'Product',
                action: { name: 'product', origin: 'Product' }
            });

            // Act
            const result = service.isDuplicate(info, store);

            // Assert
            expect(result).toEqual(true);
        });

        test('doesnt have duplicate', () => {
            // Arrange
            const service = initNameResolverService();
            const store = {
                Product: [
                    toEndpointInfo({ action: { name: 'download', origin: '' } })
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
            const paths = { '/api/v1/Product/Product': { put: { tags: ['Product'] } } };
            const service = initNameResolverService(paths);
            const info = toEndpointInfo({
                origin: '/api/v1/Product/Product',
                action: { name: 'product', origin: 'Product' }
            });

            // Act
            const result = service.generateNameUnique(info);

            // Assert
            expect(result).toEqual('putProduct');
        });
    });

    describe('generateNameByPath', () => {
        test('short path', () => {
            // Arrange
            const service = initNameResolverService();

            // Act
            const result = service.generateNameByPath('SearchProducts')

            // Assert
            expect(result).toEqual('searchProducts');
        });

        test('long path', () => {
            // Arrange
            const service = initNameResolverService();

            // Act
            const result = service.generateNameByPath('getByCustomer/{customer}/type/{type}')

            // Assert
            expect(result).toEqual('getByCustomerType');
        });
    });

    describe('generateNameDefault', () => {
        test('name', () => {
            // Arrange
            const service = initNameResolverService();
            const name = 'product';

            // Act
            const result = service.generateNameDefault(name);

            // Assert
            expect(result).toEqual(`${name}Default`);
        });
    });
});
