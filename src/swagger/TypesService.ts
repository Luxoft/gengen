import { isAllOfRefType, isCollectionSchema, isRefType, isSimpleCollectionSchema } from './guards';
import { ITemplatePropertyDescriptor } from './template-types';
import {
    IDateProperty,
    IEnumDefinition,
    IGuidProperty,
    IMethodMeta,
    isIdentity,
    isObjectDefinition,
    ISwaggerMeta,
    PropertyType,
    SchemaType,
    SimplePropertyType,
    TypeDefinition,
} from './types';
import { last } from './utils';

export class TypesService {
    constructor(private meta: ISwaggerMeta) {

    }

    /**
     * @description Only json methods for now
     */
    public getSchema(body: IMethodMeta['responses'][200] | IMethodMeta['requestBody']): SchemaType | undefined {
        if (!body || !body.content) {
            return undefined;
        }

        if (body.content['application/json']) {
            return body.content['application/json'].schema;
        }

        const bodyAsResponse = body as IMethodMeta['responses'][200];
        if (bodyAsResponse.content['application/octet-stream']) {
            return bodyAsResponse.content['application/octet-stream'].schema;
        }

        return undefined;
    }

    public getTypeNames(name: string, propType: PropertyType): ITemplatePropertyDescriptor {
        if (isRefType(propType)) {
            return this.createRefPropertyTemplateDescriptor(name, propType.$ref);
        }

        if (isCollectionSchema(propType)) {
            return {
                ...this.createRefPropertyTemplateDescriptor(name, propType.items.$ref),
                isArray: true,
            };
        } else if (isSimpleCollectionSchema(propType)) {
            return {
                ...this.getSimpleTypeDescriptor(propType.items, name),
                isArray: true,
            };
        } else if (isAllOfRefType(propType)) {
            return this.createRefPropertyTemplateDescriptor(name, propType.allOf[0].$ref);
        }

        return this.getSimpleTypeDescriptor(propType, name);
    }

    public getTypeDefinitionByRef(ref: string): { definition: TypeDefinition, typeName: string } {
        const { typeName, typeNameFull } = this.getTypeNamesDescriptorFromRef(ref);
        return {
            typeName,
            definition: this.getTypeDefinition(typeNameFull)
        };
    }

    /**
     * @param $ref - something "#/components/schemas/ProjectPassport.Generated.DTO.VisualEmployeeProjectionDTO"
     */
    public getTypeNameFromRef($ref: string): string {
        return this.getTypeNamesDescriptorFromRef($ref).typeName;
    }

    public isEnum($ref: string): boolean {
        const typeDefinition = this.getTypeDefinitionByRef($ref).definition;
        return Boolean((typeDefinition as IEnumDefinition).enum);
    }

    public isIdentity($ref: string): boolean {
        const typeDefinition = this.getTypeDefinitionByRef($ref).definition;
        if (isObjectDefinition(typeDefinition)) {
            return isIdentity(typeDefinition);
        }

        return false;
    }

    public getTypeNamesDescriptorFromRef($ref: string): { typeNameFull: string, typeName: string } {
        const typeNameFull = last($ref.split('/'));
        const typeName = last(typeNameFull.split('.'));

        return {
            typeName,
            typeNameFull,
        };
    }

    public getInterfaceName(typeName: string): string {
        return `I${typeName}`;
    }

    public getSimpleTypeDescriptor(propType: SimplePropertyType, name: string = ''): ITemplatePropertyDescriptor {
        switch (propType.type) {
            case 'boolean':
                return {
                    name,
                    typeNameDto: 'boolean',
                    typeName: 'boolean',
                };
            case 'integer':
            case 'number':
                return {
                    name,
                    typeNameDto: 'number',
                    typeName: 'number',
                };
            case 'string':
                if ((propType as IDateProperty).format === 'date-time') {
                    return {
                        name,
                        typeNameDto: 'string',
                        typeName: 'Date',
                        isDate: true,
                    }
                } else if ((propType as IGuidProperty).format === 'uuid') {
                    return {
                        name,
                        typeName: 'Guid',
                        typeNameDto: 'string',
                        isGuid: true,
                        isNullable: propType.nullable
                    }
                } else {
                    return {
                        name,
                        typeNameDto: 'string',
                        typeName: 'string',
                    };
                }
        }
    }

    private createRefPropertyTemplateDescriptor(name: string, ref: string): ITemplatePropertyDescriptor {
        const { typeName, definition } = this.getTypeDefinitionByRef(ref);
        if (isObjectDefinition(definition)) {
            return {
                name,
                typeNameDto: this.getInterfaceName(typeName),
                typeName: typeName,
                isObject: true,
                isIdentity: isIdentity(definition)
            };
        } else {
            return {
                name,
                typeNameDto: typeName,
                typeName: typeName,
                isEnum: true,
            };
        }
    }

    private getTypeDefinition(typeNameFull: string): TypeDefinition {
        return this.meta.components.schemas[typeNameFull];
    }
}
