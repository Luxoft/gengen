import { pathOptions } from '../options';
import { first, lowerFirst, upperFirst } from '../utils';
import { IAction, IEndpointInfo } from './EndpointsService';

interface IEndpointInfoItem {
    name: string;
    origin: string;
    action: IAction;
}

export class EndpointNameResolver {
    private queryParameterRegExp = new RegExp('^{(.*)}$');

    constructor() {}

    public checkDuplicates(endpointInfos: IEndpointInfo[]): void {
        const infos = endpointInfos.reduce<IEndpointInfoItem[]>((arr, z) => {
            arr.push(...z.actions.map(x => ({ name: z.name, origin: z.origin, action: x })))
            return arr;
        }, []);

        infos.forEach(z => {
            const duplicates = this.findDuplicates(z, infos);
            if (duplicates.length > 1) {
                const duplicate = first(duplicates);
                throw new Error(`Duplicate by path: '${duplicate.origin}' was detected. Please, rename your endpoints`);
            }
        });
    }

    public generateNameByPath(path: string): string {
        return path
            .split(pathOptions.separator)
            .filter((z) => z && !this.queryParameterRegExp.test(z))
            .map((z, i) => i ? upperFirst(z) : lowerFirst(z))
            .join('');
    }

    public generateNameDefault(name: string): string {
        return lowerFirst(`${name}Default`);
    }


    private findDuplicates(info: IEndpointInfoItem, infos: IEndpointInfoItem[]): IEndpointInfoItem[] {
        return infos.filter(x => info.action.name === x.action.name && info.name === x.name);
    }
}
