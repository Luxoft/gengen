# Usage 

To add new server methods

1) Start server app (swagger should be accessable here https://localhost:5001/swagger/v1/swagger.json)

2) Init
```shell
gengen init
```

3) Generate whole method list by (--file=./swagger.json)
```shell
gengen g:f
```

3) Add/Remove needed methods in facade.config.ts (--file=./swagger.json)
```ts


import { Facade } from './facade';

export default new Set([
    Facade.EmployeeService.GetVisualEmployeesByActiveEmployeeFilter,
    Facade.ProjectActivityService.GetVisualProjectActivitiesByFilter,
    Facade.ProjectMethodologyService.GetVisualProjectMethodologiesByFilter,
]);
```

4) Generate Services/Models/Enums by
```shell
gengen g
```

# Contributors

* [Vsevolod Arutyunov](https://github.com/sevaru)
* [Egorov Nikita](https://github.com/nikitaegorov)
* [Leshchev Artem](https://github.com/aleshchev)


# License and copyright

Copyright (c) 2020 Luxoft

Licensed under the MIT license