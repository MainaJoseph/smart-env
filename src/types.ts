/**
 * Supported environment variable types
 */
export type EnvVarType = 'string' | 'number' | 'boolean' | 'url' | 'json' | 'enum';

/**
 * Base configuration for an environment variable
 */
export interface BaseEnvVarConfig {
  type: EnvVarType;
  required?: boolean;
  default?: any;
  description?: string;
}

/**
 * Configuration for string type
 */
export interface StringEnvVarConfig extends BaseEnvVarConfig {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

/**
 * Configuration for number type
 */
export interface NumberEnvVarConfig extends BaseEnvVarConfig {
  type: 'number';
  min?: number;
  max?: number;
  integer?: boolean;
}

/**
 * Configuration for boolean type
 */
export interface BooleanEnvVarConfig extends BaseEnvVarConfig {
  type: 'boolean';
}

/**
 * Configuration for URL type
 */
export interface UrlEnvVarConfig extends BaseEnvVarConfig {
  type: 'url';
  protocols?: string[];
}

/**
 * Configuration for JSON type
 */
export interface JsonEnvVarConfig extends BaseEnvVarConfig {
  type: 'json';
}

/**
 * Configuration for enum type
 */
export interface EnumEnvVarConfig extends BaseEnvVarConfig {
  type: 'enum';
  values: readonly string[];
}

/**
 * Union type of all possible environment variable configurations
 */
export type EnvVarConfig =
  | StringEnvVarConfig
  | NumberEnvVarConfig
  | BooleanEnvVarConfig
  | UrlEnvVarConfig
  | JsonEnvVarConfig
  | EnumEnvVarConfig;

/**
 * Schema definition for environment variables
 */
export type EnvSchema = Record<string, EnvVarConfig>;

/**
 * Validation error details
 */
export interface ValidationError {
  variable: string;
  message: string;
  expected?: string;
  received?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

/**
 * Infer the TypeScript type from an environment variable configuration
 */
export type InferEnvType<T extends EnvVarConfig> =
  T extends { type: 'string' } ? string :
  T extends { type: 'number' } ? number :
  T extends { type: 'boolean' } ? boolean :
  T extends { type: 'url' } ? string :
  T extends { type: 'json' } ? any :
  T extends { type: 'enum'; values: readonly (infer U)[] } ? U :
  never;

/**
 * Infer the complete environment object type from a schema
 */
export type InferEnv<T extends EnvSchema> = {
  [K in keyof T]: T[K] extends { required: false }
    ? InferEnvType<T[K]> | undefined
    : InferEnvType<T[K]>;
};
