import { EnvVarConfig, ValidationError } from '../types';

/**
 * Parse a string value according to the specified type configuration
 */
export function parseValue(
  rawValue: string | undefined,
  config: EnvVarConfig,
  variableName: string
): { value: any; error?: ValidationError } {
  // Handle undefined/missing values
  if (rawValue === undefined || rawValue === '') {
    if (config.default !== undefined) {
      return { value: config.default };
    }

    if (config.required !== false) {
      return {
        value: undefined,
        error: {
          variable: variableName,
          message: 'Required environment variable is missing',
          expected: `${config.type} value`,
          received: 'undefined'
        }
      };
    }

    return { value: undefined };
  }

  // Parse based on type
  switch (config.type) {
    case 'string':
      return parseString(rawValue, config, variableName);

    case 'number':
      return parseNumber(rawValue, config, variableName);

    case 'boolean':
      return parseBoolean(rawValue, config, variableName);

    case 'url':
      return parseUrl(rawValue, config, variableName);

    case 'json':
      return parseJson(rawValue, config, variableName);

    case 'enum':
      return parseEnum(rawValue, config, variableName);

    default:
      return {
        value: undefined,
        error: {
          variable: variableName,
          message: `Unknown type: ${(config as any).type}`,
          received: rawValue
        }
      };
  }
}

function parseString(
  value: string,
  config: EnvVarConfig & { type: 'string' },
  variableName: string
): { value: string; error?: ValidationError } {
  if (config.minLength !== undefined && value.length < config.minLength) {
    return {
      value,
      error: {
        variable: variableName,
        message: `String is too short (minimum: ${config.minLength} characters)`,
        expected: `string with at least ${config.minLength} characters`,
        received: `string with ${value.length} characters`
      }
    };
  }

  if (config.maxLength !== undefined && value.length > config.maxLength) {
    return {
      value,
      error: {
        variable: variableName,
        message: `String is too long (maximum: ${config.maxLength} characters)`,
        expected: `string with at most ${config.maxLength} characters`,
        received: `string with ${value.length} characters`
      }
    };
  }

  if (config.pattern && !config.pattern.test(value)) {
    return {
      value,
      error: {
        variable: variableName,
        message: `String does not match required pattern: ${config.pattern}`,
        expected: `string matching ${config.pattern}`,
        received: value
      }
    };
  }

  return { value };
}

function parseNumber(
  value: string,
  config: EnvVarConfig & { type: 'number' },
  variableName: string
): { value: number; error?: ValidationError } {
  const num = Number(value);

  if (isNaN(num)) {
    return {
      value: num,
      error: {
        variable: variableName,
        message: 'Invalid number format',
        expected: 'number',
        received: value
      }
    };
  }

  if (config.integer && !Number.isInteger(num)) {
    return {
      value: num,
      error: {
        variable: variableName,
        message: 'Value must be an integer',
        expected: 'integer',
        received: value
      }
    };
  }

  if (config.min !== undefined && num < config.min) {
    return {
      value: num,
      error: {
        variable: variableName,
        message: `Number is below minimum value (${config.min})`,
        expected: `number >= ${config.min}`,
        received: String(num)
      }
    };
  }

  if (config.max !== undefined && num > config.max) {
    return {
      value: num,
      error: {
        variable: variableName,
        message: `Number exceeds maximum value (${config.max})`,
        expected: `number <= ${config.max}`,
        received: String(num)
      }
    };
  }

  return { value: num };
}

function parseBoolean(
  value: string,
  _config: EnvVarConfig & { type: 'boolean' },
  variableName: string
): { value: boolean; error?: ValidationError } {
  const lowerValue = value.toLowerCase().trim();

  if (lowerValue === 'true' || lowerValue === '1' || lowerValue === 'yes') {
    return { value: true };
  }

  if (lowerValue === 'false' || lowerValue === '0' || lowerValue === 'no') {
    return { value: false };
  }

  return {
    value: false,
    error: {
      variable: variableName,
      message: 'Invalid boolean value',
      expected: 'true, false, 1, 0, yes, or no',
      received: value
    }
  };
}

function parseUrl(
  value: string,
  config: EnvVarConfig & { type: 'url' },
  variableName: string
): { value: string; error?: ValidationError } {
  try {
    const url = new URL(value);

    if (config.protocols && !config.protocols.includes(url.protocol.slice(0, -1))) {
      return {
        value,
        error: {
          variable: variableName,
          message: `Invalid URL protocol`,
          expected: `URL with protocol: ${config.protocols.join(', ')}`,
          received: url.protocol.slice(0, -1)
        }
      };
    }

    return { value };
  } catch (error) {
    return {
      value,
      error: {
        variable: variableName,
        message: 'Invalid URL format',
        expected: 'valid URL',
        received: value
      }
    };
  }
}

function parseJson(
  value: string,
  _config: EnvVarConfig & { type: 'json' },
  variableName: string
): { value: any; error?: ValidationError } {
  try {
    const parsed = JSON.parse(value);
    return { value: parsed };
  } catch (error) {
    return {
      value: undefined,
      error: {
        variable: variableName,
        message: 'Invalid JSON format',
        expected: 'valid JSON string',
        received: value
      }
    };
  }
}

function parseEnum(
  value: string,
  config: EnvVarConfig & { type: 'enum' },
  variableName: string
): { value: string; error?: ValidationError } {
  if (!config.values.includes(value)) {
    return {
      value,
      error: {
        variable: variableName,
        message: `Value must be one of: ${config.values.join(', ')}`,
        expected: config.values.join(', '),
        received: value
      }
    };
  }

  return { value };
}
