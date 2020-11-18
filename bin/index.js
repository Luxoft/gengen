#!/usr/bin/env node

const program = require('commander');

const generate = require('../lib/generate').default;
const generateConfig = require('../lib/generate-config').default;
const init = require('../lib/init').default;

program
  .command('init')
  .description('Creates file to select endpoints for generation')
  .action(() => init());

program
  .command('generate-config')
  .description('Generates endpoints list')
  .alias('g:c')
  .option('--file <string>')
  .action((params) => generateConfig(params));

program
  .command('generate')
  .alias('g')
  .option('--file <string>')
  .option('--output <string>')
  .option('--all')
  .description('Generates models and services')
  .action((params) => generate(params));

program.parse(process.argv);
