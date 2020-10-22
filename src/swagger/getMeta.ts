import fetch from 'node-fetch';

import { IOptions, defaultOptions } from '../options';
import { ISwaggerMeta } from './types';
import { readFile, writeFile } from './utils';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function getMeta(input: IOptions): Promise<ISwaggerMeta> {
    const options: IOptions = { ...defaultOptions, ...input };
    const data = await getSwaggerData(options);

    if (options.print && options.file) {
        await writeFile(options.file, JSON.stringify(data, null, 2), 'utf8');
    }

    return data;
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