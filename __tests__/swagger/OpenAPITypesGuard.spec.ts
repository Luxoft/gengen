import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';

describe('OpenAPITypesGuard tests', () => {
    describe('isReference', () => {
        test('undefined', () => {
            expect(OpenAPITypesGuard.isReference(undefined)).toBeFalsy();
        });

        test('reference', () => {
            expect(OpenAPITypesGuard.isReference({ $ref: '#/components/schemas/Product' })).toBeTruthy();
        });

        test('string schema', () => {
            expect(OpenAPITypesGuard.isReference({ type: 'string' })).toBeFalsy();
        });
    });

    describe('isCollection', () => {
        test('undefined', () => {
            expect(OpenAPITypesGuard.isCollection(undefined)).toBeFalsy();
        });

        test('array', () => {
            expect(OpenAPITypesGuard.isCollection({ type: 'array', items: { $ref: '#/components/schemas/Product' } })).toBeTruthy();
        });

        test('string schema', () => {
            expect(OpenAPITypesGuard.isCollection({ type: 'string' })).toBeFalsy();
        });
    });

    describe('isObject', () => {
        test('undefined', () => {
            expect(OpenAPITypesGuard.isObject(undefined)).toBeFalsy();
        });

        test('object', () => {
            expect(OpenAPITypesGuard.isObject({ type: 'object', properties: { name: { type: 'string' } } })).toBeTruthy();
        });

        test('string schema', () => {
            expect(OpenAPITypesGuard.isObject({ type: 'string' })).toBeFalsy();
        });
    });

    describe('isAllOf', () => {
        test('undefined', () => {
            expect(OpenAPITypesGuard.isAllOf(undefined)).toBeFalsy();
        });

        test('object', () => {
            expect(OpenAPITypesGuard.isAllOf({ allOf: [] })).toBeTruthy();
        });

        test('string schema', () => {
            expect(OpenAPITypesGuard.isAllOf({ type: 'string' })).toBeFalsy();
        });
    });

    describe('isEnum', () => {
        test('undefined', () => {
            expect(OpenAPITypesGuard.isEnum(undefined)).toBeFalsy();
        });

        test('enum', () => {
            expect(OpenAPITypesGuard.isEnum({ enum: [1], type: 'integer', format: 'int32', 'x-enumNames': ['Test1'] })).toBeTruthy();
        });

        test('string schema', () => {
            expect(OpenAPITypesGuard.isEnum({ type: 'string' })).toBeFalsy();
        });
    });
});
