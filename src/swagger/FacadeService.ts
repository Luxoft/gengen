import { EMPTY_ACTIONS } from './consts';
import { IControllers } from './template-types';
import { ISwaggerMeta } from './types';
import { TypesService } from './TypesService';
import { first } from './utils';

export class FacadeService {
    private typesService: TypesService;

    constructor(private meta: ISwaggerMeta) {
        this.typesService = new TypesService(meta);
    }

    public getControllers(): IControllers {
        const meta = this.meta;
        return Object.entries(meta.paths)
            .reduce<IControllers>((store, path) => {
                const { controller, actionPart } = this.typesService.getRouteInfo(path);
                const action = first(actionPart.split('/'));
                if (EMPTY_ACTIONS.includes(action)) {
                    return store;
                }

                store[controller] = store[controller] || [];
                store[controller].push(action);
                return store;
            }, {});
    }
}