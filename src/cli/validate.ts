import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import { ValidationResult } from '../types';

/**
 * Validate environment variables from .env file against env.config.ts
 */
export async function validateCommand(options: {
  config?: string;
  env?: string;
  verbose?: boolean;
} = {}): Promise<void> {
  const cwd = process.cwd();

  // Load .env file
  const envPath = options.env || path.join(cwd, '.env');
  if (!fs.existsSync(envPath)) {
    console.error(chalk.red('✘ .env file not found'));
    console.log(chalk.yellow('\n💡 Run "npx smart-env init" to create one'));
    process.exit(1);
  }

  const envConfig = dotenv.parse(fs.readFileSync(envPath, 'utf-8'));

  // Load env.config.ts
  const configPath = options.config || path.join(cwd, 'env.config.ts');
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red('✘ env.config.ts not found'));
    console.log(chalk.yellow('\n💡 Run "npx smart-env init" to create one'));
    process.exit(1);
  }

  try {
    // Dynamic import of the config file
    // Convert Windows paths to file:// URLs for proper ESM import
    const configUrl = pathToFileURL(configPath).href;
    const configModule = await import(configUrl);
    const schema = configModule.default || configModule.schema;

    if (!schema) {
      console.error(chalk.red('✘ Could not find schema in env.config.ts'));
      console.log(chalk.yellow('\n💡 Make sure to export your schema as default or named "schema"'));
      process.exit(1);
    }

    // Perform validation
    const { validate } = await import('../index');
    const result: ValidationResult = validate(schema, envConfig);

    // Display results
    displayValidationResult(result, options.verbose);

    if (!result.valid) {
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('✘ Error during validation:'));
    console.error((error as Error).message);
    process.exit(1);
  }
}

/**
 * Display validation results with colors and formatting
 */
function displayValidationResult(result: ValidationResult, verbose: boolean = false): void {
  console.log();

  if (result.valid) {
    console.log(chalk.green('✔ All environment variables are valid!\n'));

    if (verbose && result.warnings.length === 0) {
      console.log(chalk.gray('No warnings found.'));
    }
  } else {
    console.log(chalk.red('✘ Environment validation failed:\n'));

    result.errors.forEach((error, index) => {
      console.log(chalk.red(`  ${index + 1}. ${error.variable}`));
      console.log(chalk.gray(`     ${error.message}`));

      if (error.expected) {
        console.log(chalk.gray(`     Expected: ${chalk.white(error.expected)}`));
      }

      if (error.received !== undefined && error.received !== 'undefined') {
        console.log(chalk.gray(`     Received: ${chalk.white(error.received)}`));
      }

      console.log();
    });

    // Show suggestions
    console.log(chalk.yellow('Suggested fixes for .env:\n'));
    result.errors.forEach((error) => {
      console.log(chalk.yellow(`  ${error.variable}=<your-value-here>`));
    });
    console.log();
  }

  // Display warnings
  if (result.warnings.length > 0) {
    console.log(chalk.yellow('\nWarnings:'));
    result.warnings.forEach((warning) => {
      console.log(chalk.yellow(`  ⚠ ${warning}`));
    });
    console.log();
  }
}

/**
 * Simple validation that prints colored output
 */
export function quickValidate(envPath?: string): void {
  dotenv.config({ path: envPath });

  console.log(chalk.blue('🔍 Validating environment variables...\n'));

  // Check for common required variables
  const commonVars = ['NODE_ENV', 'PORT'];
  let hasErrors = false;

  commonVars.forEach((varName) => {
    if (process.env[varName]) {
      console.log(chalk.green(`✔ ${varName} = ${process.env[varName]}`));
    } else {
      console.log(chalk.red(`✘ ${varName} is missing`));
      hasErrors = true;
    }
  });

  console.log();

  if (hasErrors) {
    console.log(chalk.yellow('💡 Tip: Define a schema in env.config.ts for better validation'));
    process.exit(1);
  } else {
    console.log(chalk.green('✨ Basic validation passed!'));
  }
}
