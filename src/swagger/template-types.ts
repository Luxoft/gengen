export type HttpMethod = 'post' | 'put' | 'get' | 'delete';

export interface ITemplateMethodDescription {
    name: string;
    isPrimitive: boolean;
    isDownload: boolean;
    isEnum: boolean;
    isIdentity: boolean;
    params: { name: string, type: string; }[];
    queryParams: { name: string, type: string; }[];
    queryString?: string;
    isCollection: boolean;
    httpMethod: HttpMethod;
    resultDto: string;
    resultDtoString: string;
    resultModel: string;
    resultModelString: string;
}

export interface ITemplateServiceDescription {
    name: string;

    path: string;

    hasDownloadMethods: boolean;

    methods: ITemplateMethodDescription[];
}

export interface ITemplateTypeDescriptor {
    isOut: boolean;
    isIn: boolean;
    isIdentity: boolean;
    name: string;
    properties: ITemplatePropertyDescriptor[];
}

export interface ITemplateEnumDescriptor {
    name: string;
    data: { key: string; value: number }[];
}

export interface ITemplatePropertyDescriptor {
    name: string;
    typeNameDto: string;
    typeName: string;
    isDate?: boolean;
    isObject?: boolean;
    isArray?: boolean;
    isEnum?: boolean;
    isGuid?: boolean;
    isNullable?: boolean;
    isIdentity?: boolean;
}
