import { MethodOperation } from '../../src/models/kinds/MethodOperation';
import { OpenAPIService } from '../../src/swagger/OpenAPIService';
import { OpenAPITypesGuard } from '../../src/swagger/OpenAPITypesGuard';
import { IOpenAPI3 } from '../../src/swagger/v3/open-api';

describe('OpenAPIService tests', () => {
    let guard: OpenAPITypesGuard;
    beforeEach(() => (guard = new OpenAPITypesGuard()));
    const defaultSpec: IOpenAPI3 = {
        components: { schemas: {} },
        openapi: '',
        paths: {}
    };

    describe('getSchemas', () => {
        const schema: IOpenAPI3 = {
            ...defaultSpec,
            openapi: '3.0.1',
            components: {
                schemas: {
                    modelName1: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid'
                            }
                        }
                    },
                    modelName2: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid'
                            }
                        }
                    },
                    modelName3: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid'
                            },
                            prop1: {
                                $ref: '#/components/schemas/modelName1'
                            },
                            prop2: {
                                $ref: '#/components/schemas/modelName2'
                            }
                        }
                    }
                }
            }
        };

        test('should return all models if no whitelist specified', () => {
            const service = new OpenAPIService(schema, guard);
            const result = service.getSchemas();
            expect(Object.values(result).length).toBe(3);
        });

        test('should return only selected model if it has no ref fields', () => {
            const service = new OpenAPIService(schema, guard);
            const result = service.getSchemas(['modelName1']);
            expect(Object.values(result).length).toBe(1);
        });

        test('should return model and all of ref field models', () => {
            const service = new OpenAPIService(schema, guard);
            const result = service.getSchemas(['modelName3']);
            expect(Object.values(result).length).toBe(3);
        });

        test('should be empty if no model found', () => {
            const service = new OpenAPIService(schema, guard);
            const result = service.getSchemas(['someOtherModel']);
            expect(Object.values(result).length).toBe(0);
        });
    });

    describe('ctor', () => {
        test('old OpenApi version', () => {
            const spec = { ...defaultSpec, openapi: '1.0.1' };
            expect(() => new OpenAPIService(spec, guard)).toThrow('Only OpenApi version 3 supported yet.');
        });

        test('future OpenApi version', () => {
            const spec = { ...defaultSpec, openapi: '4.0.1' };
            expect(() => new OpenAPIService(spec, guard)).toThrow('Only OpenApi version 3 supported yet.');
        });
    });

    test('getSchemaKey', () => {
        const spec = { ...defaultSpec, openapi: '3.0.1' };
        const service = new OpenAPIService(spec, guard);
        expect(service.getSchemaKey({ $ref: '#/components/schemas/Product' })).toEqual('Product');
    });

    describe('getEndpoints', () => {
        test('not found', () => {
            const spec = { ...defaultSpec, openapi: '3.0.1' };
            const service = new OpenAPIService(spec, guard);
            expect(service.getEndpoints()).toEqual([]);
        });

        test('sorted', () => {
            const spec: IOpenAPI3 = {
                openapi: '3.0.1',
                paths: { '/product/SearchProducts': {}, '/api/v1/Category/AddCategory': {}, '/product/GetProducts': {} },
                components: { schemas: {} }
            };
            const service = new OpenAPIService(spec, guard);
            expect(service.getEndpoints()).toEqual(['/api/v1/Category/AddCategory', '/product/GetProducts', '/product/SearchProducts']);
        });
    });

    describe('getTagsByEndpoint', () => {
        test('not found path', () => {
            const spec = { ...defaultSpec, openapi: '3.0.1' };
            const service = new OpenAPIService(spec, guard);
            expect(service.getTagsByEndpoint('test')).toEqual([]);
        });

        test('not found path item', () => {
            const spec = { ...defaultSpec, openapi: '3.0.1', paths: { '/product/SearchProducts': {} } };
            const service = new OpenAPIService(spec, guard);
            expect(service.getTagsByEndpoint('test')).toEqual([]);
        });

        test.each(['get', 'post', 'put', 'delete'])('find', (operation) => {
            const operationObject: Record<string, { tags: string[] }> = {};
            operationObject[operation] = { tags: ['1', '2'] };

            const spec = { ...defaultSpec, openapi: '3.0.1', paths: { test: operationObject } };
            const service = new OpenAPIService(spec, guard);
            expect(service.getTagsByEndpoint('test')).toEqual(['1', '2']);
        });
    });

    describe('getOperationsByEndpoints', () => {
        test('not found path', () => {
            const spec = { ...defaultSpec, openapi: '3.0.1' };
            const service = new OpenAPIService(spec, guard);
            expect(service.getOperationsByEndpoints(new Set('test'))).toEqual({});
        });

        test('not found path item', () => {
            const spec = { ...defaultSpec, openapi: '3.0.1', paths: { '/product/SearchProducts': {} } };
            const service = new OpenAPIService(spec, guard);
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

            const spec = { ...defaultSpec, openapi: '3.0.1', paths: { test: operationObject, test2: operationObject } };
            const service = new OpenAPIService(spec, guard);
            expect(service.getOperationsByEndpoints(new Set(['test', 'test2']))).toMatchObject({
                test: [{ operation: operationObject[operation], method: method }],
                test2: [{ operation: operationObject[operation], method: method }]
            });
        });
    });

    describe('getSchemasByEndpoints', () => {
        test('undefined', () => {
            const spec = { ...defaultSpec, openapi: '3.0.1', paths: { '/product/SearchProducts': {} } };
            const service = new OpenAPIService(spec, guard);
            expect(service.getSchemasByEndpoints(new Set<string>())).toEqual({});
        });

        test('response with not 200 code', () => {
            const spec: IOpenAPI3 = {
                ...defaultSpec,
                openapi: '3.0.1',
                paths: {
                    '/product/test': {
                        post: {
                            responses: {
                                201: {
                                    description: 'Created'
                                }
                            }
                        }
                    }
                }
            };

            const service = new OpenAPIService(spec, guard);
            const endpoints = service.getEndpoints();
            expect(service.getSchemasByEndpoints(new Set<string>(endpoints))).toEqual({});
        });

        test('recursion', () => {
            const spec: IOpenAPI3 = {
                openapi: '3.0.1',
                paths: {
                    '/product/test': {
                        get: {
                            responses: {
                                200: {
                                    description: 'Success',
                                    content: {
                                        'application/json': {
                                            schema: {
                                                $ref: '#/components/schemas/SimpleObject'
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
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/SimpleObject'
                                    },
                                    nullable: true
                                }
                            }
                        }
                    }
                }
            };

            const service = new OpenAPIService(spec, guard);
            const endpoints = service.getEndpoints();
            expect(service.getSchemasByEndpoints(new Set<string>(endpoints))).toEqual(spec.components.schemas);
        });

        test('all', () => {
            const spec: IOpenAPI3 = {
                openapi: '3.0.1',
                paths: {
                    '/product/Get': {
                        get: {
                            parameters: [
                                {
                                    in: 'query',
                                    name: 'id',
                                    schema: {
                                        type: 'string',
                                        format: 'uuid'
                                    }
                                },
                                {
                                    in: 'query',
                                    name: 'name2',
                                    schema: {
                                        $ref: '#/components/schemas/FistEnum'
                                    }
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
                                    in: 'path',
                                    name: 'name',
                                    schema: {
                                        type: 'string'
                                    }
                                },
                                {
                                    name: 'name2',
                                    in: 'query',
                                    schema: {
                                        $ref: '#/components/schemas/FistEnum'
                                    }
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
                            properties: {}
                        }
                    }
                }
            };

            const service = new OpenAPIService(spec, guard);
            const endpoints = service.getEndpoints();
            expect(service.getSchemasByEndpoints(new Set<string>(endpoints))).toMatchObject(spec.components.schemas);
        });
    });
});
