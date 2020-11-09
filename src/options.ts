export const SWAGGER_URL = 'https://localhost:5001/swagger/v1/swagger.json';
export const DEFAULT_OUT_DIR_FACADE = './.generated';
export const DEFAULT_OUT_DIR = './src/generated';

export interface IOptions {
    all?: boolean;
    outDirFacade: string;
    outDir: string;
    file?: string;
    swaggerUrl?: string;
}

export const defaultOptions: IOptions = {
    outDirFacade: DEFAULT_OUT_DIR_FACADE,
    outDir: DEFAULT_OUT_DIR,
    swaggerUrl: SWAGGER_URL,
    file: undefined
};