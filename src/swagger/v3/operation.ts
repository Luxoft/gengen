import { IOpenAPI3Parameter } from './parameter';
import { IOpenAPI3Reference } from './reference';
import { IOpenAPI3ArraySchema } from './schemas/array-schema';
import { IOpenAPI3BinarySchema } from './schemas/binary-schema';
import { IOpenAPI3ObjectSchema } from './schemas/object-schema';
import { OpenAPI3ResponseSchema } from './schemas/schema';

export interface IOpenAPI3Operation {
    tags?: string[];
    parameters?: IOpenAPI3Parameter[];
    responses: {
        200: {
            description?: 'Success';
            content?: {
                'application/json'?: {
                    schema: OpenAPI3ResponseSchema;
                };
                'application/octet-stream'?: {
                    schema: IOpenAPI3BinarySchema;
                };
            };
        };
    };
    requestBody?: {
        content: {
            'application/json'?: {
                schema: IOpenAPI3ArraySchema | IOpenAPI3Reference;
            };
            'multipart/form-data'?: {
                schema: IOpenAPI3ObjectSchema;
            };
        };
    };
}

export type IOpenAPI3OperationContainer = { [key: string]: IOpenAPI3Operation };
