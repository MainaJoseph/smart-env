import { createEnv } from 'smart-env';

export const env = createEnv({
  NODE_ENV: {
    type: 'enum',
    values: ['development', 'production', 'test'] as const,
    default: 'development',
    description: 'Application environment'
  },
  PORT: {
    type: 'number',
    default: 3000,
    description: 'Server port number'
  },
  DATABASE_URL: {
    type: 'url',
    required: true,
    description: 'Database connection URL'
  },
  API_KEY: {
    type: 'string',
    required: true,
    description: 'API authentication key'
  },
  DEBUG: {
    type: 'boolean',
    default: false,
    description: 'Enable debug mode'
  }
});

// Export typed environment variables
export type Env = typeof env;
