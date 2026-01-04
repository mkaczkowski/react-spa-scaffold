/**
 * Supabase client factory with Clerk authentication integration.
 *
 * Uses the modern `accessToken` pattern for third-party auth providers.
 * The Clerk session token is automatically injected into Supabase requests.
 *
 * @see https://supabase.com/docs/guides/auth/third-party/clerk
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

import { env } from '../env';

/**
 * Typed Supabase client with database schema.
 */
export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Token getter function type.
 * Returns the Clerk session token or null if not authenticated.
 */
export type GetTokenFn = () => Promise<string | null>;

/**
 * Creates a Supabase client configured with Clerk authentication.
 *
 * Uses the `accessToken` configuration option which is the recommended
 * approach for third-party auth providers like Clerk.
 *
 * @param getToken - Async function that returns the Clerk session token
 * @returns Typed Supabase client
 * @throws Error if Supabase environment variables are not configured
 *
 * @example
 * ```tsx
 * const { session } = useSession();
 * const supabase = createSupabaseClient(() => session?.getToken() ?? null);
 *
 * // Now use supabase with Clerk auth
 * const { data } = await supabase.from('profiles').select();
 * ```
 */
export function createSupabaseClient(getToken: GetTokenFn): TypedSupabaseClient {
  const supabaseUrl = env.VITE_SUPABASE_DATABASE_URL;
  const supabaseApiKey = env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseApiKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Set VITE_SUPABASE_DATABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
    );
  }

  return createClient<Database>(supabaseUrl, supabaseApiKey, {
    accessToken: getToken,
  });
}
