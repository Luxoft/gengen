import { mkdir, writeFile } from 'fs';
import { promisify } from 'util';

import { defaultOptions, IOptions } from './options';

const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);

const TEMPLATE = `
import { Endpoints } from './endpoints';

export default new Set([]);
`;

export default async function init(options: IOptions = defaultOptions): Promise<void> {
    await mkdirAsync(options.configOutput, { recursive: true });
    await writeFileAsync(`${options.configOutput}/endpoints.config.ts`, TEMPLATE, 'utf8');
}
