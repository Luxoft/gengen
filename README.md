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

| Option                           | Description                                                                                                          | Type    | Default value                                  |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------- |
| **all**                          | Generate all                                                                                                         | boolean | false                                          |
| **url**                          | Location of swagger.json                                                                                             | string  | https://localhost:5001/swagger/v1/swagger.json |
| **file**                         | Local path to swagger.json                                                                                           | string  |                                                |
| **output**                       | Output directory                                                                                                     | string  | ./src/generated                                |
| **configOutput**                 | Output directory using in 'Generate a part of API' scenario                                                          | string  | ./.generated                                   |
| **aliasName**                    | Specify prefix for generated filenames. [more info](#aliasName)                                                      | string  |                                                |
| **withRequestOptions**           | Allows to pass http request options to generated methods. [more info](#withRequestOptions)                           | boolean | false                                          |
| **utilsRelativePath**            | Relative path to utils files. It may be useful when you have multiple generation sources                             | string  |                                                |
| **unstrictId**                   | Disable converting 'id' properties to strong Guid type. [more info](#unstrictId)                                     | boolean | false                                          |
| **withLegacyUndefineGeneration** | Allow enabling the "previous" style generation with many undefined types. [more info](#withLegacyUndefineGeneration) | boolean | false                                          |

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

@Component()
// ...
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

#### withLegacyUndefineGeneration

From version 1.3, GenGen supports the [required properties](https://swagger.io/docs/specification/v3_0/data-models/data-types/#required-properties) option from types, which indicates that a field is required on the backend and mandatory (not-null) in the type. For `required` fields, GenGen uses non-null and non-undefined types. Additionally, the generation of the toDto methods has been changed to use `PublicFields<XXX>` instead of `Partial<XXX>`.

Example:

```ts
// with withLegacyUndefineGeneration
public static toDTO(model: Partial<Product>): IProduct {
    return {
        // ...
        id: model.obj ? ObjDto.toDTO(model.obj) : undefined,
        // ...
    };
}

// default, all field in model required
public static toDTO(model: PublicFields<Product>): IProduct {
    return {
        // ...
        id: ObjDto.toDTO(model.obj),
        // ...
    };
}
```

To enable all power of this behavior you need to customize generation your OpenAPI specification, for Swashbuckle.AspNetCore it can be done with the next [options](https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/2036):

```csharp
serviceCollection.AddSwaggerGen(builder =>
{
  builder.SupportNonNullableReferenceTypes();
  builder.NonNullableReferenceTypesAsRequired();
});
```

However, if you want to use the previous generation for some reason, you can enable it with the `withLegacyUndefineGeneration` option.

# License and copyright

Copyright (c) 2020-2023 Luxoft

Licensed under the MIT license
