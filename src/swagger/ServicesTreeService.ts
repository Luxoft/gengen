import { SQUARE_BRACKETS, TEMPLATE_MODEL_PREFIX } from './consts';
import { isCollectionSchema, isDownloadSchema, isPropertyType, isRefType, isSimpleCollectionSchema } from './guards';
import {
    HttpMethod,
    ITemplateMethodDescription,
    ITemplatePropertyDescriptor,
    ITemplateServiceDescription,
} from './template-types';
import {
    ICollectionSchema,
    IMethodMeta,
    IMethodParamMeta,
    IRefProperty,
    ISwaggerMeta,
    ISwaggerPathMethodMeta,
    ITypeDefinitionBase,
    SchemaType,
    SimplePropertyType,
} from './types';
import { TypesService } from './TypesService';
import { distinct, first, lowerFirst } from './utils';

interface IServicesTree {
    service: string;
    methods: string[];
}

interface IMethodDescriptor {
    path: string;
    descriptor: ISwaggerPathMethodMeta;
}

export class ServicesTreeService {
    constructor(
        private meta: ISwaggerMeta,
        private typesService: TypesService) {
    }

    public getServicesList(methodList: Set<string>): ITemplateServiceDescription[] {
        return this.getServicesTree(Array.from(methodList))
            .map(z => {
                const methods = this.getMethods(z, methodList);

                return {
                    name: z.service,
                    path: this.getServicePath(z.service),
                    methods,
                    hasDownloadMethods: methods.some(z => z.isDownload)
                };
            });
    }

    private getServicePath(name: string): string {
        const pathes = distinct(
            Object.entries(this.meta.paths)
                .filter(([_, pathMeta]) => {
                    const tags = pathMeta.get?.tags ?? pathMeta.post?.tags ?? [];
                    return tags.includes(name);
                })
                .map(([path]) => first(path.split(name)))
        );

        if (pathes.length !== 1) {
            //TODO Add support for multi version controllers
            throw new Error(`Cannot detect controller relative path (${name}). Found pathes: ${pathes.join()}`)
        }

        return pathes[0] + name;
    }

    private getServicesTree(methodList: string[]): IServicesTree[] {
        return methodList
            .map((entry) => entry.split('/'))
            .reduce<IServicesTree[]>((store, [service, method]) => {
                if (!service || !method) {
                    // TODO: handle paths without controllers ?
                    console.warn(`Can't find method or service for ${service} ${method}`)
                    return store;
                }

                const index = store.findIndex((x) => x.service === service);
                if (index === -1) {
                    store.push({
                        service,
                        methods: [method],
                    });
                } else {
                    store[index].methods.push(method);
                }
                return store;
            }, []);
    }

    private getEnumDescriptor = (param: IMethodParamMeta): ITemplatePropertyDescriptor | null => {
        const schema = (param.schema as IRefProperty);
        const descriptor = (schema && schema.$ref && this.typesService.isEnum(schema.$ref))
            ? this.typesService.getTypeNames(param.name, schema)
            : null;
        if (descriptor) {
            descriptor.typeNameDto = `${TEMPLATE_MODEL_PREFIX}${descriptor.typeNameDto}`;
        }
        return descriptor;
    }

    private mapParams = (param: IMethodParamMeta) => {
        const descriptor = (isPropertyType(param.schema as SimplePropertyType))
            ? this.typesService.getSimpleTypeDescriptor(param.schema as SimplePropertyType, param.name)
            : this.getEnumDescriptor(param);

        if (!descriptor) {
            throw new Error('Only simple and enum types can be used as query parameters.');
        }

        return {
            name: descriptor.name,
            type: descriptor.typeNameDto,
        };
    }

    private getMethods(item: IServicesTree, methodList: Set<string>): ITemplateMethodDescription[] {
        const methodDescriptors = this.getMethodDescriptors(this.meta, methodList)
        return item.methods.map((methodName) =>
            this.getTemplateMethodDescriptor(item, methodName, methodDescriptors))
            .filter(x => x) as ITemplateMethodDescription[];
    }

