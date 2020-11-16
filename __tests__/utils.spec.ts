import { first, last } from '../src/utils';

describe("utils tests", () => {
    test("first", () => {
        expect(first([1, 2, 3])).toBeCloseTo(1);
    });

    test("last", () => {
        expect(last([1, 2, 3])).toBeCloseTo(3);
    });
});