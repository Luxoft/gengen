import fs from 'fs';
import fetch from 'node-fetch';
import util from 'util';

import { IOptions } from './options';

const readFile = util.promisify(fs.readFile);

export function first<T>(array: T[]): T {
    return array[0];
}

export function lowerFirst(value: string): string {
    const [first, ...other] = value;
    return first.toLocaleLowerCase() + other.join('');
}

export function upperFirst(value: string): string {
    const [first, ...other] = value;
    return first.toLocaleUpperCase() + other.join('');
}

export function last<T>(array: T[]): T {
    return array[array.length - 1];
}

export async function getSwaggerJson(options: IOptions): Promise<string> {
    if (options.file) {
        return readFile(options.file, 'utf8');
    }

    if (options.url) {
        return fetch(options.url).then<string>((z) => z.text());
    }

    throw new Error('Specify file or url');
}

export function sortBy<T>(fn: (value: T) => string): (a: T, b: T) => number {
    return (a: T, b: T) => (fn(a) || '').localeCompare(fn(b) || '');
}
