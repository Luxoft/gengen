import { IOptions, defaultOptions } from './options';

import { writeFile, mkdir } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);

const TEMPLATE = `
import { Facade } from './facade';

export default new Set([]);
`;

export default async function init(options: IOptions = defaultOptions): Promise<void> {
    const text = TEMPLATE;
    await mkdirAsync(options.outDirFacade, { recursive: true });
    const outputFile = `${options.outDirFacade}/facade.config.ts`;
    await writeFileAsync(outputFile, text, 'utf8');
}