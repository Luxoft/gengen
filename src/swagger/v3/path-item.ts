import { IOpenAPI3Operation } from './operation';

export interface IOpenAPI3PathItem {
    post?: IOpenAPI3Operation;
    get?: IOpenAPI3Operation;
    delete?: IOpenAPI3Operation;
    put?: IOpenAPI3Operation;
}
