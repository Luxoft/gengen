import { Guid } from './Guid';
import { toDateIn, toDateOut } from './date-converters';
import type * as $types from './types';

export enum ProductStatus {
    InStock = 0,
    OutOfStock = -1,
    UnderTheOrder = 1
}

export interface ICategory {
    name: $types.TypeOrUndefined<string>;
}

export interface IProduct {
    category: $types.TypeOrUndefined<ICategory>;
    expireDate: $types.TypeOrUndefined<string>;
    id: $types.TypeOrUndefined<string>;
    name: $types.TypeOrUndefined<string>;
    status: $types.TypeOrUndefined<ProductStatus>;
}

export class Category {
    public name: $types.TypeOrUndefined<string> = undefined;
    private __category!: string;

    public static toDTO(model: Partial<Category>): ICategory {
        return {
            name: model.name,
        };
    }

    public static fromDTO(dto: ICategory): Category {
        const model = new Category();
        model.name = dto.name;
        return model;
    }
}

export class Product {
    public category: $types.TypeOrUndefined<Category> = undefined;
    public expireDate: $types.TypeOrUndefined<Date> = undefined;
    public id: $types.TypeOrUndefined<Guid> = undefined;
    public name: $types.TypeOrUndefined<string> = undefined;
    public status: $types.TypeOrUndefined<ProductStatus> = undefined;
    private __product!: string;

    public static toDTO(model: Partial<Product>): IProduct {
        return {
            category: model.category ? Category.toDTO(model.category) : undefined,
            expireDate: toDateOut(model.expireDate),
            id: model.id ? model.id.toString() : Guid.empty.toString(),
            name: model.name,
            status: model.status,
        };
    }

    public static fromDTO(dto: IProduct): Product {
        const model = new Product();
        model.category = dto.category ? Category.fromDTO(dto.category) : undefined;
        model.expireDate = toDateIn(dto.expireDate);
        model.id = new Guid(dto.id);
        model.name = dto.name;
        model.status = dto.status;
        return model;
    }
}
