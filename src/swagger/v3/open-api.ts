import { IOpenAPI3PathItem } from './path-item';

export interface IOpenAPI3 {
    openapi: string;
    paths: {
        [key: string]: IOpenAPI3PathItem;
    };
}
