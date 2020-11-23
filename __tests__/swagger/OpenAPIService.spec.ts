import { OpenAPIService } from '../../src/swagger/OpenAPIService';

describe('OpenAPIService tests', () => {
    describe('ctor', () => {
        test('old OpenApi version', () => {
            const spec = { version: '1.0.1' };
            expect(() => new OpenAPIService(JSON.stringify(spec))).toThrow('Only OpenApi version 3 supported yet.');
        });

        test('future OpenApi version', () => {
            const spec = { openapi: '4.0.1' };
            expect(() => new OpenAPIService(JSON.stringify(spec))).toThrow('Only OpenApi version 3 supported yet.');
        });
    });

    describe('getEndpoints', () => {
        test('not found', () => {
            const spec = { openapi: '3.0.1' };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getEndpoints()).toEqual([]);
        });

        test('sorted', () => {
            const spec = {
                openapi: '3.0.1',
                paths: { '/product/SearchProducts': {}, '/api/v1/Category/AddCategory': {}, '/product/GetProducts': {} }
            };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getEndpoints()).toEqual(['/api/v1/Category/AddCategory', '/product/GetProducts', '/product/SearchProducts']);
        });
    });

    describe('getTagsByEndpoint', () => {
        test('not found path', () => {
            const spec = { openapi: '3.0.1' };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getTagsByEndpoint('test')).toEqual([]);
        });

        test('not found path item', () => {
            const spec = { openapi: '3.0.1', paths: { '/product/SearchProducts': {} } };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getTagsByEndpoint('test')).toEqual([]);
        });

        test.each(['get', 'post', 'put', 'delete'])('find', (operation) => {
            const operationObject: Record<string, { tags: string[] }> = {};
            operationObject[operation] = { tags: ['1', '2'] };

            const spec = { openapi: '3.0.1', paths: { test: operationObject } };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getTagsByEndpoint('test')).toEqual(['1', '2']);
        });
    });

    describe('getSchemasByEndpoints', () => {
        test('undefined', () => {
            const spec = { openapi: '3.0.1', paths: { '/product/SearchProducts': {} } };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getSchemasByEndpoints([])).toEqual({});
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
                                mode: { $ref: '#/components/schemas/FistEnum' }
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
                        }
                    }
                }
            };

            const service = new OpenAPIService(JSON.stringify(spec));
            const endpoints = service.getEndpoints();
            expect(service.getSchemasByEndpoints(endpoints)).toMatchObject(spec.components.schemas);
        });
    });
});
