import { describe, it, expect, beforeEach } from 'vitest';
import { createEnv, validate } from '../src/index';

describe('createEnv', () => {
  it('should create typed environment object', () => {
    const env = createEnv(
      {
        PORT: { type: 'number', default: 3000 },
        DEBUG: { type: 'boolean', default: false }
      },
      {
        env: { PORT: '8080', DEBUG: 'true' },
        throwOnError: true
      }
    );

    expect(env.PORT).toBe(8080);
    expect(env.DEBUG).toBe(true);
  });

  it('should throw on validation errors by default', () => {
    expect(() => {
      createEnv(
        { PORT: { type: 'number', required: true } },
        { env: {}, throwOnError: true }
      );
    }).toThrow('Environment validation failed');
  });

  it('should not throw when throwOnError is false', () => {
    const env = createEnv(
      { PORT: { type: 'number', required: true } },
      { env: {}, throwOnError: false }
    );

    expect(env).toBeDefined();
  });

  it('should use default values', () => {
    const env = createEnv(
      {
        PORT: { type: 'number', default: 3000 },
        NODE_ENV: { type: 'enum', values: ['development', 'production'], default: 'development' }
      },
      { env: {} }
    );

    expect(env.PORT).toBe(3000);
    expect(env.NODE_ENV).toBe('development');
  });
});

describe('validate', () => {
  it('should return validation result without throwing', () => {
    const result = validate(
      { PORT: { type: 'number', required: true } },
      {}
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  it('should validate successfully', () => {
    const result = validate(
      { PORT: { type: 'number' } },
      { PORT: '3000' }
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
