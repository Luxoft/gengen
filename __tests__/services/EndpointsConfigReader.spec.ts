import { defaultOptions } from '../../src/options';
import { EndpointsConfigReader } from '../../src/services/EndpointsConfigReader';

describe('EndpointsConfigReader tests', () => {
    test('getEndpoints', () => {
        const reader = new EndpointsConfigReader(defaultOptions);
        expect(reader.getEndpoints()).resolves.toEqual(new Set(['/api/v1/Category/AddCategory', '/Product/GetProducts']));
    });
});
