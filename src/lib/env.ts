/**
 * Environment variable validation using Zod.
 * Validates at runtime to catch missing/invalid env vars early.
 */

import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1).optional(),
  VITE_APP_URL: z.string().url().optional(),
  VITE_API_URL: z.string().url().optional(),
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  DEV: z.boolean().default(false),
  PROD: z.boolean().default(false),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables and return typed env object.
 * Throws if validation fails in production.
 */
export function validateEnv(): Env {
  const env = {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.format();
    console.error('Environment validation failed:', errors);

    if (import.meta.env.PROD) {
      throw new Error('Invalid environment configuration');
    }
  }

  return result.success ? result.data : (env as Env);
}

/**
 * Validated environment variables.
 * Access this instead of import.meta.env for type safety.
 */
export const env = validateEnv();
