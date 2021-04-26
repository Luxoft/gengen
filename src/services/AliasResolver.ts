import { IOptions } from '../options';

export class AliasResolver {
    protected readonly typescriptPostfix = '.ts';
    constructor(private readonly options: IOptions) {}

    public getAliasSerialized(): string {
        return this.options.aliasName ? `'${this.options.aliasName}'` : `${undefined}`;
    }

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
