import { first } from "./utils";

export interface IMethodMeta {
    parameters?: IMethodParamMeta[];
    tags: string[];
    responses: {
        200: {
            description?: 'Success';
            content: {
                'application/json': {
                    schema?: ICollectionSchema | ISingleSchema;
                };
                'application/octet-stream': {
                    schema: IDownloadSchema;
                }
            };
        }
    };

    requestBody: {
        content: {
            'application/json': {
                schema?: ICollectionSchema | ISingleSchema;
            }
        }
    }
}

export interface IMethodParamMeta {
    name: string;
    in: 'query' | 'body';
    required: boolean;
    enum?: number[]; // TODO: 
    format?: 'uuid' | 'date-time'; // TODO: 
    schema?: ISingleSchema | ITypeDefinitionBase;
}

export interface ISingleSchema {
    /**
     * @example "#/definitions/AccidentPlanSimpleDTO";
     */
    $ref: string;
}

export interface ICollectionSchema {
    type?: 'array';
    items: ISingleSchema;
}

export interface IDownloadSchema {
    type: 'string';
    format: 'binary';
}

export interface ISimpleCollectionSchema {
    type?: 'array';
    items: SimplePropertyType;
}


export interface ISwaggerMeta {
    paths: {
        [key: string]: ISwaggerPathMethodMeta; // TODO:
    };
    components: {
        schemas: {
            [entityName: string]: TypeDefinition; // TODO:
        }
    };
}

export interface ISwaggerPathMethodMeta {
    post?: IMethodMeta;
    get?: IMethodMeta;
    delete?: IMethodMeta;
    put?: IMethodMeta;
}

export interface ITypeDefinitionBase {
    type?: string;
    nullable?: boolean;
}

export interface IEnumDefinition extends ITypeDefinitionBase {
    enum: number[];
    format: 'int32';
    type: 'integer';
    'x-enumNames': string[];
}

export interface IObjectDefinition extends ITypeDefinitionBase {
    type: 'object';
    properties: {
        [propertyName: string]: PropertyType;
    }
}

export type ArrayProperty = ICollectionSchema;
export interface IRefProperty extends ITypeDefinitionBase {
    $ref: string;
}

export interface IDateProperty extends ITypeDefinitionBase {
    format: 'date-time';
    type: 'string';
}

export interface IStringProperty extends ITypeDefinitionBase {
    type: 'string';
}

export interface INumberProperty extends ITypeDefinitionBase {
    type: 'integer' | 'number';
}
export interface IBooleanProperty extends ITypeDefinitionBase {
    type: 'boolean';
}
export interface IGuidProperty extends ITypeDefinitionBase {
    format: 'uuid';
    type: 'string';
}

export interface IAllOfRefProperty extends ITypeDefinitionBase {
    allOf: IRefProperty[];
}

export type PropertyType =
    SimplePropertyType |
    ArrayProperty |
    IRefProperty |
    IAllOfRefProperty;

export type SimplePropertyType =
    IBooleanProperty |
    IStringProperty |
    INumberProperty |
    IGuidProperty |
    IDateProperty;

export type TypeDefinition = IObjectDefinition | IEnumDefinition;

export function isObjectDefinition(x: TypeDefinition): x is IObjectDefinition {
    if (!x) {
        return false;
    }

    return (x as IObjectDefinition).type === 'object';
}

export function isIdentity(x: IObjectDefinition): boolean {
    if (!x) {
        return false;
    }

    const properties = Object.entries(x.properties);
    if (properties.length !== 1) {
        return false;
    }

    const [name, propertyType] = first(properties);
    const guidProperty = propertyType as IGuidProperty;
    return name === "id" && guidProperty.type === 'string' && guidProperty.format === 'uuid';
}

export type SchemaType = ISingleSchema | ISimpleCollectionSchema | ICollectionSchema | IDownloadSchema | PropertyType;

export interface IRouteMeta {
    controller: string;
    actionPart: string;
    full: string;
}
