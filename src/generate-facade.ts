import { defaultOptions, IOptions } from './options';
import { render } from './render';
import { FacadeService } from './swagger/FacadeService';
import { getMeta } from './swagger/getMeta';
import { IControllers } from './swagger/template-types';
import { sortBy } from './swagger/utils';

export default async function main(optionsRaw: IOptions = defaultOptions) {
    const options = { ...defaultOptions, ...optionsRaw };

    const controllers = new FacadeService(await getMeta(options)).getControllers();

    const items = Object.entries(controllers)
    items.sort(sortBy(x => x[0]));
    const sorted = items.reduce<IControllers>((store, item) => {
        const methods = item[1];
        methods.sort();
        store[item[0]] = methods;
        return store;
    }, {});

    render({ controllers: sorted }, './templates/facade.ejs', `${options.tempOutput}/facade.ts`);
}
