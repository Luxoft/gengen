import { IndentationText, ModuleKind, ProjectOptions, QuoteKind, ScriptTarget } from 'ts-morph';

export interface IOptions {
    all?: boolean;
    configOutput: string;
    output: string;
    file?: string;
    url?: string;
}

export const defaultOptions: IOptions = {
    configOutput: './.generated',
    output: './src/generated',
    url: 'https://localhost:5001/swagger/v1/swagger.json'
};

export const generatorsOptions: ProjectOptions = {
    compilerOptions: {
        target: ScriptTarget.ES2018,
        module: ModuleKind.CommonJS,
        strict: true,
        esModuleInterop: true
    },
    manipulationSettings: {
        quoteKind: QuoteKind.Single,
        insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true,
        indentationText: IndentationText.FourSpaces
    }
};

export const configOptions = {
    filename: 'endpoints.config.ts',
    className: 'Endpoints'
};
