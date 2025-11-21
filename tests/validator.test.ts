import { describe, it, expect } from 'vitest';
import { validateEnv, parseEnv } from '../src/core/validator';

describe('validator', () => {
  describe('validateEnv', () => {
    it('should validate correct environment', () => {
      const result = validateEnv(
        {
          PORT: '3000',
          NODE_ENV: 'development'
        },
        {
          PORT: { type: 'number' },
          NODE_ENV: { type: 'enum', values: ['development', 'production'] }
        }
      );

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing required variables', () => {
      const result = validateEnv(
        { PORT: '3000' },
        {
          PORT: { type: 'number' },
          DATABASE_URL: { type: 'string', required: true }
        }
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].variable).toBe('DATABASE_URL');
    });

    it('should detect type errors', () => {
      const result = validateEnv(
        { PORT: 'not-a-number' },
        { PORT: { type: 'number' } }
      );

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].variable).toBe('PORT');
    });

    it('should warn about unused variables', () => {
      const result = validateEnv(
        {
          PORT: '3000',
          UNUSED_VAR: 'value'
        },
        { PORT: { type: 'number' } }
      );

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('UNUSED_VAR');
    });
  });

  describe('parseEnv', () => {
    it('should parse and return typed environment', () => {
      const result = parseEnv(
        {
          PORT: '3000',
          DEBUG: 'true',
          NODE_ENV: 'production'
        },
        {
          PORT: { type: 'number' },
          DEBUG: { type: 'boolean' },
          NODE_ENV: { type: 'enum', values: ['development', 'production'] }
        }
      );

      expect(result.PORT).toBe(3000);
      expect(result.DEBUG).toBe(true);
      expect(result.NODE_ENV).toBe('production');
    });

    it('should throw on validation errors', () => {
      expect(() => {
        parseEnv(
          { PORT: 'invalid' },
          { PORT: { type: 'number' } }
        );
      }).toThrow('Environment validation failed');
    });

    it('should handle optional variables', () => {
      const result = parseEnv(
        { REQUIRED: 'value' },
        {
          REQUIRED: { type: 'string' },
          OPTIONAL: { type: 'string', required: false }
        }
      );

      expect(result.REQUIRED).toBe('value');
      expect(result.OPTIONAL).toBeUndefined();
    });

    it('should apply defaults', () => {
      const result = parseEnv(
        {},
        {
          PORT: { type: 'number', default: 3000 },
          DEBUG: { type: 'boolean', default: false }
        }
      );

      expect(result.PORT).toBe(3000);
      expect(result.DEBUG).toBe(false);
    });
  });
});
