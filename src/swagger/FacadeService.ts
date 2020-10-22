import { IOptions } from '../options';
import { EMPTY_ACTIONS, PATH_PREFIX } from './consts';
import { IControllers } from './template-types';
import { ISwaggerMeta } from './types';

export class FacadeService {
    constructor(private meta: ISwaggerMeta) { }

    public getControllers(): IControllers {
        const meta = this.meta;
        return Object.entries(meta.paths)
            .reduce<IControllers>((store, [path]) => {
                const [controller, action] = path.replace(PATH_PREFIX, '').split('/');
                if (EMPTY_ACTIONS.includes(action)) {
                    return store;
                }
                store[controller] = store[controller] || [];
                store[controller].push(action);
                return store;
            }, {});
    }
}