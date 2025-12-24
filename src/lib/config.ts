/**
 * Application configuration.
 * Centralized config for API URLs, feature flags, etc.
 */

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 30000,
} as const;

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'My App',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
} as const;

export const SENTRY_CONFIG = {
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 0.1,
} as const;
