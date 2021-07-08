import { TypeSerializer } from '../../../src/generators/utils/TypeSerializer';

describe('TypeSerializer tests', () => {
    describe('toString', () => {
        test('default isOptional is true', () => {
            // Arrange
            // Act
            const result = new TypeSerializer({
                type: 'MyType'
            }).toString();

            // Assert
            expect(result).toEqual('$types.TypeOrUndefined<MyType>');
        });

        test('isOptional false should return same type', () => {
            // Arrange
            // Act
            const result = new TypeSerializer({
                type: 'MyType',
                isOptional: false
            }).toString();

            // Assert
            expect(result).toEqual('MyType');
        });

        test('isCollection should return collection optional type', () => {
            // Arrange
            // Act
            const result = new TypeSerializer({
                type: 'MyType',
                isCollection: true
            }).toString();

            // Assert
            expect(result).toEqual('$types.TypeOrUndefined<MyType[]>');
        });

        test('isNullable should return nullable type', () => {
            // Arrange
            // Act
            const result = new TypeSerializer({
                type: 'MyType',
                isNullable: true
            }).toString();

            // Assert
            expect(result).toEqual('$types.TypeOrUndefinedNullable<MyType>');
        });
    });

    test('fromInterfaceProperty should return optional dtoType', () => {
        // Arrange
        // Act
        const result = TypeSerializer.fromInterfaceProperty({
            dtoType: 'MyDtoType',
            isCollection: false,
            isNullable: false,
            name: 'interface property name'
        }).toString();

        // Assert
        expect(result).toEqual('$types.TypeOrUndefined<MyDtoType>');
    });

    test('fromTypeName should return optional type', () => {
        // Arrange
        // Act
        const result = TypeSerializer.fromTypeName('MyType').toString();

        // Assert
        expect(result).toEqual('$types.TypeOrUndefined<MyType>');
    });
});
