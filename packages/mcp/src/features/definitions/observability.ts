import type { Feature } from '../types.js';

export const observability: Feature = {
  name: 'Observability',
  description: 'Sentry error tracking with source maps (opt-out via VITE_SENTRY_ENABLED=false)',
  required: false,
  includes: [
    'Sentry React SDK (@sentry/react)',
    'Lazy-loaded Sentry initialization (non-blocking)',
    'Browser tracing integration',
    'Global error handlers (window.onerror, unhandledrejection)',
    'ErrorBoundary integration with Sentry reporting',
    'Source map upload via Vite plugin (CI/CD)',
    'VITE_SENTRY_ENABLED flag for opt-out',
    'SENTRY_CONFIG in lib/config.ts',
  ],
  dependencyNames: ['@sentry/react'],
  devDependencyNames: ['@sentry/vite-plugin'],
  files: ['src/lib/config.ts'],
  patterns: ['main-entry', 'lib-config'],
  scripts: {},
};
