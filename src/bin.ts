import { program } from 'commander';

import * as gengen from './gengen';
import { GenGenCodeGen } from './gengen/GenGenCodeGen';
import { getOptions } from './options';
import { getOpenAPISpec } from './swagger/getOpenAPISpec';

program
    .command('init')
    .option('--configOutput <string>')
    .description('Creates file to select endpoints for generation')
    .action(() => gengen.init());

program
    .command('generate-config')
    .description('Generates endpoints list')
    .alias('g:c')
    .option('--file <string>')
    .option('--url <string>')
    .option('--configOutput <string>')
    .action((params) => gengen.config(params));

program
    .command('generate')
    .alias('g')
    .option('--aliasName <string>')
    .option('--file <string>')
    .option('--url <string>')
    .option('--output <string>')
    .option('--configOutput <string>')
    .option('--utilsRelativePath <string>')
    .option('--all')
    .option('--withRequestOptions')
    .option('--unstrictId')
    .option('--withLegacyUndefineGeneration')
    .description('Generates models and services')
    .action(async (params) => {
        const options = getOptions(params);
        const spec = await getOpenAPISpec(options);
        const codeGen = new GenGenCodeGen(options, spec);
        await codeGen.run();
    });

program.parse(process.argv);
