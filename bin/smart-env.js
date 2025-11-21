#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');

const program = new Command();

program
  .name('smart-env')
  .description('Professional environment variable validation with type checking')
  .version(packageJson.version);

// Init command
program
  .command('init')
  .description('Initialize smart-env in your project')
  .option('-f, --force', 'Overwrite existing files')
  .action(async (options) => {
    const { initCommand } = require('../dist/cli/init');
    initCommand(options);
  });

// Validate command
program
  .command('validate')
  .description('Validate environment variables against schema')
  .option('-c, --config <path>', 'Path to env.config.ts')
  .option('-e, --env <path>', 'Path to .env file')
  .option('-v, --verbose', 'Show detailed output')
  .action(async (options) => {
    const { validateCommand } = require('../dist/cli/validate');
    await validateCommand(options);
  });

// Scan command
program
  .command('scan')
  .description('Scan project for environment variable usage')
  .action(async () => {
    const { scanCommand } = require('../dist/cli/init');
    scanCommand();
  });

// Handle unknown commands
program.on('command:*', function () {
  console.error(chalk.red(`\nError: Unknown command '${program.args.join(' ')}'`));
  console.log(chalk.yellow('\nRun "smart-env --help" to see available commands'));
  process.exit(1);
});

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.parse(process.argv);
