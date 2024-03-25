import { Guid } from './Guid';
import { toDateIn, toDateOut } from './date-converters';
import type * as $types from './types';

export enum CategoryUnionTypes {
    CategoryElectronicsDto = '1',
    CategoryMotorsDto = '2'
}

export enum ProductStatus {
    InStock = 0,
    OutOfStock = -1,
    UnderTheOrder = 1
}

interface ICategoryElectronicsDtoBaseInterface {
    syntheticTest: $types.TypeOrUndefinedNullable<number>;
}

interface ICategoryMotorsDtoBaseInterface {
    volume: $types.TypeOrUndefinedNullable<number>;
}

export interface ICategory {
    name: $types.TypeOrUndefinedNullable<string>;
    type: $types.TypeOrUndefined<string>;
}

export type ICategoryElectronicsDto = ICategoryElectronicsDtoBaseInterface & ICategory;
export type ICategoryMotorsDto = ICategoryMotorsDtoBaseInterface & ICategory;

export interface IProduct {
    categories: $types.TypeOrUndefinedNullable<ICategory[]>;
    category: $types.TypeOrUndefinedNullable<ICategory>;
    colors: $types.TypeOrUndefined<string[]>;
    expireDate: $types.TypeOrUndefined<string>;
    externalId: $types.TypeOrUndefinedNullable<string>;
    id: $types.TypeOrUndefined<string>;
    modifyDates: $types.TypeOrUndefined<string[]>;
    name: $types.TypeOrUndefinedNullable<string>;
    status: $types.TypeOrUndefined<ProductStatus>;
}

export interface IProductIdentityDTO {
    id: $types.TypeOrUndefined<string>;
}

export type CategoryUnion = Category | CategoryElectronicsDto | CategoryMotorsDto;
export type ICategoryUnion = ICategory | ICategoryElectronicsDto | ICategoryMotorsDto;

export class CategoryUnionClass {
    public static fromDTO(dto: ICategoryUnion): CategoryUnion {
        if (this.isCategoryElectronicsDto(dto)) {
            return CategoryElectronicsDto.fromDTO(dto);
        }
        if (this.isCategoryMotorsDto(dto)) {
            return CategoryMotorsDto.fromDTO(dto);
        }
        return Category.fromDTO(dto);
    }

    public static toDTO(model: CategoryUnion): ICategoryUnion {
        if (this.isICategoryElectronicsDto(model)) {
            return CategoryElectronicsDto.toDTO(model);
        }
        if (this.isICategoryMotorsDto(model)) {
            return CategoryMotorsDto.toDTO(model);
        }
        return Category.toDTO(model);
    }

    private static isCategoryElectronicsDto(dto: ICategoryUnion): dto is ICategoryElectronicsDto {
        return dto.type === CategoryUnionTypes.CategoryElectronicsDto;
    }

    private static isCategoryMotorsDto(dto: ICategoryUnion): dto is ICategoryMotorsDto {
        return dto.type === CategoryUnionTypes.CategoryMotorsDto;
    }

    private static isICategoryElectronicsDto(dto: CategoryUnion): dto is CategoryElectronicsDto {
        return dto.type === CategoryUnionTypes.CategoryElectronicsDto;
    }

    private static isICategoryMotorsDto(dto: CategoryUnion): dto is CategoryMotorsDto {
        return dto.type === CategoryUnionTypes.CategoryMotorsDto;
    }
}

export class ProductIdentityDTO {
    public id: Guid;
    private __productIdentityDTO!: string;

    constructor(id?: $types.TypeOrUndefined<Guid | string>) {
        this.id = new Guid(id);
    }

    public static toDTO(id: Guid): IProductIdentityDTO {
        return { id: id.toString() };
    }
}

export class Category {
    public name: $types.TypeOrUndefinedNullable<string> = undefined;
    public type: $types.TypeOrUndefined<string> = undefined;
    private __category!: string;

    public static toDTO(model: Partial<Category>): ICategory {
        return {
            name: model.name,
            type: model.type,
        };
    }

    public static fromDTO(dto: ICategory): Category {
        const model = new Category();
        model.name = dto.name;
        model.type = dto.type;
        return model;
    }
}

export class CategoryElectronicsDto {
    public name: $types.TypeOrUndefinedNullable<string> = undefined;
    public type: $types.TypeOrUndefined<string> = undefined;
    public syntheticTest: $types.TypeOrUndefinedNullable<number> = undefined;
    private __categoryElectronicsDto!: string;

    public static toDTO(model: Partial<CategoryElectronicsDto>): ICategoryElectronicsDto {
        return {
            syntheticTest: model.syntheticTest,
            name: model.name,
            type: model.type,
        };
    }

    public static fromDTO(dto: ICategoryElectronicsDto): CategoryElectronicsDto {
        const model = new CategoryElectronicsDto();
        model.syntheticTest = dto.syntheticTest;
        model.name = dto.name;
        model.type = dto.type;
        return model;
    }
}

export class CategoryMotorsDto {
    public name: $types.TypeOrUndefinedNullable<string> = undefined;
    public type: $types.TypeOrUndefined<string> = undefined;
    public volume: $types.TypeOrUndefinedNullable<number> = undefined;
    private __categoryMotorsDto!: string;

    public static toDTO(model: Partial<CategoryMotorsDto>): ICategoryMotorsDto {
        return {
            volume: model.volume,
            name: model.name,
            type: model.type,
        };
    }

    public static fromDTO(dto: ICategoryMotorsDto): CategoryMotorsDto {
        const model = new CategoryMotorsDto();
        model.volume = dto.volume;
        model.name = dto.name;
        model.type = dto.type;
        return model;
    }
}

export class Product {
    public categories: CategoryUnionClass[] = [];
    public category: $types.TypeOrUndefinedNullable<CategoryUnionClass> = undefined;
    public colors: string[] = [];
    public expireDate: $types.TypeOrUndefined<Date> = undefined;
    public externalId: $types.TypeOrUndefinedNullable<Guid> = undefined;
    public id: $types.TypeOrUndefined<Guid> = undefined;
    public modifyDates: Date[] = [];
    public name: $types.TypeOrUndefinedNullable<string> = undefined;
    public status: $types.TypeOrUndefined<ProductStatus> = undefined;
    private __product!: string;

    public static toDTO(model: Partial<Product>): IProduct {
        return {
            categories: model.categories ? model.categories.map(x => Category.toDTO(x)) : undefined,
            category: model.category ? Category.toDTO(model.category) : undefined,
            colors: model.colors,
            expireDate: toDateOut(model.expireDate),
            externalId: model.externalId ? model.externalId.toString() : null,
            id: model.id ? model.id.toString() : Guid.empty.toString(),
            modifyDates: model.modifyDates ? model.modifyDates.map(toDateOut) : undefined,
            name: model.name,
            status: model.status,
        };
    }

    public static fromDTO(dto: IProduct): Product {
        const model = new Product();
        model.categories = dto.categories ? dto.categories.map(x => Category.fromDTO(x)) : [];
        model.category = dto.category ? Category.fromDTO(dto.category) : undefined;
        model.colors = dto.colors ? dto.colors : [];
        model.expireDate = toDateIn(dto.expireDate);
        model.externalId = dto.externalId ? new Guid(dto.externalId) : null;
        model.id = new Guid(dto.id);
        model.modifyDates = dto.modifyDates ? dto.modifyDates.map(toDateIn) : [];
        model.name = dto.name;
        model.status = dto.status;
        return model;
    }
}
