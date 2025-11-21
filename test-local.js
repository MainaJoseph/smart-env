// Simple local test of smart-env
const { createEnv } = require('./dist/index.js');

console.log('Testing smart-env locally...\n');

// Test 1: Valid environment
try {
  const env = createEnv(
    {
      PORT: { type: 'number', default: 3000 },
      NODE_ENV: {
        type: 'enum',
        values: ['development', 'production', 'test'],
        default: 'development'
      },
      DEBUG: { type: 'boolean', default: false }
    },
    {
      env: {
        PORT: '8080',
        NODE_ENV: 'development',
        DEBUG: 'true'
      },
      verbose: true
    }
  );

  console.log('\nTest 1: Valid environment ✓');
  console.log('PORT:', env.PORT, '(type:', typeof env.PORT, ')');
  console.log('NODE_ENV:', env.NODE_ENV);
  console.log('DEBUG:', env.DEBUG, '(type:', typeof env.DEBUG, ')');
} catch (error) {
  console.error('Test 1 failed:', error.message);
}

// Test 2: Missing required variable
console.log('\n---\n');
try {
  createEnv(
    {
      DATABASE_URL: { type: 'url', required: true }
    },
    {
      env: {},
      throwOnError: true
    }
  );
  console.log('Test 2: Should have thrown an error');
} catch (error) {
  console.log('Test 2: Correctly caught validation error ✓\n');
  console.log(error.message);
}

// Test 3: Non-throwing validation
console.log('\n---\n');
const { validate, formatResult } = require('./dist/index.js');

const result = validate({
  PORT: { type: 'number', required: true },
  API_KEY: { type: 'string', required: true, minLength: 20 }
}, {
  PORT: 'not-a-number',
  API_KEY: 'short'
});

console.log('Test 3: Non-throwing validation ✓');
console.log(formatResult(result));

console.log('\n✨ All tests completed!');
