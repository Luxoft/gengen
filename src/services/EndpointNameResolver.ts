import { pathOptions } from '../options';
import { first, lowerFirst, upperFirst } from '../utils';
import { IAction, IEndpointInfo } from './EndpointsService';

interface IEndpointInfoItem {
    name: string;
    origin: string;
    action: IAction;
}

export class EndpointNameResolver {
    public checkDuplicates(endpointInfos: IEndpointInfo[]): void {
        const infos = endpointInfos.reduce<IEndpointInfoItem[]>((arr, z) => {
            arr.push(...z.actions.map((x) => ({ name: z.name, origin: z.origin, action: x })));
            return arr;
        }, []);

        infos.forEach((z) => {
            const duplicates = this.findDuplicates(z, infos);
            if (duplicates.length > 1) {
                const duplicate = first(duplicates);
                throw new Error(`Duplicate by path: '${duplicate.origin}' was detected. Please, rename your endpoints`);
            }
        });
    }

    public generateName(groupName: string, enpoint: string, verb: string, verbCount: number): string {
        if (!enpoint) {
            return `${verb}${groupName}`;
        }
        const parts = enpoint.split(pathOptions.separator).filter((x) => x);
        if (parts.length === 1 && this.queryParameterRegExp.test(parts[0])) {
            return `${verb}${groupName}By${upperFirst(parts[0].substring(1, parts[0].length - 1))}`;
        }

        const name = parts
            .filter((x) => !this.queryParameterRegExp.test(x))
            .map((x, i) => (i ? upperFirst(x) : lowerFirst(x)))
            .join('');

        return verbCount > 1 ? `${verb}${upperFirst(name)}` : name;
    }

    private findDuplicates(info: IEndpointInfoItem, infos: IEndpointInfoItem[]): IEndpointInfoItem[] {
        return infos.filter((x) => info.action.name === x.action.name && info.name === x.name);
    }

    private queryParameterRegExp = new RegExp('^{(.*)}$');
}
