import { IOpenAPI3Parameter } from './parameter';
import { IOpenAPI3Reference } from './reference';
import { IOpenAPI3ArraySchema } from './schemas/array-schema';
import { IOpenAPI3BinarySchema } from './schemas/binary-schema';

export interface IOpenAPI3Operation {
    tags: string[];
    parameters?: IOpenAPI3Parameter[];
    responses: {
        200: {
            description: 'Success';
            content?: {
                'application/json': {
                    schema: IOpenAPI3ArraySchema | IOpenAPI3Reference;
                };
                'application/octet-stream': {
                    schema: IOpenAPI3BinarySchema;
                };
            };
        };
    };
    requestBody?: {
        content: {
            'application/json': {
                schema: IOpenAPI3ArraySchema | IOpenAPI3Reference;
            };
        };
    };
}
