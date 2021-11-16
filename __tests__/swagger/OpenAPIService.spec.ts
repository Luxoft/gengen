import { MethodOperation } from '../../src/models/kinds/MethodOperation';
import { OpenAPIService } from '../../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';

describe('OpenAPIService tests', () => {
    let guard: OpenAPITypesGuard;
    beforeEach(() => (guard = new OpenAPITypesGuard()));

    describe('ctor', () => {
        test('old OpenApi version', () => {
            const spec = { version: '1.0.1' };
            expect(() => new OpenAPIService(JSON.stringify(spec), guard)).toThrow('Only OpenApi version 3 supported yet.');
        });

        test('future OpenApi version', () => {
            const spec = { openapi: '4.0.1' };
            expect(() => new OpenAPIService(JSON.stringify(spec), guard)).toThrow('Only OpenApi version 3 supported yet.');
        });
    });

    test('getSchemaKey', () => {
        const spec = { openapi: '3.0.1' };
        const service = new OpenAPIService(JSON.stringify(spec), guard);
        expect(service.getSchemaKey({ $ref: '#/components/schemas/Product' })).toEqual('Product');
    });

    describe('getEndpoints', () => {
        test('not found', () => {
            const spec = { openapi: '3.0.1' };
            const service = new OpenAPIService(JSON.stringify(spec), guard);
            expect(service.getEndpoints()).toEqual([]);
        });

        test('sorted', () => {
            const spec = {
                openapi: '3.0.1',
                paths: { '/product/SearchProducts': {}, '/api/v1/Category/AddCategory': {}, '/product/GetProducts': {} }
            };
            const service = new OpenAPIService(JSON.stringify(spec), guard);
            expect(service.getEndpoints()).toEqual(['/api/v1/Category/AddCategory', '/product/GetProducts', '/product/SearchProducts']);
        });
    });

    describe('getTagsByEndpoint', () => {
        test('not found path', () => {
            const spec = { openapi: '3.0.1' };
            const service = new OpenAPIService(JSON.stringify(spec), guard);
            expect(service.getTagsByEndpoint('test')).toEqual([]);
        });

        test('not found path item', () => {
            const spec = { openapi: '3.0.1', paths: { '/product/SearchProducts': {} } };
            const service = new OpenAPIService(JSON.stringify(spec), guard);
            expect(service.getTagsByEndpoint('test')).toEqual([]);
        });

        test.each(['get', 'post', 'put', 'delete'])('find', (operation) => {
            const operationObject: Record<string, { tags: string[] }> = {};
            operationObject[operation] = { tags: ['1', '2'] };

            const spec = { openapi: '3.0.1', paths: { test: operationObject } };
            const service = new OpenAPIService(JSON.stringify(spec), guard);
            expect(service.getTagsByEndpoint('test')).toEqual(['1', '2']);
        });
    });

    describe('getOperationsByEndpoints', () => {
        test('not found path', () => {
            const spec = { openapi: '3.0.1' };
            const service = new OpenAPIService(JSON.stringify(spec), guard);
            expect(service.getOperationsByEndpoints(new Set('test'))).toEqual({});
        });

        test('not found path item', () => {
            const spec = { openapi: '3.0.1', paths: { '/product/SearchProducts': {} } };
            const service = new OpenAPIService(JSON.stringify(spec), guard);
            expect(service.getOperationsByEndpoints(new Set('test'))).toEqual({});
        });

        test.each([
            ['get', MethodOperation.GET],
            ['post', MethodOperation.POST],
            ['put', MethodOperation.PUT],
            ['delete', MethodOperation.DELETE]
        ])('find', (operation, method) => {
            const operationObject: Record<string, { tags: string[] }> = {};
            operationObject[operation] = { tags: ['1', '2'] };

            const spec = { openapi: '3.0.1', paths: { test: operationObject, test2: operationObject } };
            const service = new OpenAPIService(JSON.stringify(spec), guard);
            expect(service.getOperationsByEndpoints(new Set(['test', 'test2']))).toMatchObject({
                test: [{ operation: operationObject[operation], method: method }],
                test2: [{ operation: operationObject[operation], method: method }]
            });
        });
    });

    describe('getSchemasByEndpoints', () => {
        test('undefined', () => {
            const spec = { openapi: '3.0.1', paths: { '/product/SearchProducts': {} } };
            const service = new OpenAPIService(JSON.stringify(spec), guard);
            expect(service.getSchemasByEndpoints(new Set<string>())).toEqual({});
        });

        test('recursion', () => {
            const spec = {
                openapi: '3.0.1',
                paths: {
                    '/product/test': {
                        get: {
                            responses: {
                                200: {
                                    description: 'Success',
                                    content: {
                                        "application/json": {
                                            schema: {
                                                $ref: "#/components/schemas/SimpleObject"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                components: {
                    schemas: {
                        SimpleObject: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                children: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/SimpleObject"
                                    },
                                    nullable: true
                                }
                            }
                        }
                    }
                }
            };

            const service = new OpenAPIService(JSON.stringify(spec), guard);
            const endpoints = service.getEndpoints();
            expect(service.getSchemasByEndpoints(new Set<string>(endpoints))).toEqual(spec.components.schemas);
        });

        test('all', () => {
            const spec = {
                openapi: '3.0.1',
                paths: {
                    '/product/Get': {
                        get: {
                            parameters: [
                                {
                                    name: 'id',
                                    schema: {
                                        type: 'string',
                                        format: 'uuid'
                                    }
                                },
                                {
                                    $ref: '#/components/schemas/FistEnum'
                                }
                            ],
                            responses: {
                                200: {
                                    content: {
                                        'application/json': {
                                            schema: {
                                                $ref: '#/components/schemas/FirstObject'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '/product/Post': {
                        post: {
                            parameters: [
                                {
                                    name: 'name',
                                    schema: {
                                        type: 'string'
                                    }
                                },
                                {
                                    $ref: '#/components/schemas/FistEnum'
                                }
                            ],
                            requestBody: {
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/SecondLayerObject'
                                        }
                                    }
                                }
                            },
                            responses: {
                                200: {
                                    content: {
                                        'application/json': {
                                            schema: {
                                                $ref: '#/components/schemas/ThirdLayerObject'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '/product/Put': {
                        put: {
                            requestBody: {
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/SecondEnum'
                                        }
                                    }
                                }
                            },
                            responses: {
                                200: {
                                    description: 'Success'
                                }
                            }
                        }
                    },
                    '/product/Delete': {
                        delete: {
                            requestBody: {
                                content: {
                                    'application/json': {
                                        schema: {
                                            $ref: '#/components/schemas/SimpleObject'
                                        }
                                    }
                                }
                            },
                            responses: {
                                200: {
                                    description: 'Success'
                                }
                            }
                        }
                    },
                    '/product/DeleteEmpty': {
                        delete: {
                            requestBody: {
                                content: {
                                    'application/json-patch+json': {
                                        schema: {
                                            $ref: '#/components/schemas/SimpleObject'
                                        }
                                    }
                                }
                            },
                            responses: {
                                200: {
                                    description: 'Success'
                                }
                            }
                        }
                    }
                },
                components: {
                    schemas: {
                        FistEnum: {
                            enum: [1, 2],
                            type: 'integer',
                            format: 'int32',
                            'x-enumNames': ['Test1', 'test2']
                        },
                        SecondEnum: {
                            enum: [1, 2],
                            type: 'integer',
                            format: 'int32',
                            'x-enumNames': ['Test5', 'test6']
                        },
                        FirstObject: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                mode: { $ref: '#/components/schemas/FistEnum' },
                                empty: { $ref: '#/components/schemas/EmptyObject' }
                            }
                        },
                        SecondLayerObject: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                children: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/SimpleObject'
                                    }
                                }
                            }
                        },
                        ThirdLayerObject: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                children: {
                                    allOf: [
                                        {
                                            $ref: '#/components/schemas/SecondLayerObject'
                                        }
                                    ]
                                }
                            }
                        },
                        SimpleObject: {
                            type: 'object',
                            properties: { id: { type: 'string', format: 'uuid' } }
                        },
                        EmptyObject: {
                            type: 'object',
                            additionalProperties: false
                        }
                    }
                }
            };

            const service = new OpenAPIService(JSON.stringify(spec), guard);
            const endpoints = service.getEndpoints();
            expect(service.getSchemasByEndpoints(new Set<string>(endpoints))).toMatchObject(spec.components.schemas);
        });
    });
});
