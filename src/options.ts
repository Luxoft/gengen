import { IndentationText, ModuleKind, NewLineKind, ProjectOptions, QuoteKind, ScriptTarget } from 'ts-morph';

export const defaultOptions: IOptions = {
    configOutput: './.generated',
    output: './src/generated',
    utilsRelativePath: '',
    url: 'https://localhost:5001/swagger/v1/swagger.json',
    withRequestOptions: false,
    unstrictId: false,
    withLegacyUndefineGeneration: false
};

export interface IOptions {
    all?: boolean;
    configOutput: string;
    output: string;
    file?: string;
    url?: string;
    aliasName?: string;
    withRequestOptions: boolean;
    unstrictId: boolean;
    utilsRelativePath: string;
    withLegacyUndefineGeneration: boolean;
}

export const pathOptions = {
    separator: '/'
};

export const generatorsOptions: ProjectOptions = {
    compilerOptions: {
        target: ScriptTarget.ES2018,
        module: ModuleKind.CommonJS,
        strict: true,
        esModuleInterop: true
    },
    manipulationSettings: {
        newLineKind: NewLineKind.CarriageReturnLineFeed,
        quoteKind: QuoteKind.Single,
        insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
        indentationText: IndentationText.FourSpaces
    }
};

export const configOptions = {
    filename: 'endpoints.config.ts',
    className: 'Endpoints'
};

export function getOptions(options: Partial<IOptions>): IOptions {
    return { ...defaultOptions, ...options };
}
