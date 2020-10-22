import { IGNORE_PROPERTIES, PATH_PREFIX } from './consts';
import { isCollectionSchema, isRefType } from './guards';
import { ITemplateEnumDescriptor, ITemplatePropertyDescriptor, ITemplateTypeDescriptor } from './template-types';
import { ICollectionSchema, IMethodMeta, ISingleSchema, isObjectDefinition, ISwaggerMeta, SchemaType } from './types';
import { TypesService } from './TypesService';
import { first } from './utils';

export class ModelsService {
    constructor(
        private meta: ISwaggerMeta,
        private types: TypesService) {

    }

    public getTypesByMethodList(methodList: Set<string>): { models: ITemplateTypeDescriptor[], enums: ITemplateEnumDescriptor[] } {
        const typeNames = this.getTypesNamesByMethodList(methodList);
        const { enums, models } = this.getTypesByTypeNameList(typeNames);
        return {
            enums: [...enums.values()],
            models: [...models.values()],
        };
    }

    private getTypesByTypeNameList(
        typeNames: string[],
        models: Map<string, ITemplateTypeDescriptor> = new Map<string, ITemplateTypeDescriptor>(),
        enums: Map<string, ITemplateEnumDescriptor> = new Map<string, ITemplateEnumDescriptor>(),
    ): { models: Map<string, ITemplateTypeDescriptor>, enums: Map<string, ITemplateEnumDescriptor> } {
        const meta = this.meta;


        typeNames.forEach((typeName) => {
            const item = meta.components.schemas[typeName];

            if (isObjectDefinition(item)) {
                const properties = item.properties ?
                    Object
                        .entries(item.properties)
                        .filter(([name]) => !IGNORE_PROPERTIES.includes(name))
                        .map(([name, prop]) => this.types.getTypeNames(name, prop))
                    : [];

                properties.forEach((prop) => {
                    if (prop.isObject || prop.isEnum) {
                        this.getTypesByTypeNameList([prop.typeName], models, enums);
                    }
                });

                models.set(typeName, {
                    isOut: this.isOut(typeName),
                    isIn: this.isIn(typeName),
                    isIdentity: this.isIdentity(properties),
                    name: typeName,
                    properties
                });
            } else {
                enums.set(typeName, {
                    name: typeName,
                    data: item.enum.map((value, index) => ({
                        key: item['x-enumNames'][index],
                        value,
                    }))
                });
            }
        });

        return {
            models,
            enums,
        };
    }

    private isOut(typeName: string): boolean {
        return true;
    }

    private isIn(typeName: string): boolean {
        return true;
    }

    private isIdentity(properties: ITemplatePropertyDescriptor[]): boolean {
        if (properties.length !== 1) {
            return false;
        }

        const descriptor = first(properties);
        return descriptor.name === 'id' && descriptor.typeName === 'Guid';
    }

    private getTypesNamesByMethodList(methodList: Set<string>): string[] {
        const meta = this.meta;
        const types = new Set<string>();

        const methodDescriptors =
            Object
                .entries(meta.paths)
                .filter(([path]) => {
                    return methodList.has(path.replace(PATH_PREFIX, ''))
                });

        methodDescriptors.forEach(([_, descriptor]) => {
            const meta = Object.values(descriptor)[0] as IMethodMeta;
            if (meta.parameters && meta.parameters.length) {
                meta.parameters.forEach(p => {
                    const parameterSchema = p.schema as ISingleSchema;
                    this.fillTypesFromScheme(parameterSchema, types);
                });
            }
            const requestSchema = this.types.getSchema(meta.requestBody);
            this.fillTypesFromScheme(requestSchema, types);
            const responseScheme = this.types.getSchema(meta.responses[200]);
            this.fillTypesFromScheme(responseScheme, types);
        });

        return Array.from(types);
    }


    private fillTypesFromScheme(scheme: SchemaType | undefined, typeNamesRef: Set<string>): void {
        if (!scheme) {
            return;
        }

        if (isCollectionSchema(scheme)) {
            this.fillObjectTypesFromRef((scheme.items as ISingleSchema).$ref, typeNamesRef);
        } else if (isRefType(scheme)) {
            this.fillObjectTypesFromRef(scheme.$ref, typeNamesRef);
        }
    }

    private fillObjectTypesFromRef(ref: string, typeNamesRef: Set<string>): void {
        const { definition, typeName } = this.types.getTypeDefinitionByRef(ref);
        typeNamesRef.add(typeName);

        if (definition.type === 'object' && definition.properties) {
            Object
                .values(definition.properties)
                .forEach((prop) => {
                    this.fillTypesFromScheme(prop as ICollectionSchema | ISingleSchema, typeNamesRef);
                });
        }
    }
}
