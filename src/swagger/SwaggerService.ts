import { first } from '../utils';
import { IOpenAPI3 } from './v3/open-api';

const SUPPORTED_VERSION = 3;

export class SwaggerService {
    private readonly spec: IOpenAPI3;

    constructor(json: string) {
        this.spec = JSON.parse(json)

        const majorVersion = first(this.spec.openapi.split('.'));
        if (majorVersion !== SUPPORTED_VERSION.toString()) {
            throw new Error(`Only OpenApi version ${SUPPORTED_VERSION} supported yet.`)
        }
    }

    public getEndpoints(): string[] {
        return Object.keys(this.spec.paths).sort();
    }

    public getTagsByEndpoint(endpoint: string): string[] {
        const pathItem = this.spec.paths[endpoint];
        if (!pathItem) {
            return [];
        }

        const operation = pathItem.get || pathItem.post || pathItem.put || pathItem.delete;
        return operation?.tags ?? [];
    }
}
