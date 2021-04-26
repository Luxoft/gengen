#!/usr/bin/env node

const program = require('commander');
const gengen = require('../lib/gengen');

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
  .action((params) =>gengen.config(params));

program
  .command('generate')
  .alias('g')
  .option('--aliasName <string>')
  .option('--file <string>')
  .option('--url <string>')
  .option('--output <string>')
  .option('--configOutput <string>')
  .option('--all')
  .description('Generates models and services')
  .action((params) => gengen.main(params));

program.parse(process.argv);
