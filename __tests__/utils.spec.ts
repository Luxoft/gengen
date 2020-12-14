import { first, last, lowerFirst, sortBy } from '../src/utils';

describe('utils tests', () => {
    test('first', () => {
        expect(first([1, 2, 3])).toBeCloseTo(1);
    });

    test('last', () => {
        expect(last([1, 2, 3])).toBeCloseTo(3);
    });

    test('sortBy', () => {
        const array = [{ name: 'b' }, { name: 'a' }];
        expect(array.sort(sortBy((z) => z.name))).toEqual([{ name: 'a' }, { name: 'b' }]);
    });

    test('lowerFirst', () => {
        expect(lowerFirst('TestMethodName')).toEqual('testMethodName');
    });
});
