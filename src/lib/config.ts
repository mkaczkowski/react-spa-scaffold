/**
 * Application configuration.
 * Centralized config for feature flags, etc.
 */

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'My App',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
} as const;

export const SENTRY_CONFIG = {
  enabled: import.meta.env.VITE_SENTRY_ENABLED !== 'false',
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 0.1,
} as const;
