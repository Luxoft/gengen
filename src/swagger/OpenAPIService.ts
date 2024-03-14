import { MethodOperation } from '../models/kinds/MethodOperation';
import { first, last } from '../utils';
import { OpenAPITypesGuard } from './OpenAPITypesGuard';
import { IOpenAPI3 } from './v3/open-api';
import { IOpenAPI3Operation } from './v3/operation';
import { IOpenAPI3Reference } from './v3/reference';
import { IOpenAPI3EnumSchema } from './v3/schemas/enum-schema';
import { IOpenAPI3ObjectSchema } from './v3/schemas/object-schema';
import { OpenAPI3Schema, OpenAPI3SchemaContainer } from './v3/schemas/schema';

const SUPPORTED_VERSION = 3;

interface IOperation {
    key: string;
    operation: IOpenAPI3Operation;
    method: MethodOperation;
    methodName: string;
}

export type IOpenAPI3Operations = { [key: string]: { method: MethodOperation; operation: IOpenAPI3Operation }[] };

export class OpenAPIService {
    constructor(
        private readonly spec: IOpenAPI3,
        private readonly typesGuard: OpenAPITypesGuard
    ) {
        const majorVersion = this.majorVersion;
        if (majorVersion !== SUPPORTED_VERSION.toString()) {
            throw new Error(`Only OpenApi version ${SUPPORTED_VERSION} supported yet.`);
        }
    }

    public getSpec(): IOpenAPI3 {
        return this.spec;
    }

    public getEndpoints(): string[] {
        if (!this.spec.paths) {
            return [];
        }

        return Object.keys(this.spec.paths).sort();
    }

    public getTagsByEndpoint(endpoint: string): string[] {
        const result = this.getOperationsByEndpoint(endpoint);
        if (!result.length) {
            return [];
        }

        return first(result).operation.tags ?? [];
    }

    public getSchemasByEndpoints(endpoints: Set<string>): OpenAPI3SchemaContainer {
        if (!endpoints?.size) {
            return {};
        }

        return [...endpoints]
            .map((z) => this.getOperationsByEndpoint(z))
            .reduce((store, operations) => {
                if (!operations.length) {
                    return store;
                }

                const refs = operations.flatMap((z) => this.getRefsByOperation(z.operation));
                return { ...store, ...this.getSchemasByRefs(refs) };
            }, {});
    }

    public getSchemas(modelNames?: string[]): OpenAPI3SchemaContainer {
        if (!modelNames) {
            return this.spec.components.schemas;
        }

        return modelNames.reduce<OpenAPI3SchemaContainer>((store, modelName) => {
            const modelSchema = this.spec.components.schemas[modelName];

            if (!modelSchema) {
                return store;
            }

            const result = {
                ...store,
                [modelName]: modelSchema
            };

            if (!this.typesGuard.isObject(modelSchema)) {
                return result;
            }

            const refs: IOpenAPI3Reference[] = [];
            Object.values(modelSchema.properties || {}).forEach((propertySchema) => {
                refs.push(...this.getRefsFromSchema(propertySchema));
            });

            return { ...result, ...this.getSchemasByRefs(refs) };
        }, {});
    }

    public getOperationsByEndpoints(endpoints: Set<string>): IOpenAPI3Operations {
        if (!endpoints?.size) {
            return {};
        }

        return [...endpoints].reduce<IOpenAPI3Operations>((store, endpoint) => {
            const operations = this.getOperationsByEndpoint(endpoint);
            if (!operations.length) {
                return store;
            }

            store[first(operations).key] = operations;

            return store;
        }, {});
    }

    public getSchemaKey(reference: IOpenAPI3Reference): string {
        return last(reference.$ref.split('/'));
    }

    public getRefSchema(reference: IOpenAPI3Reference): IOpenAPI3ObjectSchema | IOpenAPI3EnumSchema | undefined {
        const refKey = this.getSchemaKey(reference);
        return this.spec.components.schemas[refKey];
    }

