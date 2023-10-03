import { MethodKind } from '../../src/models/kinds/MethodKind';
import { MethodOperation } from '../../src/models/kinds/MethodOperation';
import { ParameterPlace } from '../../src/models/kinds/ParameterPlace';
import { PropertyKind } from '../../src/models/kinds/PropertyKind';
import { IMethodModel } from '../../src/models/method-parameter/IMethodModel';
import { PathBuilder } from '../../src/services/PathBuilder';

describe('UriBuilder tests', () => {
    let pathBuilder: PathBuilder;
    beforeEach(() => (pathBuilder = new PathBuilder()));

    describe('normalizePath', () => {
        describe('return correct path', () => {
            test('path with double slash', () => {
                // Arrange
                const firstPart = './folder1/folder2/';
                const secondPart = '/folder3/folder4/';
                const path = `${firstPart}/${secondPart}`;

                const expected = './folder1/folder2/folder3/folder4';

                // Act
                const result = pathBuilder.normalizePath(path);

                // Assert
                expect(result).toEqual(expected);
            });
        });
    });
});
