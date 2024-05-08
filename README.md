# GenGen

 [![NPM version](https://img.shields.io/npm/v/@luxbss/gengen.svg)](https://www.npmjs.com/package/@luxbss/gengen) [![license](https://img.shields.io/github/license/luxoft/gengen)](https://github.com/Luxoft/gengen/blob/master/LICENSE.txt) [![GitHub contributors](https://img.shields.io/github/contributors/luxoft/gengen)](https://github.com/Luxoft/gengen/graphs/contributors/)

This tool generates models and [Angular](https://angular.io/) services based on generated [Swagger JSON](https://swagger.io/specification/).

# Getting Started

First of all you make sure that swagger.json is accessable.

> Location by default is https://localhost:5001/swagger/v1/swagger.json. You can override it. See [all options](https://github.com/Luxoft/gengen#all-options)

### Generate all API

```shell
gengen g --all
```

### Generate a part of API

1. Initialize empty rule set

    ```shell
    gengen init
    ```

2. Generate list of available endpoints

    ```shell
    gengen g:c
    ```

3. Describe endpoints who will be generated

    ```ts
    import { Endpoints } from './endpoints';

    export default new Set([Endpoints.ProductService.GetProducts, Endpoints.CategoryService.AddCategory]);
    ```

4. Generate specified routes
    ```shell
    gengen g
    ```

### Options

| Option                 | Description                                                                                | Type    | Default value                                  |
|------------------------|--------------------------------------------------------------------------------------------|---------|------------------------------------------------|
| **all**                | Generate all                                                                               | boolean | false                                          |
| **url**                | Location of swagger.json                                                                   | string  | https://localhost:5001/swagger/v1/swagger.json |
| **file**               | Local path to swagger.json                                                                 | string  |                                                |
| **output**             | Output directory                                                                           | string  | ./src/generated                                |
| **configOutput**       | Output directory using in 'Generate a part of API' scenario                                | string  | ./.generated                                   |
| **aliasName**          | Specify prefix for generated filenames. [more info](#aliasName)                            | string  |                                                |
| **withRequestOptions** | Allows to pass http request options to generated methods. [more info](#withRequestOptions) | boolean | false                                          |
| **utilsRelativePath**  | Relative path to utils files. It may be useful when you have multiple generation sources   | string  |                                                |
| **unstrictId**         | Disable converting 'id' properties to strong Guid type. [more info](#unstrictId)           | boolean | false                                          |
| **truncateNamespace**  | Generate schema object name with truncating namespace [more info](#fixNamespace)           | boolean | false                                          |
| **joinNamespace**      | Join schema object name by dot [more info](#fixNamespace)                                  | boolean | false                                          |
|                        |

### Option details

#### aliasName

Alias provides:

1. Prefixes for model and service files
2. A way to specify dynamic basePath for services.

Example:

```shell
gengen --aliasName myalias
```

GenGen would create files myalias-models.ts, myalias-services.ts in _output_ directory. And we could override services basePath with following code

```ts
window.__gengen__basePathMap = {
    myalias: 'https://myexternalapi/api'
};
```

#### withRequestOptions

GenGen would generate optional parameter `options` for each method in services. With which you could provide any additional request options from the interface below (IAngularHttpRequestOptions).

Example:

```ts
interface IAngularHttpRequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    observe?: 'body' | 'response';
    params?: HttpParams | { [param: string]: string | string[] };
    reportProgress?: boolean;
    responseType?: 'json' | 'blob';
    withCredentials?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ExampleService extends BaseHttpService {
    // ...

    public methodName(options?: IAngularHttpRequestOptions): Observable<void> {
        return this.post<string>(`methodName`, options);
    }

    // ...
}

@Component(
    // ...
)
export class MyComponent {
    constructor(private exampleService: ExampleService) {
        this.exampleService.methodName({
            withCredentials: true
        });
    }
}
```

#### unstrictId

By default, GenGen converts all 'id' properties from string type to custom Guid type. You can disable this behaviour by using it option

Example:

```ts
public static toDTO(model: Partial<Product>): IProduct {
    return {
        // ...
        id: model.id ? model.id.toString() : Guid.empty.toString(),
        // ...
    };
}

public static fromDTO(dto: IProduct): Product {
    // ...
    model.id = new Guid(dto.id);
    // ...
}
```

#### fixNamespace

By default, GenGen generates model names with dots if any.

Example:

Object name in `Schemas` definition:

`MyProduct.Core.Models.Product`

Default behavior:

```ts
export interface IMyProduct.Core.Models.Product {}

export class MyProduct.Core.Models.Product {
   private __myProduct.Core.Models.Product!: string;

   public static toDTO(model: Partial<MyProduct.Core.Models.Product>): IMyProduct.Core.Models.Product {
      return {};
   }
   
   public static fromDTO(dto: IMyProduct.Core.Models.Product): MyProduct.Core.Models.Product {
      const model = new MyProduct.Core.Models.Product();
      return model;
   }
}
```

You can truncate or join namespace for the model name by using these options:

1. With `truncateNamespace` option enabled:

```ts
export interface IProduct {}

export class Product {
    private __product!: string;

    public static toDTO(model: Partial<Product>): IProduct {
        return {
        };
    }

    public static fromDTO(dto: IProduct): Product {
        const model = new Product();
        return model;
    }
}
```

2. With `joinNamespace` option enabled:

```ts
export interface IMyProductCoreModelsProduct {}

export class MyProductCoreModelsProduct {
   private __myProductCoreModelsProduct!: string;

   public static toDTO(model: Partial<MyProductCoreModelsProduct>): IMyProductCoreModelsProduct {
      return {};
   }

   public static fromDTO(dto: IMyProductCoreModelsProduct): MyProductCoreModelsProduct {
      const model = new MyProductCoreModelsProduct();
      return model;
   }
}
```

# License and copyright

Copyright (c) 2020-2024 Luxoft

Licensed under the MIT license
