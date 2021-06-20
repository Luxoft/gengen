import { configOptions, IOptions } from '../options';

export class EndpointsConfigReader {
    constructor(private readonly options: IOptions) { }

    public async getEndpoints(): Promise<Set<string>> {
        require('ts-node').register({
            compilerOptions: {
                target: 'ES2018',
                module: 'commonjs',
                strict: true,
                esModuleInterop: true
            }
        });

        return require(process.cwd() + `/${this.options.configOutput}/${configOptions.filename}`).default;
    }
}
