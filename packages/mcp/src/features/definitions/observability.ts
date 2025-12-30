import type { Feature } from '../types.js';

export const observability: Feature = {
  name: 'Observability',
  description: 'Sentry error tracking with source maps (opt-out via VITE_SENTRY_ENABLED=false)',
  required: false,
  dependencies: ['@sentry/react'],
  devDependencies: ['@sentry/vite-plugin'],
  files: ['src/lib/config.ts'],
  scripts: {},
};
