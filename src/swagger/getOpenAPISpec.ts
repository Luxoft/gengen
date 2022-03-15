import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { IOptions } from '../options';
import { IOpenAPI3 } from './v3/open-api';

export async function getOpenAPISpec(options: IOptions): Promise<IOpenAPI3> {
    if (options.file) {
        const result = await readFile(options.file, 'utf8');
        return JSON.parse(result) as IOpenAPI3;
    }

    if (options.url) {
        const result = await fetch(options.url).then((z) => z.json());
        return result as IOpenAPI3;
    }

    throw new Error('Specify file or url');
}