    public getOperationsByEndpoint(endpoint: string): IOperation[] {
        if (!this.spec.paths) {
            return [];
        }

        const path = Object.entries(this.spec.paths).find(([key]) => key === endpoint);
        if (!path) {
            return [];
        }

        const [name, pathItem] = path;

        return Object.keys(pathItem).reduce<IOperation[]>((operations, method) => {
            const operation: Partial<IOperation> = { key: name, methodName: method };
            switch (method) {
                case 'get':
                    operation.method = MethodOperation.GET;
                    operation.operation = pathItem.get;
                    break;
                case 'post':
                    operation.method = MethodOperation.POST;
                    operation.operation = pathItem.post;
                    break;
                case 'put':
                    operation.method = MethodOperation.PUT;
                    operation.operation = pathItem.put;
                    break;
                case 'delete':
                    operation.method = MethodOperation.DELETE;
                    operation.operation = pathItem.delete;
                    break;
            }

            operations.push(operation as IOperation);
            return operations;
        }, []);
    }

    private get majorVersion(): string | undefined {
        if (!this.spec.openapi) {
            return undefined;
        }

        return first(this.spec.openapi.split('.'));
    }

    private getRefsByOperation(operation: IOpenAPI3Operation): IOpenAPI3Reference[] {
        const refs: IOpenAPI3Reference[] = [];

        operation.parameters?.forEach((z) => {
            if (this.typesGuard.isReference(z.schema)) {
                refs.push(z.schema);
            }
        });

        return [
            ...refs,
            ...this.getRefsFromSchema(operation.requestBody?.content['application/json']?.schema),
            ...this.getRefsFromSchema(operation.responses[200].content?.['application/json']?.schema)
        ];
    }

    /**
     * @description Finds all refs from all objects and properties of a given refs
     */
    private expandRefs(refs: IOpenAPI3Reference[], refKeys = new Set<string>()): IOpenAPI3Reference[] {
        const collectedRefs: IOpenAPI3Reference[] = [];

        refs.forEach((ref) => {
            if (refKeys.has(ref.$ref)) {
                return;
            }

            collectedRefs.push(ref);
            refKeys.add(ref.$ref);

            const schema = this.getSchemaByRef(ref);
            if (this.typesGuard.isObject(schema)) {
                const refsFromObject = this.getRefsByObject(schema, ref);
                const expanded = this.expandRefs(refsFromObject, refKeys);
                collectedRefs.push(...expanded);
            }
        });

        return collectedRefs;
    }

    /**
     * @description Gets refs from object schema only one level down
     */
    private getRefsByObject(
        object: IOpenAPI3ObjectSchema,
        objectRef: IOpenAPI3Reference,
        outerRefs: IOpenAPI3Reference[] = []
    ): IOpenAPI3Reference[] {
        const refs = outerRefs;

        Object.values(object.properties || []).forEach((property) => {
            this.getRefsFromSchema(property)
                .filter((ref) => ref.$ref !== objectRef.$ref && !outerRefs.find((x) => x.$ref === ref.$ref))
                .forEach((ref) => {
                    refs.push(ref);

                    if (this.typesGuard.isObject(property)) {
                        this.getRefsByObject(property, objectRef, refs);
                    }
                });
        });

        return refs;
    }

    private getRefsFromSchema(schema: OpenAPI3Schema | undefined): IOpenAPI3Reference[] {
        const refs: IOpenAPI3Reference[] = [];
        if (this.typesGuard.isCollection(schema) && this.typesGuard.isReference(schema.items)) {
            refs.push(schema.items);
        } else if (this.typesGuard.isReference(schema)) {
            refs.push(schema);
        } else if (this.typesGuard.isAllOf(schema)) {
            refs.push(...schema.allOf);
        }
        return refs;
    }

    private getSchemasByRefs(refs: IOpenAPI3Reference[]): OpenAPI3SchemaContainer {
        return this.expandRefs(refs)
            .map((x) => this.getSchemaKey(x))
            .reduce<OpenAPI3SchemaContainer>((store, key) => {
                store[key] = this.spec.components.schemas[key];
                return store;
            }, {});
    }

    private getSchemaByRef(ref: IOpenAPI3Reference): IOpenAPI3ObjectSchema | IOpenAPI3EnumSchema | undefined {
        const schemaKey = this.getSchemaKey(ref);
        const schema = this.spec.components.schemas[schemaKey];
        return schema;
    }
}
