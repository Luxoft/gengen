import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';

describe('OpenAPITypesGuard tests', () => {
    let guard: OpenAPITypesGuard;
    beforeEach(() => (guard = new OpenAPITypesGuard()));

    test('undefined', () => {
        expect(guard.isReference(undefined)).toBeFalsy();
        expect(guard.isCollection(undefined)).toBeFalsy();
        expect(guard.isObject(undefined)).toBeFalsy();
        expect(guard.isAllOf(undefined)).toBeFalsy();
        expect(guard.isEnum(undefined)).toBeFalsy();
        expect(guard.isGuid(undefined)).toBeFalsy();
        expect(guard.isNumber(undefined)).toBeFalsy();
        expect(guard.isString(undefined)).toBeFalsy();
        expect(guard.isDate(undefined)).toBeFalsy();
        expect(guard.isBoolean(undefined)).toBeFalsy();
        expect(guard.isSimple(undefined)).toBeFalsy();
    });

    test('another schema', () => {
        expect(guard.isReference({ type: 'string' })).toBeFalsy();
        expect(guard.isCollection({ type: 'string' })).toBeFalsy();
        expect(guard.isObject({ type: 'string' })).toBeFalsy();
        expect(guard.isAllOf({ type: 'string' })).toBeFalsy();
        expect(guard.isEnum({ type: 'string' })).toBeFalsy();
        expect(guard.isGuid({ type: 'string' })).toBeFalsy();
        expect(guard.isNumber({ type: 'string' })).toBeFalsy();
        expect(guard.isString({ type: 'boolean' })).toBeFalsy();
        expect(guard.isDate({ type: 'string' })).toBeFalsy();
        expect(guard.isBoolean({ type: 'string' })).toBeFalsy();
        expect(guard.isSimple({ allOf: [] })).toBeFalsy();
    });

    test('isReference', () => {
        expect(guard.isReference({ $ref: '#/components/schemas/Product' })).toBeTruthy();
    });

    test('isCollection', () => {
        expect(guard.isCollection({ type: 'array', items: { type: 'string' } })).toBeTruthy();
    });

    test('isAllOf', () => {
        expect(guard.isAllOf({ allOf: [] })).toBeTruthy();
    });

    test('isObject', () => {
        expect(guard.isObject({ type: 'object', properties: { name: { type: 'string' } } })).toBeTruthy();
    });

    test('isEnum', () => {
        expect(guard.isEnum({ enum: [1], type: 'integer', format: 'int32', 'x-enumNames': ['Test1'] })).toBeTruthy();
    });

    test('isGuid', () => {
        expect(guard.isGuid({ type: 'string', format: 'uuid' })).toBeTruthy();
    });

    describe('isNumber', () => {
        test('number', () => {
            expect(guard.isNumber({ type: 'number' })).toBeTruthy();
        });

        test('integer', () => {
            expect(guard.isNumber({ type: 'integer' })).toBeTruthy();
        });
    });

    test('isString', () => {
        expect(guard.isString({ type: 'string' })).toBeTruthy();
    });

    test('isDate', () => {
        expect(guard.isDate({ type: 'string', format: 'date-time' })).toBeTruthy();
    });

    test('isBoolean', () => {
        expect(guard.isBoolean({ type: 'boolean' })).toBeTruthy();
    });

    describe('isSimple', () => {
        test('guid', () => {
            expect(guard.isSimple({ type: 'string', format: 'uuid' })).toBeTruthy();
        });

        test('number', () => {
            expect(guard.isSimple({ type: 'number' })).toBeTruthy();
        });

        test('integer', () => {
            expect(guard.isSimple({ type: 'integer' })).toBeTruthy();
        });

        test('string', () => {
            expect(guard.isSimple({ type: 'string' })).toBeTruthy();
        });

        test('date', () => {
            expect(guard.isSimple({ type: 'string', format: 'date-time' })).toBeTruthy();
        });

        test('boolean', () => {
            expect(guard.isSimple({ type: 'boolean' })).toBeTruthy();
        });
    });
});
