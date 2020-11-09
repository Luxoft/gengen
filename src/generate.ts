import { defaultOptions, IOptions } from './options';
import { render } from './render';
import { getMeta } from './swagger/getMeta';
import { MethodListService } from './swagger/MethodListService';
import { ModelsService } from './swagger/ModelsService';
import { ServicesTreeService } from './swagger/ServicesTreeService';
import { TypesService } from './swagger/TypesService';
import { sortBy } from './swagger/utils';

export default async function main(optionsRaw: IOptions = defaultOptions) {
    const options = { ...defaultOptions, ...optionsRaw };
    // Init
    const meta = await getMeta(options);

    // Services
    const typesService = new TypesService(meta);
    const methodListService = new MethodListService(meta, typesService);
    const modelsService = new ModelsService(meta, typesService);
    const servicesService = new ServicesTreeService(meta, typesService);

    // Data
    const methodList = await methodListService.getMethodList(options);
    const { enums, models } = modelsService.getTypesByMethodList(methodList);
    const services = servicesService.getServicesList(methodList);

    // Sort
    models.sort(sortBy(x => x.name));
    enums.sort(sortBy(x => x.name));
    services.sort(sortBy(x => x.name));

    // Render
    render({}, './templates/guid.ejs', `${options.output}/Guid.ts`)
    render({}, './templates/date-converters.ejs', `${options.output}/date-converters.ts`)
    render({}, './templates/mappers.ejs', `${options.output}/mappers.ts`)
    render({}, './templates/base-http-service.ejs', `${options.output}/base-http.service.ts`)
    render({}, './templates/download-service.ejs', `${options.output}/download-service.ts`)
    render({ models, enums }, './templates/models.ejs', `${options.output}/models.ts`);
    render({ services }, './templates/services.ejs', `${options.output}/services.ts`);
}
