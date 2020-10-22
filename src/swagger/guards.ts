import { IAllOfRefProperty, ICollectionSchema, IDownloadSchema, IRefProperty, ISimpleCollectionSchema, PropertyType, SchemaType } from './types';

export function isCollectionSchema(x: SchemaType): x is ICollectionSchema {
    return (
        (x as ICollectionSchema).type === 'array' &&
        Boolean((x as ICollectionSchema).items.$ref)
    );
}

export function isDownloadSchema(x: SchemaType): x is IDownloadSchema {
    return (x as IDownloadSchema)?.format === 'binary'
}

export function isSimpleCollectionSchema(x: SchemaType): x is ISimpleCollectionSchema {
    return (x as ICollectionSchema).type === 'array' && !isCollectionSchema(x);
}

export function isPropertyType(x: SchemaType): x is PropertyType {
    return Boolean((x as PropertyType).type);
}

export function isRefType(value: SchemaType): value is IRefProperty {
    return Boolean((value as IRefProperty).$ref);
}

export function isAllOfRefType(value: PropertyType): value is IAllOfRefProperty {
    return (value as IAllOfRefProperty).allOf !== undefined;
}