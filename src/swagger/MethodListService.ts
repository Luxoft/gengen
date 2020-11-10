import { IOptions } from '../options';
import { ISwaggerMeta } from './types';
import { TypesService } from './TypesService';

export class MethodListService {
    constructor(
        private meta: ISwaggerMeta,
        private typesService: TypesService) {
    }

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

        return require(process.cwd() + `/${options.configOutput}/facade.config.ts`).default;
    }

    private getAllMethods(): Set<string> {
        const meta = this.meta;
        return new Set(Object.entries(meta.paths).map(z => this.typesService.getRouteInfo(z).full, []));
    }
}
