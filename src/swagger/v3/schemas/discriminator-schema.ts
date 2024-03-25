import { IOpenAPI3ObjectSchema } from './object-schema';

export interface IOpenAPI3DiscriminatorSchema extends IOpenAPI3ObjectSchema {
    discriminator: {
        propertyName: string;
        mapping: {
            [key: string]: string;
        };
    };
}
