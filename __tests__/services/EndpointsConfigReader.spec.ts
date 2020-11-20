import { defaultOptions } from '../../src/options';
import { EndpointsConfigReader } from '../../src/services/EndpointsConfigReader';

describe('EndpointsConfigReader tests', () => {
    test('getActions', () => {
        const reader = new EndpointsConfigReader(defaultOptions);
        expect(reader.getActions()).resolves.toEqual(new Set(['Category/AddCategory', 'Product/GetProducts']));
    });
});
