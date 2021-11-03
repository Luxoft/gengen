import { OptionalKind, ParameterDeclarationStructure, Scope } from 'ts-morph';

import { AngularServicesMethodGenerator } from '../../../src/generators/angular/AngularServicesMethodGenerator';
import { MethodKind } from '../../../src/models/kinds/MethodKind';
import { MethodOperation } from '../../../src/models/kinds/MethodOperation';
import { IMethodModel } from '../../../src/models/method-parameter/IMethodModel';
import { UriBuilder } from '../../../src/services/UriBuilder';

describe('AngularServicesMethodGenerator tests', () => {
    describe('getMethodParameters', () => {
        class TestAngularServicesMethodGenerator extends AngularServicesMethodGenerator {
            public getMethodParameters(methodModel: IMethodModel): OptionalKind<ParameterDeclarationStructure>[] {
                return super.getMethodParameters(methodModel);
            }
        }

        test('active withRequestOptions', () => {
            // Arrange
            const uriBuilder = new UriBuilder();
            const settings = {
                configOutput: '',
                output: '',
                withRequestOptions: true
            };
            const service = new TestAngularServicesMethodGenerator(uriBuilder, settings);
            const methodModel = {
                kind: MethodKind.Default,
                name: 'getProducts',
                operation: MethodOperation.GET,
                parameters: [],
                returnType: undefined,
                originUri: 'GetProducts'
            };
            const expected = [
                {
                    name: 'options',
                    type: "$types.TypeOrUndefined<IAngularHttpRequestOptions>",
                    hasQuestionToken: true
                }
            ];

            // Act
            const actual = service.getMethodParameters(methodModel);

            // Assert
            expect(actual).toMatchObject(expected);
        });

        test('inactive withRequestOptions', () => {
            // Arrange
            const uriBuilder = new UriBuilder();
            const settings = {
                configOutput: '',
                output: '',
                withRequestOptions: false
            };
            const service = new TestAngularServicesMethodGenerator(uriBuilder, settings);
            const methodModel = {
                kind: MethodKind.Default,
                name: 'getProducts',
                operation: MethodOperation.GET,
                parameters: [],
                returnType: undefined,
                originUri: 'GetProducts'
            };

            // Act
            const actual = service.getMethodParameters(methodModel);

            // Assert
            expect(actual).toMatchObject([]);
        });
    });

    describe('getMethodsCodeStructures', () => {
        test('get code structures with active withRequestOptions', () => {
            // Arrange
            const uriBuilder = new UriBuilder();
            const settings = {
                configOutput: '',
                output: '',
                withRequestOptions: true
            };
            const service = new AngularServicesMethodGenerator(uriBuilder, settings);
            const methodModel = {
                kind: MethodKind.Default,
                name: 'getProducts',
                operation: MethodOperation.GET,
                parameters: [],
                returnType: undefined,
                originUri: 'GetProducts'
            };
            const expected = [{
                scope: Scope.Public,
                name: 'getProducts',
                returnType: 'Observable<void>',
                parameters: [
                    {
                        name: 'options',
                        type: "$types.TypeOrUndefined<IAngularHttpRequestOptions>",
                        hasQuestionToken: true
                    }
                ]
            }];

            // Act
            const actual = service.getMethodsCodeStructures([methodModel]);

            // Assert
            expect(actual).toMatchObject(expected);
        });

        test('get code structures with inactive withRequestOptions', () => {
            // Arrange
            const uriBuilder = new UriBuilder();
            const settings = {
                configOutput: '',
                output: '',
                withRequestOptions: false
            };
            const service = new AngularServicesMethodGenerator(uriBuilder, settings);
            const methodModel = {
                kind: MethodKind.Default,
                name: 'getProducts',
                operation: MethodOperation.GET,
                parameters: [],
                returnType: undefined,
                originUri: 'GetProducts'
            };
            const expected = [{
                scope: Scope.Public,
                name: 'getProducts',
                returnType: 'Observable<void>',
                parameters: []
            }];

            // Act
            const actual = service.getMethodsCodeStructures([methodModel]);

            // Assert
            expect(actual).toMatchObject(expected);
        });
    });
});
