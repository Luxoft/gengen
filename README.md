GenGen
======

[![license](https://img.shields.io/github/license/luxoft/gengen)](https://github.com/Luxoft/gengen/blob/master/LICENSE.txt) [![GitHub contributors](https://img.shields.io/github/contributors/luxoft/gengen)](https://github.com/Luxoft/gengen/graphs/contributors/)

This tool generates models and [Angular](https://angular.io/) services based on generated [Swagger JSON](https://swagger.io/specification/).

# Getting Started

First of all you make sure that swagger.json is accessable.
> Location by default is https://localhost:5001/swagger/v1/swagger.json. You can override it. See [all options](https://github.com/Luxoft/gengen#all-options)

##### Generate all API
   ```shell
   gengen g --all
   ```

##### Generate a part of API

1. Initialize empty rule set
   ```shell
   gengen init
   ```

2. Generate list of available routes
   ```shell
   gengen g:f
   ```

3. Describe routes who will be generated
   ```ts
   import { Facade } from './facade';
   
   export default new Set([
       Facade.ProductService.GetProducts,
       Facade.CategoryService.AddCategory
   ]);
   ```

4. Generate specified routes
   ```shell
   gengen g
   ```

##### All options

| Option | Description | Type | Default value |
|---|---|---|---|
|**all**|Generate all|boolean|false|
|**url**|Location of swagger.json|string|https://localhost:5001/swagger/v1/swagger.json|
|**file**|Local path to swagger.json|string||
|**output**|Output directory|string|./src/generated|
|**configOutput**|Output directory using in 'Generate a part of API' scenario|string|./.generated|

# License and copyright

Copyright (c) 2020 Luxoft

Licensed under the MIT license