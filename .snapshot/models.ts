import { Guid } from './Guid';
import { toDateIn, toDateOut } from './date-converters';

export enum ProductStatus {
    InStock = 0,
    OutOfStock = -1,
    UnderTheOrder = 1
}

export interface ICategory {
    name: string;
}

export interface IProduct {
    category: ICategory;
    expireDate: string;
    id: string;
    name: string;
    status: ProductStatus;
}

export class Category {
    public name: string = undefined;
    private __category: string;

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
    public category: Category = undefined;
    public expireDate: Date = undefined;
    public id: Guid = undefined;
    public name: string = undefined;
    public status: ProductStatus = undefined;
    private __product: string;

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
