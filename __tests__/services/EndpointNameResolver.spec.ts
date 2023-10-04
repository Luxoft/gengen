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

    describe('checkDuplicates', () => {
        test('store with duplicates', () => {
            // Arrange
            const service = new EndpointNameResolver();
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

    describe('generateNameByPath', () => {
        test('short path', () => {
            // Arrange
            const service = new EndpointNameResolver();

            // Act
            const result = service.generateNameByPath('SearchProducts');

            // Assert
            expect(result).toEqual('searchProducts');
        });

        test('long path', () => {
            // Arrange
            const service = new EndpointNameResolver();

            // Act
            const result = service.generateNameByPath('getByCustomer/{customer}/type/{type}');

            // Assert
            expect(result).toEqual('getByCustomerType');
        });
    });

    describe('generateNameDefault', () => {
        test('name', () => {
            // Arrange
            const service = new EndpointNameResolver();
            const name = 'Product';
            const verb = 'get';

            // Act
            const result = service.generateNameDefault(name, verb);

            // Assert
            expect(result).toEqual(`${verb}${name}`);
        });
    });
});
