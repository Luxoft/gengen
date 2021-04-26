import { defaultOptions } from '../../src/options';
import { AliasResolver } from '../../src/services/AliasResolver';

describe('AliasResolver tests', () => {
    describe('alias getter', () => {
        it('w/ alias', () => {
            // Arrange
            const aliasResolver = new AliasResolver({ ...defaultOptions, aliasName: 'alias' });
            const expected = 'alias';

            // Act
            const result = aliasResolver.alias;

            // Assert
            expect(result).toEqual(expected);
        });

        it('w/o alias', () => {
            // Arrange
            const aliasResolver = new AliasResolver(defaultOptions);
            const expected = '';

            // Act
            const result = aliasResolver.alias;

            // Assert
            expect(result).toEqual(expected);
        });
    });

    describe('getModelsFileName', () => {
        it('w/ alias', () => {
            // Arrange
            const aliasResolver = new AliasResolver({ ...defaultOptions, aliasName: 'alias' });
            const expected = 'alias-models.ts';

            // Act
            const result = aliasResolver.getModelsFileName();

            // Assert
            expect(result).toEqual(expected);
        });

        it('w/o alias', () => {
            // Arrange
            const aliasResolver = new AliasResolver(defaultOptions);
            const expected = 'models.ts';

            // Act
            const result = aliasResolver.getModelsFileName();

            // Assert
            expect(result).toEqual(expected);
        });
    });

    describe('getServicesFileName', () => {
        it('w/ alias', () => {
            // Arrange
            const aliasResolver = new AliasResolver({ ...defaultOptions, aliasName: 'alias' });
            const expected = 'alias-services.ts';

            // Act
            const result = aliasResolver.getServicesFileName();

            // Assert
            expect(result).toEqual(expected);
        });

        it('w/o alias', () => {
            // Arrange
            const aliasResolver = new AliasResolver(defaultOptions);
            const expected = 'services.ts';

            // Act
            const result = aliasResolver.getServicesFileName();

            // Assert
            expect(result).toEqual(expected);
        });
    });
});
