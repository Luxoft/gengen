import fetch from 'node-fetch';

import { IOptions, defaultOptions } from '../options';
import { ISwaggerMeta } from './types';
import { readFile } from './utils';

export async function getMeta(input: IOptions): Promise<ISwaggerMeta> {
    const options: IOptions = { ...defaultOptions, ...input };
    return getSwaggerData(options);
}

async function getSwaggerData(options: IOptions): Promise<ISwaggerMeta> {
    if (options.file) {
        return getFromFile(options.file);
    }

    if (options.swaggerUrl) {
        return fetch(options.swaggerUrl).then<ISwaggerMeta>(res => res.json());
    }

    throw new Error('Specify file or swaggerUrl');
}

async function getFromFile(filePath: string): Promise<ISwaggerMeta> {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
}