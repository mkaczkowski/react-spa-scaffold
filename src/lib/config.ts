/**
 * Application configuration.
 * Centralized config for feature flags, etc.
 * Note: API_CONFIG is in api.ts (only included with data feature)
 */

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "My App",
  url: import.meta.env.VITE_APP_URL || "http://localhost:5173",
} as const;

export const SENTRY_CONFIG = {
  enabled: import.meta.env.VITE_SENTRY_ENABLED !== "false",
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 0.1,
} as const;
