/**
 * Complete Next.js Integration Example
 *
 * This shows how to properly use smart-env with Next.js,
 * handling both server-side and client-side environment variables
 */

import { createEnv } from 'smart-env';

/**
 * Environment configuration for Next.js
 *
 * IMPORTANT Next.js Rules:
 * - Server-only variables: Keep them without prefix (DATABASE_URL, API_SECRET, etc.)
 * - Client-side variables: Must start with NEXT_PUBLIC_ prefix
 * - Validation happens at build time and runtime
 */
export const env = createEnv({
  // ==========================================
  // Server-side only variables
  // (Never exposed to the browser)
  // ==========================================

  NODE_ENV: {
    type: 'enum',
    values: ['development', 'production', 'test'] as const,
    default: 'development',
    description: 'Application environment'
  },

  DATABASE_URL: {
    type: 'url',
    required: true,
    protocols: ['postgresql', 'mysql', 'mongodb'],
    description: 'Database connection string'
  },

  NEXTAUTH_SECRET: {
    type: 'string',
    required: true,
    minLength: 32,
    description: 'NextAuth.js secret for JWT encryption'
  },

  NEXTAUTH_URL: {
    type: 'url',
    required: true,
    description: 'Canonical URL of your site'
  },

  // Third-party API keys (server-side)
  STRIPE_SECRET_KEY: {
    type: 'string',
    required: false,
    pattern: /^sk_(test|live)_/,
    description: 'Stripe secret key for payment processing'
  },

  SENDGRID_API_KEY: {
    type: 'string',
    required: false,
    description: 'SendGrid API key for emails'
  },

  OPENAI_API_KEY: {
    type: 'string',
    required: false,
    pattern: /^sk-/,
    description: 'OpenAI API key'
  },

  // ==========================================
  // Client-side variables (browser-exposed)
  // Must be prefixed with NEXT_PUBLIC_
  // ==========================================

  NEXT_PUBLIC_APP_URL: {
    type: 'url',
    required: true,
    description: 'Public-facing application URL'
  },

  NEXT_PUBLIC_API_URL: {
    type: 'url',
    required: true,
    description: 'API endpoint URL'
  },

  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    type: 'string',
    required: false,
    pattern: /^pk_(test|live)_/,
    description: 'Stripe publishable key (safe for client)'
  },

  NEXT_PUBLIC_ANALYTICS_ID: {
    type: 'string',
    required: false,
    description: 'Google Analytics tracking ID'
  },

  NEXT_PUBLIC_SENTRY_DSN: {
    type: 'url',
    required: false,
    description: 'Sentry DSN for error tracking'
  },

  NEXT_PUBLIC_ENABLE_ANALYTICS: {
    type: 'boolean',
    default: false,
    description: 'Enable/disable analytics'
  }
});

// Export type for use in your app
export type Env = typeof env;

/**
 * Usage in Next.js Pages Router:
 *
 * // pages/index.tsx
 * import { env } from '../env.config';
 *
 * export default function HomePage() {
 *   // Client-side variables work in components
 *   console.log(env.NEXT_PUBLIC_APP_URL);
 *
 *   return <div>Hello World</div>;
 * }
 *
 * export async function getServerSideProps() {
 *   // Server-side variables work here
 *   const dbUrl = env.DATABASE_URL;
 *
 *   return { props: {} };
 * }
 */

/**
 * Usage in Next.js App Router:
 *
 * // app/page.tsx (Server Component)
 * import { env } from '../env.config';
 *
 * export default async function HomePage() {
 *   // Server components can access all variables
 *   const data = await fetchFromDB(env.DATABASE_URL);
 *
 *   return <div>Hello World</div>;
 * }
 *
 * // app/components/ClientComponent.tsx (Client Component)
 * 'use client';
 * import { env } from '../env.config';
 *
 * export default function ClientComponent() {
 *   // Client components can only access NEXT_PUBLIC_ variables
 *   const apiUrl = env.NEXT_PUBLIC_API_URL;
 *
 *   return <div>{apiUrl}</div>;
 * }
 */

/**
 * Usage in API Routes:
 *
 * // pages/api/users.ts (Pages Router)
 * import { env } from '../../env.config';
 *
 * export default async function handler(req, res) {
 *   const db = await connectDB(env.DATABASE_URL);
 *   const users = await db.users.findMany();
 *   res.json(users);
 * }
 *
 * // app/api/users/route.ts (App Router)
 * import { env } from '../../env.config';
 *
 * export async function GET() {
 *   const db = await connectDB(env.DATABASE_URL);
 *   const users = await db.users.findMany();
 *   return Response.json(users);
 * }
 */

/**
 * Middleware usage:
 *
 * // middleware.ts
 * import { env } from './env.config';
 * import { NextResponse } from 'next/server';
 *
 * export function middleware(request) {
 *   // Access server-side env vars in middleware
 *   console.log('Auth URL:', env.NEXTAUTH_URL);
 *
 *   return NextResponse.next();
 * }
 */

/**
 * Example .env.local file for Next.js:
 *
 * # Server-only variables
 * NODE_ENV=development
 * DATABASE_URL=postgresql://localhost:5432/myapp
 * NEXTAUTH_SECRET=your-secret-key-here-min-32-chars
 * NEXTAUTH_URL=http://localhost:3000
 * STRIPE_SECRET_KEY=sk_test_xxxxx
 *
 * # Client-side variables (exposed to browser)
 * NEXT_PUBLIC_APP_URL=http://localhost:3000
 * NEXT_PUBLIC_API_URL=http://localhost:3000/api
 * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
 * NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX
 * NEXT_PUBLIC_ENABLE_ANALYTICS=true
 */

/**
 * Validate at build time (add to package.json):
 *
 * {
 *   "scripts": {
 *     "build": "smart-env validate && next build",
 *     "dev": "next dev",
 *     "start": "next start"
 *   }
 * }
 */

// You can also create helper functions to check which side you're on
export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

// Helper to safely access client vars
export function getClientEnv() {
  return {
    appUrl: env.NEXT_PUBLIC_APP_URL,
    apiUrl: env.NEXT_PUBLIC_API_URL,
    stripeKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    analyticsId: env.NEXT_PUBLIC_ANALYTICS_ID,
    sentryDsn: env.NEXT_PUBLIC_SENTRY_DSN,
    enableAnalytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS
  };
}

// Helper to safely access server vars (throws on client)
export function getServerEnv() {
  if (!isServer) {
    throw new Error('Server environment variables cannot be accessed on the client');
  }

  return {
    databaseUrl: env.DATABASE_URL,
    nextAuthSecret: env.NEXTAUTH_SECRET,
    nextAuthUrl: env.NEXTAUTH_URL,
    stripeSecret: env.STRIPE_SECRET_KEY,
    sendgridKey: env.SENDGRID_API_KEY,
    openaiKey: env.OPENAI_API_KEY
  };
}
