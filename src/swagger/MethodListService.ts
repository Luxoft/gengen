import { IOptions } from '../options';
import { PATH_PREFIX } from './consts';
import { ISwaggerMeta } from './types';

export class MethodListService {
    constructor(private meta: ISwaggerMeta) { }

    public async getMethodList(options: IOptions): Promise<Set<string>> {
        return options.all ? this.getAllMethods() : this.getMethodListFromFile(options);
    }

    private async getMethodListFromFile(options: IOptions): Promise<Set<string>> {
        require('ts-node').register({
            compilerOptions: {
                target: 'ES2018',
                module: 'commonjs',
                strict: true,
                esModuleInterop: true,
            }
        });
        const data = require(process.cwd() + `/${options.tempOutput}/facade.config.ts`).default;
        return data;
    }

    private getAllMethods(): Set<string> {
        const meta = this.meta;
        return new Set(Object.entries(meta.paths).map(([path]) => {
            const url = path.replace(PATH_PREFIX, '');
            return url;
        }, []));
    }
}