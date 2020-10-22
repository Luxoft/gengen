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

# Files
For asp.net core add [ProducesResponseType(typeof(FileStreamResult), 200)] to methods that returns files (Streams)