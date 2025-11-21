import { createEnv } from 'smart-env';

/**
 * Environment configuration for a typical web application
 */
export const env = createEnv({
  // Application settings
  NODE_ENV: {
    type: 'enum',
    values: ['development', 'production', 'test'] as const,
    default: 'development',
    description: 'Application environment'
  },

  PORT: {
    type: 'number',
    default: 3000,
    min: 1,
    max: 65535,
    integer: true,
    description: 'Server port number'
  },

  HOST: {
    type: 'string',
    default: 'localhost',
    description: 'Server host'
  },

  // Database
  DATABASE_URL: {
    type: 'url',
    required: true,
    protocols: ['postgresql', 'mysql'],
    description: 'Database connection URL'
  },

  DATABASE_POOL_SIZE: {
    type: 'number',
    default: 10,
    min: 1,
    max: 100,
    integer: true,
    description: 'Database connection pool size'
  },

  // Authentication
  JWT_SECRET: {
    type: 'string',
    required: true,
    minLength: 32,
    description: 'JWT signing secret'
  },

  JWT_EXPIRY: {
    type: 'string',
    default: '24h',
    pattern: /^\d+[smhd]$/,
    description: 'JWT token expiry time (e.g., 24h, 7d)'
  },

  // External services
  API_KEY: {
    type: 'string',
    required: true,
    minLength: 20,
    description: 'External API key'
  },

  REDIS_URL: {
    type: 'url',
    required: false,
    protocols: ['redis'],
    description: 'Redis connection URL for caching'
  },

  // Feature flags
  ENABLE_LOGGING: {
    type: 'boolean',
    default: true,
    description: 'Enable application logging'
  },

  DEBUG: {
    type: 'boolean',
    default: false,
    description: 'Enable debug mode'
  },

  // Advanced configuration
  CORS_ORIGINS: {
    type: 'json',
    default: ['http://localhost:3000'],
    description: 'Allowed CORS origins (JSON array)'
  },

  RATE_LIMIT: {
    type: 'number',
    default: 100,
    min: 1,
    description: 'API rate limit per minute'
  }
});

// Export the type for use throughout your application
export type Env = typeof env;

// Example usage in your application:
// import { env } from './env.config';
// console.log(`Server running on ${env.HOST}:${env.PORT}`);
