// noinspection JSUnresolvedReference

/**
 * Content generators for env.ts, routes.ts, vite-env.d.ts.
 * CLAUDE.md generation moved to ./claude-md/
 */

import type { FeatureId } from '../../features/types.js';

// Re-export CLAUDE.md generator from dedicated module
export { generateClaudeMd } from './claude-md/index.js';

/**
 * Generate vite-env.d.ts content based on selected features
 */
export function generateViteEnvDts(featureIds: FeatureId[]): string {
  const sections: string[] = [];

  // Add .po module declaration if i18n feature is selected (LinguiJS uses .po files)
  if (featureIds.includes('i18n')) {
    sections.push(`declare module '*.po' {
  import type { Messages } from '@lingui/core';
  export const messages: Messages;
}`);
  }

  // Build env vars section
  const envVars: string[] = [];

  // Core env vars (always included)
  envVars.push('  readonly VITE_APP_NAME: string;');
  envVars.push('  readonly VITE_APP_URL: string;');

  // API feature env vars
  if (featureIds.includes('api')) {
    envVars.push('  readonly VITE_API_URL: string;');
  }

  // Observability feature env vars
  if (featureIds.includes('observability')) {
    envVars.push('  readonly VITE_SENTRY_DSN: string;');
    envVars.push('  readonly VITE_SENTRY_ENABLED: string;');
  }

  sections.push(`/// <reference types="vite/client" />

interface ImportMetaEnv {
${envVars.join('\n')}
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}`);

  return sections.join('\n\n') + '\n';
}

/**
 * Generate env.ts content based on selected features
 */
export function generateEnvTs(featureIds: FeatureId[]): string {
  const schemaFields: string[] = [];
  const envFields: string[] = [];

  // Core env vars (always included)
  schemaFields.push('  VITE_APP_NAME: z.string().min(1).optional(),');
  schemaFields.push('  VITE_APP_URL: z.string().url().optional(),');
  envFields.push('    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,');
  envFields.push('    VITE_APP_URL: import.meta.env.VITE_APP_URL,');

  // API feature env vars
  if (featureIds.includes('api')) {
    schemaFields.push('  VITE_API_URL: z.string().url().optional(),');
    envFields.push('    VITE_API_URL: import.meta.env.VITE_API_URL,');
  }

  // Observability feature env vars
  if (featureIds.includes('observability')) {
    schemaFields.push('  VITE_SENTRY_DSN: z.string().url().optional(),');
    schemaFields.push('  VITE_SENTRY_ENABLED: z.string().optional(),');
    envFields.push('    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,');
    envFields.push('    VITE_SENTRY_ENABLED: import.meta.env.VITE_SENTRY_ENABLED,');
  }

  // Vite built-in env vars (always included)
  schemaFields.push("  MODE: z.enum(['development', 'production', 'test']).default('development'),");
  schemaFields.push('  DEV: z.boolean().default(false),');
  schemaFields.push('  PROD: z.boolean().default(false),');
  envFields.push('    MODE: import.meta.env.MODE,');
  envFields.push('    DEV: import.meta.env.DEV,');
  envFields.push('    PROD: import.meta.env.PROD,');

  return `/**
 * Environment variable validation using Zod.
 * Validates at runtime to catch missing/invalid env vars early.
 */

import { z } from 'zod';

const envSchema = z.object({
${schemaFields.join('\n')}
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables and return typed env object.
 * Throws if validation fails in production.
 */
export function validateEnv(): Env {
  const env = {
${envFields.join('\n')}
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.format();
    console.error('Environment validation failed:', errors);

    if (import.meta.env.PROD) {
      throw new Error('Invalid environment configuration');
    }
  }

  return result.data
}

/**
 * Validated environment variables.
 * Access this instead of import.meta.env for type safety.
 */
export const env = validateEnv();
`;
}

/** Generates routes.ts content. */
export function generateRoutesTs(): string {
  return `/**
 * Typed route constants.
 * Use these instead of hardcoded strings for type-safe navigation.
 */

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '*',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
`;
}
