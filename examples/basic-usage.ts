/**
 * Basic usage examples for smart-env
 */

import { createEnv } from 'smart-env';

// Example 1: Simple configuration
const env1 = createEnv({
  PORT: {
    type: 'number',
    default: 3000
  },
  NODE_ENV: {
    type: 'enum',
    values: ['development', 'production'] as const,
    required: true
  }
});

console.log('Server port:', env1.PORT);
console.log('Environment:', env1.NODE_ENV);

// Example 2: With all type validations
const env2 = createEnv({
  // String with constraints
  API_KEY: {
    type: 'string',
    required: true,
    minLength: 32,
    maxLength: 64,
    description: 'API authentication key'
  },

  // Number with range
  MAX_CONNECTIONS: {
    type: 'number',
    min: 1,
    max: 1000,
    integer: true,
    default: 100
  },

  // Boolean
  ENABLE_CACHE: {
    type: 'boolean',
    default: true
  },

  // URL with protocol validation
  WEBHOOK_URL: {
    type: 'url',
    protocols: ['https'],
    required: true
  },

  // JSON configuration
  FEATURE_FLAGS: {
    type: 'json',
    default: { newUI: false, betaFeatures: false }
  },

  // Enum for specific values
  LOG_LEVEL: {
    type: 'enum',
    values: ['debug', 'info', 'warn', 'error'] as const,
    default: 'info'
  }
});

// Example 3: Non-throwing validation
import { validate, formatResult } from 'smart-env';

const result = validate({
  DATABASE_URL: { type: 'url', required: true }
});

if (!result.valid) {
  console.error('Validation failed:');
  console.error(formatResult(result));
  process.exit(1);
}

// Example 4: Custom environment source
const customEnv = createEnv(
  {
    PORT: { type: 'number', default: 8080 }
  },
  {
    env: { PORT: '9000' }, // Use custom object instead of process.env
    throwOnError: true,
    verbose: true
  }
);

console.log('Custom port:', customEnv.PORT);

// Example 5: Pattern matching for strings
const env5 = createEnv({
  VERSION: {
    type: 'string',
    pattern: /^\d+\.\d+\.\d+$/, // Semantic versioning pattern
    default: '1.0.0'
  },
  EMAIL: {
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Simple email pattern
    required: true
  }
});
