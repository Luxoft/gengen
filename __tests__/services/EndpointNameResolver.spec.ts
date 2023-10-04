import { EndpointNameResolver } from '../../src/services/EndpointNameResolver';
import { IEndpointInfo } from '../../src/services/EndpointsService';

describe('EndpointNameResolver tests', () => {
    function toEndpointInfo(info: Partial<IEndpointInfo>): IEndpointInfo {
        return {
            name: '',
            origin: '',
            relativePath: '',
            actions: [{ name: '', origin: '' }],
            ...info
        };
    }

    let service: EndpointNameResolver;
    beforeEach(() => (service = new EndpointNameResolver()));

    describe('checkDuplicates', () => {
        test('store with duplicates', () => {
            // Arrange
            const origin = '/api/v1/Product/Product';
            const infos = [
                toEndpointInfo({ actions: [{ name: 'product', origin: '' }], origin }),
                toEndpointInfo({ actions: [{ name: 'product', origin: '' }], origin })
            ];

            // Assert
            expect(() => {
                service.checkDuplicates(infos);
            }).toThrowError(new Error(`Duplicate by path: '${origin}' was detected. Please, rename your endpoints`));
        });
    });

    describe('generateName', () => {
        test('empty', () => {
            // Arrange
            const group = 'Product';
            const verb = 'get';
            const endpoint = '';

            // Act
            const result = service.generateName(group, endpoint, verb, 1);

            // Assert
            expect(result).toEqual('getProduct');
        });

        test('only one query parameter', () => {
            // Arrange
            const group = 'Product';
            const verb = 'get';
            const endpoint = '{id}';

            // Act
            const result = service.generateName(group, endpoint, verb, 1);

            // Assert
            expect(result).toEqual('getProductById');
        });

        test('long path', () => {
            // Arrange
            const group = 'Product';
            const verb = 'get';
            const endpoint = 'customer/{customer}/type/{type}';

            // Act
            const result = service.generateName(group, endpoint, verb, 1);

            // Assert
            expect(result).toEqual('customerType');
        });

        test('multiple verbs', () => {
            // Arrange
            const group = 'Product';
            const verb = 'get';
            const endpoint = 'customer/{customer}/type/{type}';

            // Act
            const result = service.generateName(group, endpoint, verb, 2);

            // Assert
            expect(result).toEqual('getCustomerType');
        });
    });
});
