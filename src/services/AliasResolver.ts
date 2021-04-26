import { IOptions } from '../options';

export class AliasResolver {
    protected readonly typescriptPostfix = '.ts';

    public get alias(): string {
        return this.options.aliasName ?? '';
    }

    constructor(private readonly options: IOptions) {}

    public getModelsModuleName(): string {
        return this.getFileName('models');
    }

    public getModelsFileName(): string {
        return this.getModelsModuleName() + this.typescriptPostfix;
    }

    public getServicesFileName(): string {
        return this.getFileName('services') + this.typescriptPostfix;
    }

    private getFileName(fileName: string): string {
        if (!this.options.aliasName) {
            return fileName;
        }
        return `${this.options.aliasName}-${fileName}`;
    }
}
