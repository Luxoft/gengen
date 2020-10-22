import ejs from 'ejs';
import fs from 'fs';
import { outputFile } from 'fs-extra';
import path from 'path';
import prettier from 'prettier';
import util from 'util';

const readFile = util.promisify(fs.readFile);
export async function render<T>(data: T, templateUrl: string, fileUrl: string): Promise<void> {
    const hrstart = process.hrtime();
    console.log(`Generate: ${fileUrl} start`);
    const templateUrlNormalized = path.resolve(__dirname, templateUrl);
    const template = await readFile(templateUrlNormalized, 'utf8');
    const generated = ejs.render(template, data, { filename: templateUrlNormalized });
    const formatted = prettier.format(generated, { parser: 'typescript', singleQuote: true });
    await outputFile(fileUrl, formatted);
    const hrend = process.hrtime(hrstart);
    console.log(`Generate: ${fileUrl} end: ${hrend[1] / 1000000}ms`);
}
