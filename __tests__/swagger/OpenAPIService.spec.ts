import { OpenAPIService } from '../../src/swagger/OpenAPIService';

describe("OpenAPIService tests", () => {
    describe('ctor ', () => {
        test("old OpenApi version", () => {
            const spec = { "version": "1.0.1" };
            expect(() => new OpenAPIService(JSON.stringify(spec))).toThrow('Only OpenApi version 3 supported yet.');
        });

        test("future OpenApi version", () => {
            const spec = { "openapi": "4.0.1" };
            expect(() => new OpenAPIService(JSON.stringify(spec))).toThrow('Only OpenApi version 3 supported yet.');
        });
    });

    describe('getEndpoints ', () => {
        test("not found", () => {
            const spec = { "openapi": "3.0.1" };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getEndpoints()).toEqual([]);
        });

        test("sorted", () => {
            const spec = { "openapi": "3.0.1", "paths": { "/product/SearchProducts": {}, "/api/v1/Category/AddCategory": {}, "/product/GetProducts": {} } };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getEndpoints()).toEqual(['/api/v1/Category/AddCategory', '/product/GetProducts', '/product/SearchProducts']);
        });
    });

    describe('getTagsByEndpoint ', () => {
        test("not found path", () => {
            const spec = { "openapi": "3.0.1" };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getTagsByEndpoint("test")).toEqual([]);
        });

        test("not found path item", () => {
            const spec = { "openapi": "3.0.1", "paths": { "/product/SearchProducts": {} } };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getTagsByEndpoint("test")).toEqual([]);
        });

        test.each(['get', 'post', 'put', 'delete'])('find', (operation) => {
            const operationObject: Record<string, { tags: string[] }> = {};
            operationObject[operation] = { "tags": ["1", "2"] }

            const spec = { "openapi": "3.0.1", "paths": { "test": operationObject } };
            const service = new OpenAPIService(JSON.stringify(spec));
            expect(service.getTagsByEndpoint("test")).toEqual(["1", "2"]);
        })
    });
});