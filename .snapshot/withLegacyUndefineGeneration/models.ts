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

export type CategoryUnion = Category | CategoryElectronicsDto | CategoryMotorsDto;
export type ICategoryUnion = ICategory | ICategoryElectronicsDto | ICategoryMotorsDto;

export interface ICategory {
    name: $types.TypeOrUndefinedNullable<string>;
    type: $types.TypeOrUndefined<string>;
}

interface ICategoryElectronicsDtoBaseInterface {
    syntheticTest: $types.TypeOrUndefinedNullable<number>;
}

export type ICategoryElectronicsDto = ICategoryElectronicsDtoBaseInterface & ICategory;

interface ICategoryMotorsDtoBaseInterface {
    volume: $types.TypeOrUndefinedNullable<number>;
}

export type ICategoryMotorsDto = ICategoryMotorsDtoBaseInterface & ICategory;

export interface IProduct {
    categories: $types.TypeOrUndefined<ICategoryUnion[]>;
    category: $types.TypeOrUndefined<ICategoryUnion>;
    colors: $types.TypeOrUndefined<string[]>;
    expireDate: $types.TypeOrUndefined<string>;
    externalId: $types.TypeOrUndefinedNullable<string>;
    id: $types.TypeOrUndefined<string>;
    modifyDates: $types.TypeOrUndefined<string[]>;
    name: $types.TypeOrUndefinedNullable<string>;
    parentProduct: $types.TypeOrUndefinedNullable<IProduct>;
    status: $types.TypeOrUndefined<ProductStatus>;
}

export interface IProductIdentityDTO {
    id: $types.TypeOrUndefined<string>;
}

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
    public name: $types.TypeOrUndefinedNullable<string>;
    public type: $types.TypeOrUndefined<string>;
    private __category!: string;

    protected constructor(dto: ICategory) {
        this.name = dto.name;
        this.type = dto.type;
    }

    public static toDTO(model: Partial<Category>): ICategory {
        return {
            name: model.name,
            type: model.type,
        };
    }

    public static fromDTO(dto: ICategory): Category {
        return new Category(dto);
    }
}

export class CategoryElectronicsDto {
    public name: $types.TypeOrUndefinedNullable<string>;
    public type: $types.TypeOrUndefined<string>;
    public syntheticTest: $types.TypeOrUndefinedNullable<number>;
    private __categoryElectronicsDto!: string;

    protected constructor(dto: ICategoryElectronicsDto) {
        this.syntheticTest = dto.syntheticTest;
        this.name = dto.name;
        this.type = dto.type;
    }

    public static toDTO(model: Partial<CategoryElectronicsDto>): ICategoryElectronicsDto {
        return {
            syntheticTest: model.syntheticTest,
            name: model.name,
            type: model.type,
        };
    }

    public static fromDTO(dto: ICategoryElectronicsDto): CategoryElectronicsDto {
        return new CategoryElectronicsDto(dto);
    }
}

export class CategoryMotorsDto {
    public name: $types.TypeOrUndefinedNullable<string>;
    public type: $types.TypeOrUndefined<string>;
    public volume: $types.TypeOrUndefinedNullable<number>;
    private __categoryMotorsDto!: string;

    protected constructor(dto: ICategoryMotorsDto) {
        this.volume = dto.volume;
        this.name = dto.name;
        this.type = dto.type;
    }

    public static toDTO(model: Partial<CategoryMotorsDto>): ICategoryMotorsDto {
        return {
            volume: model.volume,
            name: model.name,
            type: model.type,
        };
    }

    public static fromDTO(dto: ICategoryMotorsDto): CategoryMotorsDto {
        return new CategoryMotorsDto(dto);
    }
}

export class Product {
    public categories: CategoryUnion[];
    public category: $types.TypeOrUndefined<CategoryUnion>;
    public colors: string[];
    public expireDate: $types.TypeOrUndefined<Date>;
    public externalId: $types.TypeOrUndefinedNullable<Guid>;
    public id: $types.TypeOrUndefined<Guid>;
    public modifyDates: Date[];
    public name: $types.TypeOrUndefinedNullable<string>;
    public parentProduct: $types.TypeOrUndefinedNullable<Product>;
    public status: $types.TypeOrUndefined<ProductStatus>;
    private __product!: string;

    protected constructor(dto: IProduct) {
        this.categories = dto.categories ? dto.categories.map(x => CategoryUnionClass.fromDTO(x)) : [];
        this.category = dto.category ? CategoryUnionClass.fromDTO(dto.category) : undefined;
        this.colors = dto.colors ? dto.colors : [];
        this.expireDate = toDateIn(dto.expireDate);
        this.externalId = dto.externalId ? new Guid(dto.externalId) : null;
        this.id = new Guid(dto.id);
        this.modifyDates = dto.modifyDates ? dto.modifyDates.map(toDateIn) : [];
        this.name = dto.name;
        this.parentProduct = dto.parentProduct ? Product.fromDTO(dto.parentProduct) : undefined;
        this.status = dto.status;
    }

    public static toDTO(model: Partial<Product>): IProduct {
        return {
            categories: model.categories ? model.categories.map(x => CategoryUnionClass.toDTO(x)) : undefined,
            category: model.category ? CategoryUnionClass.toDTO(model.category) : undefined,
            colors: model.colors,
            expireDate: toDateOut(model.expireDate),
            externalId: model.externalId ? model.externalId.toString() : null,
            id: model.id ? model.id.toString() : Guid.empty.toString(),
            modifyDates: model.modifyDates ? model.modifyDates.map(toDateOut) : undefined,
            name: model.name,
            parentProduct: model.parentProduct ? Product.toDTO(model.parentProduct) : undefined,
            status: model.status,
        };
    }

    public static fromDTO(dto: IProduct): Product {
        return new Product(dto);
    }
}
