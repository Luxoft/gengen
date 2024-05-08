import { IOpenAPI3Parameter } from './parameter';
import { IOpenAPI3Reference } from './reference';
import { IOpenAPI3ArraySchema } from './schemas/array-schema';
import { IOpenAPI3BinarySchema } from './schemas/binary-schema';
import { IOpenAPI3ObjectSchema } from './schemas/object-schema';
import { OpenAPI3Schema } from './schemas/schema';

export interface IOpenAPI3Operation {
    tags?: string[];
    parameters?: IOpenAPI3Parameter[];
    responses: {
        200?: {
            description?: 'Success';
            content?: {
                'application/json'?: {
                    schema: OpenAPI3Schema;
                };
                'application/octet-stream'?: {
                    schema: IOpenAPI3BinarySchema;
                };
            };
        };
        201?: {
            description?: 'Created';
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
