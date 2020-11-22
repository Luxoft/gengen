export const SWAGGER_URL = 'https://localhost:5001/swagger/v1/swagger.json';
export const DEFAULT_TEMP_OUT_DIR = './.generated';
export const DEFAULT_OUT_DIR = './src/generated';
export const CONFIG_FILENAME = 'endpoints.config.ts';

export interface IOptions {
    all?: boolean;
    configOutput: string;
    output: string;
    file?: string;
    url?: string;
}

export const defaultOptions: IOptions = {
    configOutput: DEFAULT_TEMP_OUT_DIR,
    output: DEFAULT_OUT_DIR,
    url: SWAGGER_URL
};
