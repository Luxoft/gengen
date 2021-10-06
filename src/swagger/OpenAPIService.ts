import { MethodOperation } from '../models/kinds/MethodOperation';
import { first, last } from '../utils';
import { OpenAPITypesGuard } from './OpenAPITypesGuard';
import { IOpenAPI3 } from './v3/open-api';
import { IOpenAPI3Operation } from './v3/operation';
import { IOpenAPI3Reference } from './v3/reference';
import { IOpenAPI3EnumSchema } from './v3/schemas/enum-schema';
import { IOpenAPI3ObjectSchema } from './v3/schemas/object-schema';
import { OpenAPI3ResponseSchema, OpenAPI3SchemaContainer } from './v3/schemas/schema';

const SUPPORTED_VERSION = 3;

interface IOperation {
    key: string;
    operation: IOpenAPI3Operation;
    method: MethodOperation;
}

export type IOpenAPI3Operations = { [key: string]: { method: MethodOperation; operation: IOpenAPI3Operation } };

export class OpenAPIService {
    private readonly spec: IOpenAPI3;

    constructor(json: string, private readonly typesGuard: OpenAPITypesGuard) {
        this.spec = JSON.parse(json);

        const majorVersion = this.majorVersion;
        if (majorVersion !== SUPPORTED_VERSION.toString()) {
            throw new Error(`Only OpenApi version ${SUPPORTED_VERSION} supported yet.`);
        }
    }

    public getEndpoints(): string[] {
        if (!this.spec.paths) {
            return [];
        }

        return Object.keys(this.spec.paths).sort();
    }

    public getMethodByEndpoint(endpoint: string): string {
        const result = this.getOperationByEndpoint(endpoint);
        return result ? MethodOperation[result.method] : '';
    }

    public getTagsByEndpoint(endpoint: string): string[] {
        const result = this.getOperationByEndpoint(endpoint);
        return result?.operation.tags ?? [];
    }

    public getSchemasByEndpoints(endpoints: Set<string>): OpenAPI3SchemaContainer {
        if (!endpoints?.size) {
            return {};
        }

        return [...endpoints]
            .map((z) => this.getOperationByEndpoint(z))
            .reduce((store, model) => {
                if (!model) {
                    return store;
                }

                const refs = this.getReferencesByOperation(model.operation);
                return { ...store, ...this.getSchemas(refs) };
            }, {});
    }



    public getOperationsByEndpoints(endpoints: Set<string>): IOpenAPI3Operations {
        if (!endpoints?.size) {
            return {};
        }

        return [...endpoints].reduce<IOpenAPI3Operations>((store, endpoint) => {
            const model = this.getOperationByEndpoint(endpoint);
            if (!model) {
                return store;
            }

            store[model.key] = { method: model.method, operation: model.operation };
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

    private get majorVersion(): string | undefined {
        if (!this.spec.openapi) {
            return undefined;
        }

        return first(this.spec.openapi.split('.'));
    }

    private getOperationByEndpoint(endpoint: string): IOperation | undefined {
        if (!this.spec.paths) {
            return undefined;
        }

        const path = Object.entries(this.spec.paths).find(([key]) => key === endpoint);
        if (!path) {
            return undefined;
        }

        const [name, pathItem] = path;
        if (pathItem.get) {
            return { key: name, operation: pathItem.get, method: MethodOperation.GET };
        }

        if (pathItem.post) {
            return { key: name, operation: pathItem.post, method: MethodOperation.POST };
        }

        if (pathItem.put) {
            return { key: name, operation: pathItem.put, method: MethodOperation.PUT };
        }

        if (pathItem.delete) {
            return { key: name, operation: pathItem.delete, method: MethodOperation.DELETE };
        }

        return undefined;
    }

    private getReferencesByOperation(operation: IOpenAPI3Operation): IOpenAPI3Reference[] {
        const refs: IOpenAPI3Reference[] = [];

        operation.parameters?.forEach((z) => {
            if (this.typesGuard.isReference(z.schema)) {
                refs.push(z.schema);
            }
        });

        this.getSchemaFromContent(refs, operation.requestBody?.content['application/json']?.schema);
        this.getSchemaFromContent(refs, operation.responses[200].content?.['application/json']?.schema);

        return refs;
    }

    private getReferencesByObject(object: IOpenAPI3ObjectSchema): IOpenAPI3Reference[] {
        let refs: IOpenAPI3Reference[] = [];

        Object.values(object.properties || []).forEach((z) => {
            let propertyRefs: IOpenAPI3Reference[] = [];
            if (this.typesGuard.isCollection(z) && this.typesGuard.isReference(z.items)) {
                propertyRefs.push(z.items);
            } else if (this.typesGuard.isReference(z)) {
                propertyRefs.push(z);
            } else if (this.typesGuard.isAllOf(z)) {
                propertyRefs = z.allOf;
            }

            propertyRefs.forEach((ref) => {
                refs.push(ref);

                const schema = this.getRefSchema(ref);
                if (this.typesGuard.isObject(schema)) {
                    refs = refs.concat(this.getReferencesByObject(schema));
                }
            });
        });

        return refs;
    }

    private getSchemaFromContent(refs: IOpenAPI3Reference[], schema: OpenAPI3ResponseSchema | undefined): void {
        if (this.typesGuard.isCollection(schema) && this.typesGuard.isReference(schema.items)) {
            refs.push(schema.items);
        } else if (this.typesGuard.isReference(schema)) {
            refs.push(schema);
        }
    }

    private getSchemas(refs: IOpenAPI3Reference[]): OpenAPI3SchemaContainer {
        const keys = new Set<string>(refs.map((z) => this.getSchemaKey(z)));

        const keysFromObjects = new Set<string>();
        keys.forEach((z) => {
            const schema = this.spec.components.schemas[z];
            if (this.typesGuard.isObject(schema)) {
                this.getReferencesByObject(schema).forEach((x) => {
                    keysFromObjects.add(this.getSchemaKey(x));
                });
            }
        });

        return [...new Set<string>([...keys, ...keysFromObjects])].reduce<OpenAPI3SchemaContainer>((store, key) => {
            store[key] = this.spec.components.schemas[key];
            return store;
        }, {});
    }
}
