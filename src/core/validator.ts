import { EnvSchema, ValidationResult, ValidationError } from '../types';
import { parseValue } from './parser';

/**
 * Validate environment variables against a schema
 */
export function validateEnv(
  env: Record<string, string | undefined>,
  schema: EnvSchema
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: string[] = [];

  // Validate each variable in the schema
  for (const [key, config] of Object.entries(schema)) {
    const rawValue = env[key];
    const { error } = parseValue(rawValue, config, key);

    if (error) {
      errors.push(error);
    }
  }

  // Check for unused environment variables (warnings)
  const schemaKeys = new Set(Object.keys(schema));
  for (const key of Object.keys(env)) {
    if (!schemaKeys.has(key) && env[key] !== undefined) {
      warnings.push(`Environment variable "${key}" is not defined in schema`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Parse and validate environment variables, returning the typed result
 */
export function parseEnv<T extends EnvSchema>(
  env: Record<string, string | undefined>,
  schema: T
): Record<string, any> {
  const result: Record<string, any> = {};
  const errors: ValidationError[] = [];

  for (const [key, config] of Object.entries(schema)) {
    const rawValue = env[key];
    const { value, error } = parseValue(rawValue, config, key);

    if (error) {
      errors.push(error);
    } else {
      result[key] = value;
    }
  }

  // If there are errors, throw with formatted message
  if (errors.length > 0) {
    const errorMessage = formatValidationErrors(errors);
    throw new Error(`Environment validation failed:\n${errorMessage}`);
  }

  return result;
}

function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .map((error) => {
      let msg = `  ✘ ${error.variable}: ${error.message}`;
      if (error.expected) {
        msg += `\n    Expected: ${error.expected}`;
      }
      if (error.received !== undefined) {
        msg += `\n    Received: ${error.received}`;
      }
      return msg;
    })
    .join('\n\n');
}
