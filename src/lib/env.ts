/**
 * Environment variable validation using Zod.
 * Validates at runtime to catch missing/invalid env vars early.
 *
 * All env vars are REQUIRED. The MCP scaffold tool strips unused vars
 * when scaffolding builds without certain features.
 */

import { z } from 'zod';

/**
 * Transforms string env var to boolean.
 * - 'true', '1' → true
 * - 'false', '0' → false
 */
const booleanEnv = z.enum(['true', 'false', '1', '0']).transform((val) => val === 'true' || val === '1');

const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1),
  VITE_APP_URL: z.string().url(),
  VITE_API_URL: z.string().url(),
  VITE_SENTRY_DSN: z.string().url(),
  VITE_SENTRY_ENABLED: booleanEnv,
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  VITE_SUPABASE_DATABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_PERF_TEST: booleanEnv,
  MODE: z.enum(['development', 'production', 'test']),
  DEV: z.boolean(),
  PROD: z.boolean(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables and return typed env object.
 * Throws if any required env var is missing or invalid.
 */
export function validateEnv(): Env {
  const env = {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_SENTRY_ENABLED: import.meta.env.VITE_SENTRY_ENABLED,
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    VITE_SUPABASE_DATABASE_URL: import.meta.env.VITE_SUPABASE_DATABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_PERF_TEST: import.meta.env.VITE_PERF_TEST,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.flatten();
    const fieldErrors = Object.entries(errors.fieldErrors)
      .map(([key, msgs]) => `${key}: ${(msgs as string[]).join(', ')}`)
      .join('; ');
    const formErrors = errors.formErrors.join('; ');
    const allErrors = [fieldErrors, formErrors].filter(Boolean).join('; ');

    throw new Error(`Environment validation failed: ${allErrors}`);
  }

  return result.data;
}

/**
 * Validated environment variables.
 * Access this instead of import.meta.env for type safety.
 */
export const env = validateEnv();