    private getTemplateMethodDescriptor(item: IServicesTree, methodName: string, methodDescriptors: IMethodDescriptor[]): ITemplateMethodDescription | null {
        const descriptorObject = methodDescriptors.find(({ path }) => path === `${item.service}/${methodName}`)!;
        if (!descriptorObject) {
            console.warn(`Path is not supported yet ${item.service} ${methodName}`);
            return null;
        }

        const descriptor: ISwaggerPathMethodMeta = descriptorObject.descriptor;
        const data: [string, IMethodMeta] = Object.entries(descriptor)[0];
        const httpMethod = data[0] as HttpMethod;
        const methodMeta = data[1];
        let schema: SchemaType | undefined = undefined;
        let isCollection = false;
        let resultModel: string = 'void';
        schema = this.typesService.getSchema(methodMeta.responses[200]);
        isCollection = Boolean(schema && isCollectionSchema(schema));
        let isPrimitive = false;
        let isEnum = false;
        let isIdentity = false;
        let isDownload = false;

        if (schema) {
            if (isDownloadSchema(schema)) {
                isDownload = true;
            } else if (isCollectionSchema(schema)) {
                const ref = schema.items.$ref;
                isEnum = this.typesService.isEnum(ref);
                isIdentity = this.typesService.isIdentity(ref);
                resultModel = this.typesService.getTypeNameFromRef(ref);
            } else if (isSimpleCollectionSchema(schema)) {
                isCollection = true;
                isPrimitive = true;
                resultModel = this.typesService.getSimpleTypeDescriptor(schema.items).typeName;
            } else if (isRefType(schema)) {
                isEnum = this.typesService.isEnum(schema.$ref);
                isIdentity = this.typesService.isIdentity(schema.$ref);
                resultModel = this.typesService.getTypeNameFromRef(schema.$ref);
            } else if (isPropertyType(schema)) {
                resultModel = this.typesService.getSimpleTypeDescriptor(schema as SimplePropertyType).typeName;
                isPrimitive = true;
            }
        } else {
            isPrimitive = true;
        }

        const { queryParams, queryString } = this.getQueryParams(methodMeta);

        const result = this.getResultTypeNames({ resultModel, isPrimitive, isEnum });

        return {
            isEnum,
            isPrimitive,
            isIdentity,
            isDownload,
            name: lowerFirst(methodName),
            httpMethod: httpMethod as HttpMethod,
            isCollection,
            params: this.getParams(methodMeta),
            queryParams,
            queryString,
            resultDto: result.resultDto,
            resultModel: result.resultModel,
            resultDtoString: isCollection ? `${result.resultDto}[]` : result.resultDto,
            resultModelString: isCollection ? `${result.resultModel}[]` : result.resultModel,
        };
    }

    private getResultTypeNames(
        { resultModel, isPrimitive, isEnum }: { resultModel: string; isPrimitive: boolean; isEnum: boolean }
    ): { resultDto: string, resultModel: string } {
        if (resultModel === 'void') {
            return {
                resultDto: 'void',
                resultModel: 'void',
            };
        }

        if (isEnum) {
            return {
                resultDto: `${TEMPLATE_MODEL_PREFIX}${resultModel}`,
                resultModel: `${TEMPLATE_MODEL_PREFIX}${resultModel}`
            };
        }

        const resultTypeModel = isPrimitive ? resultModel : `${TEMPLATE_MODEL_PREFIX}${resultModel}`;
        const resultTypeDto = isPrimitive ? resultModel : `${TEMPLATE_MODEL_PREFIX}${this.typesService.getInterfaceName(resultModel)}`;
        return {
            resultDto: resultTypeDto,
            resultModel: resultTypeModel,
        };
    }

    public getQueryParams(methodMeta: IMethodMeta): { queryParams: { name: string, type: string }[], queryString: string } {
        const params = methodMeta.parameters ?
            methodMeta
                .parameters
                .filter(x => x.in === 'query') :
            [];
        if (!params.length) {
            return {
                queryParams: [],
                queryString: '',
            };
        }

        return {
            queryParams: params.map(this.mapParams),
            queryString: this.createQueryString(params),
        };
    }

    private getParams(methodMeta: IMethodMeta): { name: string; type: string; }[] {
        const bodyScheme = this.typesService.getSchema(methodMeta.requestBody);
        if (!bodyScheme) {
            return [];
        }

        const isCollection = isCollectionSchema(bodyScheme);
        const ref = (isCollection)
            ? (bodyScheme as ICollectionSchema).items.$ref
            : (bodyScheme as IRefProperty).$ref;
        const typeName = this.typesService.getTypeNameFromRef(ref);

        return [
            {
                name: lowerFirst(typeName),
                type: `${TEMPLATE_MODEL_PREFIX}I${typeName}${(isCollection ? SQUARE_BRACKETS : '')}`
            }
        ];
    }

    private getMethodDescriptors(meta: ISwaggerMeta, methodList: Set<string>): IMethodDescriptor[] {
        const paths = Object
            .entries(meta.paths)
            .filter(z => methodList.has(this.typesService.getRouteInfo(z).full));

        return paths.map(([path, descriptor]) => {
            return {
                path: this.typesService.getRouteInfo([path, descriptor]).full,
                descriptor
            };
        });
    }

    private createQueryString(params: IMethodParamMeta[]): string {
        if (!params.length) {
            return '';
        }

        const result = params.map((x) => {
            const type = (x.schema as ITypeDefinitionBase).type;
            if (type === 'string' && x.format === 'date-time') {
                return `${x.name}=\${toDateOut(${x.name})}`;
            } else {
                return `${x.name}=\${encodeURIComponent(${x.name})}`;
            }
        });

        return '?' + result.join('&');
    }
}
