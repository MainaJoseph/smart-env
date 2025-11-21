import * as dotenv from 'dotenv';
import { EnvSchema, InferEnv, ValidationResult } from './types';
import { parseEnv, validateEnv } from './core/validator';
import { formatValidationResult } from './core/formatter';

// Load .env file automatically
dotenv.config();

/**
 * Create a typed and validated environment configuration
 *
 * @param schema - The schema definition for your environment variables
 * @param options - Optional configuration
 * @returns Typed environment object
 *
 * @example
 * ```typescript
 * import { createEnv } from 'smart-env';
 *
 * export const env = createEnv({
 *   NODE_ENV: {
 *     type: 'enum',
 *     values: ['development', 'production'] as const,
 *     required: true
 *   },
 *   PORT: {
 *     type: 'number',
 *     default: 3000
 *   },
 *   DATABASE_URL: {
 *     type: 'url',
 *     required: true
 *   }
 * });
 * ```
 */
export function createEnv<T extends EnvSchema>(
  schema: T,
  options: {
    /**
     * Environment object to validate (defaults to process.env)
     */
    env?: Record<string, string | undefined>;
    /**
     * Whether to throw an error on validation failure (default: true)
     */
    throwOnError?: boolean;
    /**
     * Whether to print validation results to console (default: false)
     */
    verbose?: boolean;
  } = {}
): InferEnv<T> {
  const {
    env = process.env,
    throwOnError = true,
    verbose = false
  } = options;

  try {
    const result = parseEnv(env, schema);

    if (verbose) {
      console.log('✔ Environment validation successful');
    }

    return result as InferEnv<T>;
  } catch (error) {
    if (verbose || throwOnError) {
      console.error((error as Error).message);
    }

    if (throwOnError) {
      throw error;
    }

    return {} as InferEnv<T>;
  }
}

/**
 * Validate environment variables without throwing
 *
 * @param schema - The schema definition
 * @param env - Optional environment object (defaults to process.env)
 * @returns Validation result with errors and warnings
 *
 * @example
 * ```typescript
 * const result = validate({
 *   PORT: { type: 'number', required: true }
 * });
 *
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validate<T extends EnvSchema>(
  schema: T,
  env: Record<string, string | undefined> = process.env
): ValidationResult {
  return validateEnv(env, schema);
}

/**
 * Format validation results for display
 *
 * @param result - Validation result from validate()
 * @returns Formatted string for console output
 */
export function formatResult(result: ValidationResult): string {
  return formatValidationResult(result);
}

// Re-export types for convenience
export type {
  EnvSchema,
  EnvVarConfig,
  InferEnv,
  InferEnvType,
  ValidationResult,
  ValidationError,
  StringEnvVarConfig,
  NumberEnvVarConfig,
  BooleanEnvVarConfig,
  UrlEnvVarConfig,
  JsonEnvVarConfig,
  EnumEnvVarConfig
} from './types';
