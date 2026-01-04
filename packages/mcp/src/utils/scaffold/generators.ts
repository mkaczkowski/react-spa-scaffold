// noinspection JSUnresolvedReference

/**
 * Content generators for env.ts, routes.ts, vite-env.d.ts.
 * CLAUDE.md generation moved to ./claude-md/
 */

import { FEATURE } from '../../constants.js';
import type { FeatureId } from '../../features/types.js';

export { generateClaudeMd } from './claude-md/index.js';

/** Generate vite-env.d.ts content based on selected features. */
export function generateViteEnvDts(featureIds: FeatureId[]): string {
  const sections: string[] = [];

  // Module declaration for i18n .po files
  if (featureIds.includes(FEATURE.I18N)) {
    sections.push(`declare module '*.po' {
  import type { Messages } from '@lingui/core';
  export const messages: Messages;
}`);
  }

  // Custom app environment variables
  const envVars: string[] = ['  readonly VITE_APP_NAME: string;', '  readonly VITE_APP_URL: string;'];

  if (featureIds.includes(FEATURE.API)) {
    envVars.push('  readonly VITE_API_URL: string;');
  }

  if (featureIds.includes(FEATURE.OBSERVABILITY)) {
    envVars.push('  readonly VITE_SENTRY_DSN: string;');
    envVars.push('  readonly VITE_SENTRY_ENABLED: string;');
  }

  if (featureIds.includes(FEATURE.PERFORMANCE)) {
    envVars.push('  readonly VITE_PERF_TEST: string;');
  }

  if (featureIds.includes(FEATURE.AUTH)) {
    envVars.push('  readonly VITE_CLERK_PUBLISHABLE_KEY: string;');
  }

  if (featureIds.includes(FEATURE.DATABASE)) {
    envVars.push('  readonly VITE_SUPABASE_DATABASE_URL: string;');
    envVars.push('  readonly VITE_SUPABASE_ANON_KEY: string;');
  }

  // Vite built-in env vars (always required for TypeScript)
  envVars.push("  readonly MODE: 'development' | 'production' | 'test';");
  envVars.push('  readonly DEV: boolean;');
  envVars.push('  readonly PROD: boolean;');

  sections.push(`/// <reference types="vite/client" />

interface ImportMetaEnv {
${envVars.join('\n')}
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot?: import('vite/types/hot.d.ts').ViteHotContext;
}`);

  return sections.join('\n\n') + '\n';
}

/** Generate env.ts content based on selected features. */
export function generateEnvTs(featureIds: FeatureId[]): string {
  // Check if we need the booleanEnv helper
  const needsBooleanEnv = featureIds.includes(FEATURE.OBSERVABILITY) || featureIds.includes(FEATURE.PERFORMANCE);

  const schemaFields: string[] = ['  VITE_APP_NAME: z.string().min(1),', '  VITE_APP_URL: z.string().url(),'];
  const envFields: string[] = [
    '    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,',
    '    VITE_APP_URL: import.meta.env.VITE_APP_URL,',
  ];

  if (featureIds.includes(FEATURE.API)) {
    schemaFields.push('  VITE_API_URL: z.string().url(),');
    envFields.push('    VITE_API_URL: import.meta.env.VITE_API_URL,');
  }

  if (featureIds.includes(FEATURE.OBSERVABILITY)) {
    schemaFields.push('  VITE_SENTRY_DSN: z.string().url(),');
    schemaFields.push('  VITE_SENTRY_ENABLED: booleanEnv,');
    envFields.push('    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,');
    envFields.push('    VITE_SENTRY_ENABLED: import.meta.env.VITE_SENTRY_ENABLED,');
  }

  if (featureIds.includes(FEATURE.AUTH)) {
    schemaFields.push('  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),');
    envFields.push('    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,');
  }

  if (featureIds.includes(FEATURE.DATABASE)) {
    schemaFields.push('  VITE_SUPABASE_DATABASE_URL: z.string().url(),');
    schemaFields.push('  VITE_SUPABASE_ANON_KEY: z.string().min(1),');
    envFields.push('    VITE_SUPABASE_DATABASE_URL: import.meta.env.VITE_SUPABASE_DATABASE_URL,');
    envFields.push('    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,');
  }

  if (featureIds.includes(FEATURE.PERFORMANCE)) {
    schemaFields.push('  VITE_PERF_TEST: booleanEnv,');
    envFields.push('    VITE_PERF_TEST: import.meta.env.VITE_PERF_TEST,');
  }

  // Vite built-in env vars (always included)
  schemaFields.push("  MODE: z.enum(['development', 'production', 'test']),");
  schemaFields.push('  DEV: z.boolean(),');
  schemaFields.push('  PROD: z.boolean(),');
  envFields.push('    MODE: import.meta.env.MODE,');
  envFields.push('    DEV: import.meta.env.DEV,');
  envFields.push('    PROD: import.meta.env.PROD,');

  // Build the booleanEnv helper if needed
  const booleanEnvHelper = needsBooleanEnv
    ? `
/**
 * Transforms string env var to boolean.
 * - 'true', '1' → true
 * - 'false', '0' → false
 */
const booleanEnv = z.enum(['true', 'false', '1', '0']).transform((val) => val === 'true' || val === '1');

`
    : '';

  return `/**
 * Environment variable validation using Zod.
 * Validates at runtime to catch missing/invalid env vars early.
 *
 * All env vars are REQUIRED. The MCP scaffold tool strips unused vars
 * when scaffolding builds without certain features.
 */

import { z } from 'zod';
${booleanEnvHelper}
const envSchema = z.object({
${schemaFields.join('\n')}
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables and return typed env object.
 * Throws if any required env var is missing or invalid.
 */
export function validateEnv(): Env {
  const env = {
${envFields.join('\n')}
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.flatten();
    const fieldErrors = Object.entries(errors.fieldErrors)
      .map(([key, msgs]) => \`\${key}: \${(msgs as string[]).join(', ')}\`)
      .join('; ');
    const formErrors = errors.formErrors.join('; ');
    const allErrors = [fieldErrors, formErrors].filter(Boolean).join('; ');

    throw new Error(\`Environment validation failed: \${allErrors}\`);
  }

  return result.data;
}

/**
 * Validated environment variables.
 * Access this instead of import.meta.env for type safety.
 */
export const env = validateEnv();
`;
}

/** Generates routes.ts content based on selected features. */
export function generateRoutesTs(featureIds: FeatureId[]): string {
  const routes: string[] = ["  HOME: '/',"];

  // Add PROFILE route when database feature is selected
  if (featureIds.includes(FEATURE.DATABASE)) {
    routes.push("  PROFILE: '/profile',");
  }

  routes.push("  NOT_FOUND: '*',");

  return `/**
 * Typed route constants.
 * Use these instead of hardcoded strings for type-safe navigation.
 */

export const ROUTES = {
${routes.join('\n')}
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
`;
}
