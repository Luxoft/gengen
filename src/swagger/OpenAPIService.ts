import { first, last } from '../utils';
import { OpenAPITypesGuard } from './OpenAPITypesGuard';
import { IOpenAPI3 } from './v3/open-api';
import { IOpenAPI3Operation } from './v3/operation';
import { IOpenAPI3Reference } from './v3/reference';
import { IOpenAPI3ArraySchema } from './v3/schemas/array-schema';
import { IOpenAPI3ObjectSchema } from './v3/schemas/object-schema';
import { IOpenAPI3SchemaContainer } from './v3/schemas/schema';

const SUPPORTED_VERSION = 3;

export class OpenAPIService {
    private readonly spec: IOpenAPI3;

    constructor(json: string) {
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

    public getTagsByEndpoint(endpoint: string): string[] {
        return this.getOperationByEndpoint(endpoint)?.tags ?? [];
    }

    public getSchemasByEndpoints(endpoints: Set<string>): IOpenAPI3SchemaContainer {
        if (!endpoints?.size) {
            return {};
        }

        return [...endpoints]
            .map((z) => this.getOperationByEndpoint(z))
            .reduce((store, operation) => {
                if (!operation) {
                    return store;
                }

                const refs = this.getReferencesByOperation(operation);
                return { ...store, ...this.getSchemas(refs) };
            }, {});
    }

    private get majorVersion(): string | undefined {
        if (!this.spec.openapi) {
            return undefined;
        }

        return first(this.spec.openapi.split('.'));
    }

    private getOperationByEndpoint(endpoint: string): IOpenAPI3Operation | undefined {
        if (!this.spec.paths) {
            return undefined;
        }

        const path = Object.entries(this.spec.paths).find(([key]) => key.endsWith(endpoint));
        if (!path) {
            return undefined;
        }

        const [, pathItem] = path;
        return pathItem.get || pathItem.post || pathItem.put || pathItem.delete;
    }

    private getReferencesByOperation(operation: IOpenAPI3Operation): IOpenAPI3Reference[] {
        const refs: IOpenAPI3Reference[] = [];

        operation.parameters?.forEach((z) => {
            if (OpenAPITypesGuard.isReference(z.schema)) {
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
            if (OpenAPITypesGuard.isCollection(z)) {
                propertyRefs.push(z.items);
            } else if (OpenAPITypesGuard.isReference(z)) {
                propertyRefs.push(z);
            } else if (OpenAPITypesGuard.isAllOf(z)) {
                propertyRefs = z.allOf;
            }

            propertyRefs.forEach((x) => {
                refs.push(x);
                const schema = this.spec.components.schemas[this.getSchemaKey(x)];
                if (OpenAPITypesGuard.isObject(schema)) {
                    refs = refs.concat(this.getReferencesByObject(schema));
                }
            });
        });

        return refs;
    }

    private getSchemaFromContent(refs: IOpenAPI3Reference[], schema: IOpenAPI3ArraySchema | IOpenAPI3Reference | undefined): void {
        if (OpenAPITypesGuard.isCollection(schema)) {
            refs.push(schema.items);
        } else if (OpenAPITypesGuard.isReference(schema)) {
            refs.push(schema);
        }
    }

    private getSchemas(refs: IOpenAPI3Reference[]): IOpenAPI3SchemaContainer {
        const keys = new Set<string>(refs.map((z) => this.getSchemaKey(z)));

        const keysFromObjects = new Set<string>();
        keys.forEach((z) => {
            const schema = this.spec.components.schemas[z];
            if (OpenAPITypesGuard.isObject(schema)) {
                this.getReferencesByObject(schema).forEach((x) => {
                    keysFromObjects.add(this.getSchemaKey(x));
                });
            }
        });

        return [...new Set<string>([...keys, ...keysFromObjects])].reduce<IOpenAPI3SchemaContainer>((store, key) => {
            store[key] = this.spec.components.schemas[key];
            return store;
        }, {});
    }

    private getSchemaKey(reference: IOpenAPI3Reference): string {
        return last(reference.$ref.split('/'));
    }
}
