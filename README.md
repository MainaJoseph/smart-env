# smart-env

[![CI](https://github.com/MainaJoseph/smart-env/workflows/CI/badge.svg)](https://github.com/MainaJoseph/smart-env/actions)
[![npm version](https://img.shields.io/npm/v/smart-env.svg)](https://www.npmjs.com/package/smart-env)
[![npm downloads](https://img.shields.io/npm/dm/smart-env.svg)](https://www.npmjs.com/package/smart-env)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Professional environment variable validation with strict type checking for Node.js and TypeScript.

Prevent runtime errors caused by missing or invalid environment variables by validating them at boot time with comprehensive type checking and helpful error messages.

## Features

- **Type-Safe**: Full TypeScript support with type inference
- **Comprehensive Validation**: String, number, boolean, URL, JSON, and enum types
- **Developer-Friendly**: Clear error messages with suggestions
- **Zero-Config**: Works out of the box with sensible defaults
- **CLI Tools**: Initialize projects and validate configurations
- **Framework Agnostic**: Works with Express, NestJS, Next.js, Fastify, and more
- **Flexible**: Support for required/optional variables, defaults, and custom validation rules

## Installation

```bash
npm install smart-env
```

## Quick Start

### 1. Initialize

```bash
npx smart-env init
```

This creates:
- `env.config.ts` - Your environment schema definition
- `.env.example` - Example environment file
- `.env` - Your local environment file (copied from example)

### 2. Define Your Schema

Edit `env.config.ts`:

```typescript
import { createEnv } from 'smart-env';

export const env = createEnv({
  NODE_ENV: {
    type: 'enum',
    values: ['development', 'production', 'test'] as const,
    default: 'development'
  },
  PORT: {
    type: 'number',
    default: 3000
  },
  DATABASE_URL: {
    type: 'url',
    required: true
  },
  API_KEY: {
    type: 'string',
    required: true,
    minLength: 32
  }
});
```

### 3. Use in Your Application

```typescript
import { env } from './env.config';

console.log(`Server running on port ${env.PORT}`);
// TypeScript knows env.PORT is a number!

app.listen(env.PORT);
```

### 4. Validate

```bash
npx smart-env validate
```

## API Reference

### `createEnv<T>(schema, options?)`

Creates a typed and validated environment configuration.

**Parameters:**
- `schema`: Environment variable schema definition
- `options` (optional):
  - `env`: Environment object to validate (defaults to `process.env`)
  - `throwOnError`: Whether to throw on validation failure (default: `true`)
  - `verbose`: Print validation results to console (default: `false`)

**Returns:** Typed environment object

**Example:**

```typescript
const env = createEnv({
  PORT: { type: 'number', default: 3000 },
  DATABASE_URL: { type: 'url', required: true }
});
```

### `validate(schema, env?)`

Validates environment without throwing errors.

**Parameters:**
- `schema`: Environment variable schema
- `env`: Environment object (defaults to `process.env`)

**Returns:** `ValidationResult` with `valid`, `errors`, and `warnings`

**Example:**

```typescript
import { validate, formatResult } from 'smart-env';

const result = validate({
  DATABASE_URL: { type: 'url', required: true }
});

if (!result.valid) {
  console.error(formatResult(result));
  process.exit(1);
}
```

## Type Configuration

### String

```typescript
{
  type: 'string',
  required?: boolean,
  default?: string,
  minLength?: number,
  maxLength?: number,
  pattern?: RegExp,
  description?: string
}
```

**Example:**

```typescript
API_KEY: {
  type: 'string',
  required: true,
  minLength: 32,
  pattern: /^sk-[a-zA-Z0-9]+$/
}
```

### Number

```typescript
{
  type: 'number',
  required?: boolean,
  default?: number,
  min?: number,
  max?: number,
  integer?: boolean,
  description?: string
}
```

**Example:**

```typescript
PORT: {
  type: 'number',
  default: 3000,
  min: 1,
  max: 65535,
  integer: true
}
```

### Boolean

```typescript
{
  type: 'boolean',
  required?: boolean,
  default?: boolean,
  description?: string
}
```

Accepts: `true`, `false`, `1`, `0`, `yes`, `no` (case-insensitive)

**Example:**

```typescript
DEBUG: {
  type: 'boolean',
  default: false
}
```

### URL

```typescript
{
  type: 'url',
  required?: boolean,
  default?: string,
  protocols?: string[],
  description?: string
}
```

**Example:**

```typescript
DATABASE_URL: {
  type: 'url',
  required: true,
  protocols: ['postgresql', 'mysql']
}
```

### JSON

```typescript
{
  type: 'json',
  required?: boolean,
  default?: any,
  description?: string
}
```

**Example:**

```typescript
FEATURE_FLAGS: {
  type: 'json',
  default: { newUI: false }
}
```

### Enum

```typescript
{
  type: 'enum',
  values: readonly string[],
  required?: boolean,
  default?: string,
  description?: string
}
```

**Example:**

```typescript
NODE_ENV: {
  type: 'enum',
  values: ['development', 'production', 'test'] as const,
  required: true
}
```

## CLI Commands

### `smart-env init`

Initialize smart-env in your project.

```bash
npx smart-env init [options]

Options:
  -f, --force    Overwrite existing files
```

### `smart-env validate`

Validate environment variables against your schema.

```bash
npx smart-env validate [options]

Options:
  -c, --config <path>    Path to env.config.ts
  -e, --env <path>       Path to .env file
  -v, --verbose          Show detailed output
```

### `smart-env scan`

Scan your project for `process.env` usage.

```bash
npx smart-env scan
```

This finds all environment variable references in your codebase to help you create a complete schema.

## Error Messages

smart-env provides clear, actionable error messages:

```
✘ Environment validation failed:

  1. DATABASE_URL
     Required environment variable is missing
     Expected: URL

  2. PORT
     Invalid number format
     Expected: number
     Received: "not-a-number"

Suggested fixes for .env:

  DATABASE_URL=<your-value-here>
  PORT=<your-value-here>
```

## Framework Integration

### Express.js

Perfect for REST APIs and web applications.

```typescript
import express from 'express';
import { createEnv } from 'smart-env';

// Define environment schema
export const env = createEnv({
  NODE_ENV: {
    type: 'enum',
    values: ['development', 'production', 'test'] as const,
    default: 'development'
  },
  PORT: {
    type: 'number',
    default: 3000,
    min: 1,
    max: 65535
  },
  DATABASE_URL: {
    type: 'url',
    required: true,
    protocols: ['postgresql', 'mysql']
  },
  JWT_SECRET: {
    type: 'string',
    required: true,
    minLength: 32
  },
  CORS_ORIGINS: {
    type: 'json',
    default: ['http://localhost:3000']
  }
});

const app = express();

// Use validated environment
app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Database: ${env.DATABASE_URL}`);
});
```

### Next.js (Pages Router & App Router)

Handles both server-side and client-side variables with NEXT_PUBLIC_ prefix.

#### Setup

Create `env.config.ts` in your project root:

```typescript
import { createEnv } from 'smart-env';

export const env = createEnv({
  // Server-side only (never exposed to browser)
  NODE_ENV: {
    type: 'enum',
    values: ['development', 'production', 'test'] as const,
    required: true
  },
  DATABASE_URL: {
    type: 'url',
    required: true,
    protocols: ['postgresql', 'mysql', 'mongodb']
  },
  NEXTAUTH_SECRET: {
    type: 'string',
    required: true,
    minLength: 32
  },
  NEXTAUTH_URL: {
    type: 'url',
    required: true
  },
  STRIPE_SECRET_KEY: {
    type: 'string',
    required: false,
    pattern: /^sk_(test|live)_/
  },

  // Client-side (exposed to browser with NEXT_PUBLIC_ prefix)
  NEXT_PUBLIC_APP_URL: {
    type: 'url',
    required: true
  },
  NEXT_PUBLIC_API_URL: {
    type: 'url',
    required: true
  },
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    type: 'string',
    required: false,
    pattern: /^pk_(test|live)_/
  },
  NEXT_PUBLIC_ANALYTICS_ID: {
    type: 'string',
    required: false
  }
});

export type Env = typeof env;
```

#### Usage in Pages Router

```typescript
// pages/index.tsx
import { env } from '../env.config';

export default function Home() {
  // ✅ Client-side variables work in components
  console.log(env.NEXT_PUBLIC_API_URL);

  return <div>Home Page</div>;
}

export async function getServerSideProps() {
  // ✅ Server-side variables work here
  const dbUrl = env.DATABASE_URL;
  const secret = env.NEXTAUTH_SECRET;

  return { props: {} };
}

// pages/api/users.ts
import { env } from '../../env.config';

export default async function handler(req, res) {
  // ✅ All server variables available in API routes
  const db = await connectDB(env.DATABASE_URL);
  const users = await db.users.findMany();
  res.json(users);
}
```

#### Usage in App Router

```typescript
// app/page.tsx (Server Component)
import { env } from '../env.config';

export default async function HomePage() {
  // ✅ Server components can access ALL variables
  const db = await connectDB(env.DATABASE_URL);
  const data = await db.getData();

  return <div>Server Component</div>;
}

// app/components/ClientButton.tsx (Client Component)
'use client';
import { env } from '../../env.config';

export default function ClientButton() {
  // ✅ Only NEXT_PUBLIC_ variables work here
  const apiUrl = env.NEXT_PUBLIC_API_URL;

  const handleClick = () => {
    fetch(apiUrl + '/data').then(/* ... */);
  };

  return <button onClick={handleClick}>Fetch Data</button>;
}

// app/api/users/route.ts (Route Handler)
import { env } from '../../../env.config';

export async function GET() {
  const db = await connectDB(env.DATABASE_URL);
  const users = await db.users.findMany();
  return Response.json(users);
}
```

#### Middleware

```typescript
// middleware.ts
import { env } from './env.config';
import { NextResponse } from 'next/server';

export function middleware(request) {
  // ✅ Access server-side env vars in middleware
  console.log('Auth URL:', env.NEXTAUTH_URL);
  return NextResponse.next();
}
```

#### Build-time Validation

Update your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "smart-env validate && next build",
    "start": "next start"
  }
}
```

This ensures environment errors are caught at build time!

#### .env.local Example

```bash
# Server-only variables
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/myapp
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxxxx

# Client-side variables (exposed to browser)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
```

### NestJS

Integrates seamlessly with NestJS's configuration module.

```typescript
// env.config.ts
import { createEnv } from 'smart-env';

export const env = createEnv({
  NODE_ENV: {
    type: 'enum',
    values: ['development', 'production', 'test'] as const,
    default: 'development'
  },
  PORT: {
    type: 'number',
    default: 3000
  },
  DATABASE_URL: {
    type: 'url',
    required: true
  },
  JWT_SECRET: {
    type: 'string',
    required: true,
    minLength: 32
  },
  JWT_EXPIRY: {
    type: 'string',
    default: '24h',
    pattern: /^\d+[smhd]$/
  },
  REDIS_URL: {
    type: 'url',
    required: false,
    protocols: ['redis']
  }
});

// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env } from './env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: () => env  // Use smart-env for validation
    })
  ],
  // ... other modules
})
export class AppModule {}

// database.service.ts
import { Injectable } from '@nestjs/common';
import { env } from './env.config';

@Injectable()
export class DatabaseService {
  connect() {
    // ✅ Type-safe environment access
    return connectDB(env.DATABASE_URL);
  }
}
```

### Fastify

Works great with Fastify's plugin system.

```typescript
import Fastify from 'fastify';
import { createEnv } from 'smart-env';

const env = createEnv({
  NODE_ENV: {
    type: 'enum',
    values: ['development', 'production'] as const,
    default: 'development'
  },
  PORT: {
    type: 'number',
    default: 3000
  },
  HOST: {
    type: 'string',
    default: '0.0.0.0'
  },
  LOG_LEVEL: {
    type: 'enum',
    values: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const,
    default: 'info'
  },
  DATABASE_URL: {
    type: 'url',
    required: true
  }
});

const fastify = Fastify({
  logger: {
    level: env.LOG_LEVEL
  }
});

// Register routes
fastify.get('/', async (request, reply) => {
  return {
    status: 'ok',
    env: env.NODE_ENV
  };
});

// Start server
fastify.listen({
  port: env.PORT,
  host: env.HOST
}, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
```

### Remix

Perfect for full-stack Remix applications.

```typescript
// env.server.ts
import { createEnv } from 'smart-env';

export const env = createEnv({
  NODE_ENV: {
    type: 'enum',
    values: ['development', 'production', 'test'] as const,
    required: true
  },
  DATABASE_URL: {
    type: 'url',
    required: true
  },
  SESSION_SECRET: {
    type: 'string',
    required: true,
    minLength: 32
  }
});

// app/routes/index.tsx
import { json, type LoaderFunction } from '@remix-run/node';
import { env } from '~/env.server';

export const loader: LoaderFunction = async () => {
  // ✅ Access validated environment in loaders
  const db = await connectDB(env.DATABASE_URL);
  const data = await db.getData();

  return json({ data });
};
```

### Vite + React/Vue/Svelte

For frontend applications built with Vite.

```typescript
// env.config.ts
import { createEnv } from 'smart-env';

export const env = createEnv({
  // Vite exposes variables prefixed with VITE_
  VITE_API_URL: {
    type: 'url',
    required: true
  },
  VITE_APP_TITLE: {
    type: 'string',
    default: 'My App'
  },
  VITE_ENABLE_ANALYTICS: {
    type: 'boolean',
    default: false
  }
}, {
  env: import.meta.env  // Use Vite's import.meta.env
});

// App.tsx / App.vue / App.svelte
import { env } from './env.config';

function App() {
  // ✅ Type-safe access to environment
  const apiUrl = env.VITE_API_URL;

  return <div>{env.VITE_APP_TITLE}</div>;
}
```

## Docker Integration

Validate environment at build time:

```dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Validate environment during build
RUN npx smart-env validate || exit 1

RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## CI/CD Integration

Add validation to your CI pipeline:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx smart-env validate
      - run: npm test
```

## Common Use Cases

### Authentication (NextAuth / Passport)

```typescript
export const env = createEnv({
  // NextAuth configuration
  NEXTAUTH_SECRET: {
    type: 'string',
    required: true,
    minLength: 32,
    description: 'Secret for JWT encryption'
  },
  NEXTAUTH_URL: {
    type: 'url',
    required: true
  },

  // OAuth providers
  GITHUB_CLIENT_ID: {
    type: 'string',
    required: false
  },
  GITHUB_CLIENT_SECRET: {
    type: 'string',
    required: false
  },
  GOOGLE_CLIENT_ID: {
    type: 'string',
    required: false
  },
  GOOGLE_CLIENT_SECRET: {
    type: 'string',
    required: false
  }
});
```

### Payment Processing (Stripe)

```typescript
export const env = createEnv({
  // Server-side (secrets)
  STRIPE_SECRET_KEY: {
    type: 'string',
    required: true,
    pattern: /^sk_(test|live)_/,
    description: 'Stripe secret key'
  },
  STRIPE_WEBHOOK_SECRET: {
    type: 'string',
    required: true,
    pattern: /^whsec_/,
    description: 'Stripe webhook signing secret'
  },

  // Client-side (public keys)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    type: 'string',
    required: true,
    pattern: /^pk_(test|live)_/
  }
});
```

### Email Services (SendGrid / Resend)

```typescript
export const env = createEnv({
  // SendGrid
  SENDGRID_API_KEY: {
    type: 'string',
    required: false,
    pattern: /^SG\./
  },
  SENDGRID_FROM_EMAIL: {
    type: 'string',
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  // Resend
  RESEND_API_KEY: {
    type: 'string',
    required: false,
    pattern: /^re_/
  }
});
```

### Database Connections

```typescript
export const env = createEnv({
  // Primary database
  DATABASE_URL: {
    type: 'url',
    required: true,
    protocols: ['postgresql', 'mysql', 'mongodb']
  },

  // Read replica (optional)
  DATABASE_REPLICA_URL: {
    type: 'url',
    required: false,
    protocols: ['postgresql', 'mysql']
  },

  // Connection pool settings
  DATABASE_POOL_MIN: {
    type: 'number',
    default: 2,
    min: 1
  },
  DATABASE_POOL_MAX: {
    type: 'number',
    default: 10,
    min: 1,
    max: 100
  },

  // Redis cache
  REDIS_URL: {
    type: 'url',
    required: false,
    protocols: ['redis', 'rediss']
  }
});
```

### Analytics & Monitoring

```typescript
export const env = createEnv({
  // Server-side monitoring
  SENTRY_DSN: {
    type: 'url',
    required: false
  },
  SENTRY_AUTH_TOKEN: {
    type: 'string',
    required: false
  },

  // Client-side analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: {
    type: 'string',
    required: false,
    pattern: /^G-/
  },
  NEXT_PUBLIC_POSTHOG_KEY: {
    type: 'string',
    required: false
  },
  NEXT_PUBLIC_MIXPANEL_TOKEN: {
    type: 'string',
    required: false
  }
});
```

### AI/ML APIs (OpenAI, Anthropic)

```typescript
export const env = createEnv({
  // OpenAI
  OPENAI_API_KEY: {
    type: 'string',
    required: false,
    pattern: /^sk-/,
    minLength: 40
  },
  OPENAI_ORG_ID: {
    type: 'string',
    required: false
  },

  // Anthropic
  ANTHROPIC_API_KEY: {
    type: 'string',
    required: false,
    pattern: /^sk-ant-/
  },

  // Model configuration
  AI_MODEL: {
    type: 'enum',
    values: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet'] as const,
    default: 'gpt-3.5-turbo'
  },
  AI_MAX_TOKENS: {
    type: 'number',
    default: 1000,
    min: 1,
    max: 4000
  }
});
```

### File Storage (S3, Cloudflare R2)

```typescript
export const env = createEnv({
  // AWS S3
  AWS_ACCESS_KEY_ID: {
    type: 'string',
    required: false
  },
  AWS_SECRET_ACCESS_KEY: {
    type: 'string',
    required: false
  },
  AWS_REGION: {
    type: 'string',
    default: 'us-east-1'
  },
  AWS_S3_BUCKET: {
    type: 'string',
    required: false
  },

  // Cloudflare R2
  R2_ACCOUNT_ID: {
    type: 'string',
    required: false
  },
  R2_ACCESS_KEY_ID: {
    type: 'string',
    required: false
  },
  R2_SECRET_ACCESS_KEY: {
    type: 'string',
    required: false
  }
});
```

### Feature Flags

```typescript
export const env = createEnv({
  // Server-side feature flags
  ENABLE_EXPERIMENTAL_FEATURES: {
    type: 'boolean',
    default: false
  },
  ENABLE_PREMIUM_FEATURES: {
    type: 'boolean',
    default: false
  },
  MAINTENANCE_MODE: {
    type: 'boolean',
    default: false
  },

  // Client-side feature flags
  NEXT_PUBLIC_ENABLE_NEW_UI: {
    type: 'boolean',
    default: false
  },
  NEXT_PUBLIC_ENABLE_BETA_FEATURES: {
    type: 'boolean',
    default: false
  }
});
```

### Multi-Environment Configuration

```typescript
export const env = createEnv({
  NODE_ENV: {
    type: 'enum',
    values: ['development', 'staging', 'production', 'test'] as const,
    required: true
  },

  // Environment-specific URLs
  APP_URL: {
    type: 'url',
    required: true
  },
  API_URL: {
    type: 'url',
    required: true
  },

  // Feature flags per environment
  ENABLE_DEBUG_LOGGING: {
    type: 'boolean',
    default: false  // true in development, false in production
  },
  RATE_LIMIT_PER_MINUTE: {
    type: 'number',
    default: 100,  // Lower in production, higher in development
    min: 1
  }
});
```

## Testing

Test with custom environments:

```typescript
import { createEnv } from 'smart-env';
import { describe, it, expect } from 'vitest';

describe('App configuration', () => {
  it('should load test environment', () => {
    const env = createEnv(
      {
        DATABASE_URL: { type: 'url', required: true },
        API_KEY: { type: 'string', required: true }
      },
      {
        env: {
          DATABASE_URL: 'postgresql://localhost:5432/test',
          API_KEY: 'test-key-123'
        }
      }
    );

    expect(env.DATABASE_URL).toBe('postgresql://localhost:5432/test');
    expect(env.API_KEY).toBe('test-key-123');
  });

  it('should validate types correctly', () => {
    expect(() => {
      createEnv(
        { PORT: { type: 'number', required: true } },
        { env: { PORT: 'not-a-number' } }
      );
    }).toThrow('Environment validation failed');
  });

  it('should use default values', () => {
    const env = createEnv(
      { DEBUG: { type: 'boolean', default: false } },
      { env: {} }
    );

    expect(env.DEBUG).toBe(false);
  });
});
```

## Best Practices

1. **Define all environment variables in your schema** - Don't use `process.env` directly
2. **Use `required: true` for critical variables** - Fail fast on startup
3. **Provide sensible defaults** - Make local development easier
4. **Add descriptions** - Document what each variable does
5. **Use strict types** - Prefer `enum` over `string` when possible
6. **Validate in CI/CD** - Catch configuration errors before deployment
7. **Keep secrets secret** - Never commit `.env` files

## TypeScript Support

smart-env provides full type inference:

```typescript
const env = createEnv({
  PORT: { type: 'number', default: 3000 },
  NODE_ENV: { type: 'enum', values: ['dev', 'prod'] as const }
});

// TypeScript knows these types:
env.PORT;      // number
env.NODE_ENV;  // 'dev' | 'prod'
```

## Migration Guide

### From dotenv

```typescript
// Before
require('dotenv').config();
const port = parseInt(process.env.PORT || '3000');

// After
import { env } from './env.config';
const port = env.PORT; // Already a number with default 3000
```

### From envalid

```typescript
// Before
import { cleanEnv, port, str } from 'envalid';
const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  API_KEY: str()
});

// After
import { createEnv } from 'smart-env';
const env = createEnv({
  PORT: { type: 'number', default: 3000 },
  API_KEY: { type: 'string', required: true }
});
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/MainaJoseph/smart-env).

## License

MIT

## Support

- Documentation: [GitHub README](https://github.com/MainaJoseph/smart-env)
- Issues: [GitHub Issues](https://github.com/MainaJoseph/smart-env/issues)
- NPM: [npm package](https://www.npmjs.com/package/smart-env)
