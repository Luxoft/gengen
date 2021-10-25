import { EndpointNameResolver } from '../../src/services/EndpointNameResolver';
import { IEndpointInfo } from '../../src/services/EndpointsService';
import { OpenAPIService } from '../../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';

describe('EndpointNameResolver tests', () => {
    function getService(spec?: string): EndpointNameResolver {
        const json = spec ?? JSON.stringify({ openapi: '3.0.1', paths: {} });
        return new EndpointNameResolver(new OpenAPIService(json, new OpenAPITypesGuard()));
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

    describe('deduplicate', () => {
        test('store with duplicates', () => {
            // Arrange
            const spec = {
                openapi: '3.0.1',
                paths: { '/api/v1/Product/Product': { get: { tags: ['Product'] }, put: { tags: ['Product'] } } }
            }
            const service = getService(JSON.stringify(spec));
            const infos = [
                toEndpointInfo({ action: { name: 'product', origin: '' }, origin: '/api/v1/Product/Product' }),
                toEndpointInfo({ action: { name: 'product', origin: '' }, origin: '/api/v1/Product/Product' })
            ];

            const expected = [
                toEndpointInfo({ action: { name: 'getProduct', origin: '', }, origin: '/api/v1/Product/Product' }),
                toEndpointInfo({ action: { name: 'product', origin: '' }, origin: '/api/v1/Product/Product' })
            ]

            // Act
            service.deduplicate(infos);

            // Assert
            expect(infos).toMatchObject(expected);
        });
    });

    describe('generateNameByPath', () => {
        test('short path', () => {
            // Arrange
            const service = getService();

            // Act
            const result = service.generateNameByPath('SearchProducts')

            // Assert
            expect(result).toEqual('searchProducts');
        });

        test('long path', () => {
            // Arrange
            const service = getService();

            // Act
            const result = service.generateNameByPath('getByCustomer/{customer}/type/{type}')

            // Assert
            expect(result).toEqual('getByCustomerType');
        });
    });

    describe('generateNameDefault', () => {
        test('name', () => {
            // Arrange
            const service = getService();
            const name = 'product';

            // Act
            const result = service.generateNameDefault(name);

            // Assert
            expect(result).toEqual(`${name}Default`);
        });
    });
});
