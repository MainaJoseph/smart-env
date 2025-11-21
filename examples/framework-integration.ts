/**
 * Framework integration examples
 */

// ============================================
// Express.js Integration
// ============================================

import express from 'express';
import { createEnv } from 'smart-env';

const env = createEnv({
  PORT: { type: 'number', default: 3000 },
  NODE_ENV: { type: 'enum', values: ['development', 'production'] as const },
  DATABASE_URL: { type: 'url', required: true },
  JWT_SECRET: { type: 'string', required: true, minLength: 32 }
});

const app = express();

// Use validated environment variables
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});

// ============================================
// Next.js Integration
// ============================================

// File: env.config.ts
export const nextEnv = createEnv({
  // Server-side variables
  DATABASE_URL: { type: 'url', required: true },
  API_SECRET: { type: 'string', required: true },

  // Public variables (prefix with NEXT_PUBLIC_)
  NEXT_PUBLIC_API_URL: { type: 'url', required: true },
  NEXT_PUBLIC_ANALYTICS_ID: { type: 'string', required: false }
});

// Use in Next.js API routes or pages
export default function handler(req, res) {
  // Access validated environment
  const dbUrl = nextEnv.DATABASE_URL;
  res.status(200).json({ status: 'ok' });
}

// ============================================
// NestJS Integration
// ============================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// File: config/env.config.ts
export const nestEnv = createEnv({
  PORT: { type: 'number', default: 3000 },
  DATABASE_URL: { type: 'url', required: true },
  JWT_SECRET: { type: 'string', required: true },
  REDIS_URL: { type: 'url', required: false }
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: () => nestEnv // Use smart-env for validation
    })
  ]
})
export class AppModule {}

// ============================================
// Fastify Integration
// ============================================

import Fastify from 'fastify';

const fastifyEnv = createEnv({
  PORT: { type: 'number', default: 3000 },
  HOST: { type: 'string', default: '0.0.0.0' },
  LOG_LEVEL: {
    type: 'enum',
    values: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const,
    default: 'info'
  }
});

const fastify = Fastify({
  logger: {
    level: fastifyEnv.LOG_LEVEL
  }
});

fastify.listen({
  port: fastifyEnv.PORT,
  host: fastifyEnv.HOST
});

// ============================================
// Docker Integration
// ============================================

/**
 * Dockerfile example with smart-env
 *
 * FROM node:18-alpine
 * WORKDIR /app
 * COPY package*.json ./
 * RUN npm ci
 * COPY . .
 *
 * # Validate environment at build time
 * RUN npx smart-env validate || exit 1
 *
 * RUN npm run build
 * EXPOSE 3000
 * CMD ["node", "dist/index.js"]
 */

/**
 * docker-compose.yml example
 *
 * version: '3.8'
 * services:
 *   app:
 *     build: .
 *     ports:
 *       - "${PORT:-3000}:3000"
 *     environment:
 *       - NODE_ENV=production
 *       - PORT=3000
 *       - DATABASE_URL=postgresql://user:pass@db:5432/mydb
 *       - JWT_SECRET=${JWT_SECRET}
 *     depends_on:
 *       - db
 *   db:
 *     image: postgres:15-alpine
 */

// ============================================
// Testing Integration
// ============================================

import { describe, it, expect } from 'vitest';

describe('Environment tests', () => {
  it('should load test environment', () => {
    const testEnv = createEnv(
      {
        DATABASE_URL: { type: 'url', required: true },
        JWT_SECRET: { type: 'string', required: true }
      },
      {
        env: {
          DATABASE_URL: 'postgresql://localhost:5432/test',
          JWT_SECRET: 'test-secret-key-for-testing-purposes'
        }
      }
    );

    expect(testEnv.DATABASE_URL).toBe('postgresql://localhost:5432/test');
  });
});
