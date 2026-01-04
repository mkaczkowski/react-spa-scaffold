/**
 * Application configuration.
 * Centralized config for feature flags, etc.
 *
 * All environment variables flow through the validated `env` object from env.ts.
 */

import { env } from './env';

// =============================================================================
// App Configuration
// =============================================================================

export const APP_CONFIG = {
  name: env.VITE_APP_NAME,
  url: env.VITE_APP_URL,
} as const;

// =============================================================================
// API Configuration
// =============================================================================

export const API_CONFIG = {
  baseUrl: env.VITE_API_URL,
  timeout: 30000,
} as const;

// =============================================================================
// Sentry Configuration
// =============================================================================

export const SENTRY_CONFIG = {
  enabled: env.VITE_SENTRY_ENABLED,
  dsn: env.VITE_SENTRY_DSN,
  environment: env.MODE,
  tracesSampleRate: 0.1,
} as const;

// =============================================================================
// Clerk Configuration
// =============================================================================

export const CLERK_CONFIG = {
  publishableKey: env.VITE_CLERK_PUBLISHABLE_KEY,
} as const;

// =============================================================================
// Supabase Configuration
// =============================================================================

export const SUPABASE_CONFIG = {
  url: env.VITE_SUPABASE_DATABASE_URL,
  anonKey: env.VITE_SUPABASE_ANON_KEY,
  /** Whether both URL and anon key are configured */
  isConfigured: Boolean(env.VITE_SUPABASE_DATABASE_URL && env.VITE_SUPABASE_ANON_KEY),
} as const;

// =============================================================================
// Performance Configuration
// =============================================================================

export const PERFORMANCE_CONFIG = {
  /** Enable performance tracking in dev or when VITE_PERF_TEST is set */
  enabled: env.DEV || env.VITE_PERF_TEST,
} as const;
