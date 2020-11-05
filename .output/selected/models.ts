import { Guid } from './Guid';
import { toDateIn, toDateOut } from './date-converters';
// #region Enums

// #endregion
// #region Models
export class Category {
  public name: string = undefined;

  private __category: string;

  public static toDTO(model: Partial<Category>): ICategory {
    return {
      name: model.name
    };
  }

  public static fromDTO(dto: ICategory): Category {
    const result = new Category();

    result.name = dto.name;

    return result;
  }
}

export class Product {
  public id: Guid = undefined;

  public name: string = undefined;

  public expireDate: Date = undefined;

  public category: Category = undefined;

  private __product: string;

  public static toDTO(model: Partial<Product>): IProduct {
    return {
      id: model.id ? model.id.toString() : Guid.empty.toString(),
      name: model.name,
      expireDate: toDateOut(model.expireDate),
      category: model.category ? Category.toDTO(model.category) : undefined
    };
  }

  public static fromDTO(dto: IProduct): Product {
    const result = new Product();

    result.id = new Guid(dto.id);
    result.name = dto.name;
    result.expireDate = toDateIn(dto.expireDate);
    result.category = dto.category ? Category.fromDTO(dto.category) : undefined;

    return result;
  }
}

// #endregion
// #region Interfaces
export interface ICategory {
  name: string;
}

export interface IProduct {
  id: string;

  name: string;

  expireDate: string;

  category: ICategory;
}

// #endregion
