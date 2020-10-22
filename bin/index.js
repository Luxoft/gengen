#!/usr/bin/env node

const program = require("commander");

const generate = require("../lib/generate").default;
const generateFacade = require("../lib/generate-facade").default;
const init = require("../lib/init").default;

program
  .command("init")
  .description("Create configs needed to generate")
  .action(() => {
    init();
  });

program
  .command("generate")
  .alias("g")
  .option("--file <string>")
  .option("--outDir <string>")
  .option("--all")
  .description("Generates models and services")
  .action((params) => {
    generate(params);
  });

program
  .command("generate-facade")
  .alias("g:f")
  .option("--file <string>")
  .description("Generated all facade methods to select")
  .action((params) => {
    generateFacade(params);
  });

program.parse(process.argv);
