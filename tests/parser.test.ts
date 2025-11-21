import { describe, it, expect } from 'vitest';
import { parseValue } from '../src/core/parser';

describe('parser', () => {
  describe('string type', () => {
    it('should parse valid string', () => {
      const result = parseValue('hello', { type: 'string' }, 'TEST');
      expect(result.value).toBe('hello');
      expect(result.error).toBeUndefined();
    });

    it('should validate minLength', () => {
      const result = parseValue('hi', { type: 'string', minLength: 5 }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('too short');
    });

    it('should validate maxLength', () => {
      const result = parseValue('hello world', { type: 'string', maxLength: 5 }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('too long');
    });

    it('should validate pattern', () => {
      const result = parseValue('abc', { type: 'string', pattern: /^\d+$/ }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('pattern');
    });
  });

  describe('number type', () => {
    it('should parse valid number', () => {
      const result = parseValue('42', { type: 'number' }, 'TEST');
      expect(result.value).toBe(42);
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid number', () => {
      const result = parseValue('not-a-number', { type: 'number' }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Invalid number');
    });

    it('should validate min value', () => {
      const result = parseValue('5', { type: 'number', min: 10 }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('below minimum');
    });

    it('should validate max value', () => {
      const result = parseValue('100', { type: 'number', max: 50 }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('exceeds maximum');
    });

    it('should validate integer', () => {
      const result = parseValue('3.14', { type: 'number', integer: true }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('integer');
    });
  });

  describe('boolean type', () => {
    it('should parse "true"', () => {
      const result = parseValue('true', { type: 'boolean' }, 'TEST');
      expect(result.value).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should parse "false"', () => {
      const result = parseValue('false', { type: 'boolean' }, 'TEST');
      expect(result.value).toBe(false);
      expect(result.error).toBeUndefined();
    });

    it('should parse "1" as true', () => {
      const result = parseValue('1', { type: 'boolean' }, 'TEST');
      expect(result.value).toBe(true);
    });

    it('should parse "0" as false', () => {
      const result = parseValue('0', { type: 'boolean' }, 'TEST');
      expect(result.value).toBe(false);
    });

    it('should reject invalid boolean', () => {
      const result = parseValue('maybe', { type: 'boolean' }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Invalid boolean');
    });
  });

  describe('url type', () => {
    it('should parse valid URL', () => {
      const result = parseValue('https://example.com', { type: 'url' }, 'TEST');
      expect(result.value).toBe('https://example.com');
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid URL', () => {
      const result = parseValue('not-a-url', { type: 'url' }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Invalid URL');
    });

    it('should validate protocol', () => {
      const result = parseValue('ftp://example.com', { type: 'url', protocols: ['http', 'https'] }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('protocol');
    });
  });

  describe('json type', () => {
    it('should parse valid JSON', () => {
      const result = parseValue('{"key":"value"}', { type: 'json' }, 'TEST');
      expect(result.value).toEqual({ key: 'value' });
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid JSON', () => {
      const result = parseValue('not json', { type: 'json' }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Invalid JSON');
    });
  });

  describe('enum type', () => {
    it('should parse valid enum value', () => {
      const result = parseValue('production', { type: 'enum', values: ['development', 'production'] }, 'TEST');
      expect(result.value).toBe('production');
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid enum value', () => {
      const result = parseValue('staging', { type: 'enum', values: ['development', 'production'] }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('must be one of');
    });
  });

  describe('default values', () => {
    it('should use default when value is undefined', () => {
      const result = parseValue(undefined, { type: 'string', default: 'default-value' }, 'TEST');
      expect(result.value).toBe('default-value');
      expect(result.error).toBeUndefined();
    });

    it('should use default when value is empty string', () => {
      const result = parseValue('', { type: 'number', default: 42 }, 'TEST');
      expect(result.value).toBe(42);
      expect(result.error).toBeUndefined();
    });
  });

  describe('required vs optional', () => {
    it('should error on missing required variable', () => {
      const result = parseValue(undefined, { type: 'string', required: true }, 'TEST');
      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('Required');
    });

    it('should allow missing optional variable', () => {
      const result = parseValue(undefined, { type: 'string', required: false }, 'TEST');
      expect(result.value).toBeUndefined();
      expect(result.error).toBeUndefined();
    });
  });
});
