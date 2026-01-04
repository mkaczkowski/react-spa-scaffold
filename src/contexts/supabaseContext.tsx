/**
 * Supabase context provider with Clerk authentication integration.
 *
 * Provides a typed Supabase client that automatically uses Clerk session tokens
 * for authentication. Must be placed inside ClerkProvider in the component tree.
 *
 * @see https://supabase.com/docs/guides/auth/third-party/clerk
 */

import { useSession } from '@clerk/react-router';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { createSupabaseClient, type TypedSupabaseClient } from '@/lib/supabase';

const SupabaseContext = createContext<TypedSupabaseClient | null>(null);

interface SupabaseProviderProps {
  children: ReactNode;
}

/**
 * Provides a Supabase client with Clerk authentication to the app.
 *
 * The client automatically injects Clerk session tokens into Supabase requests,
 * enabling Row Level Security (RLS) policies based on `auth.uid()`.
 *
 * Must be placed INSIDE ClerkProvider in the provider hierarchy since it
 * requires access to the Clerk session via useSession().
 *
 * @example
 * ```tsx
 * // In main.tsx
 * <ClerkThemeProvider>
 *   <SupabaseProvider>
 *     <App />
 *   </SupabaseProvider>
 * </ClerkThemeProvider>
 * ```
 */
export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const { session } = useSession();

  // Create client with stable getToken reference
  // Only recreate when session ID changes (sign in/out), not on every render
  const supabase = useMemo(
    () =>
      createSupabaseClient(async () => {
        if (!session) return null;
        return session.getToken();
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- session.id is stable, session object is not
    [session?.id],
  );

  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>;
}

/**
 * Hook to access the Supabase client.
 *
 * Returns a typed Supabase client that automatically handles Clerk authentication.
 * All database operations will use RLS policies based on the current user.
 *
 * @throws Error if used outside SupabaseProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const supabase = useSupabase();
 *
 *   // Fetch user's own profile (RLS enforced)
 *   const { data } = await supabase
 *     .from('profiles')
 *     .select('*')
 *     .single();
 * }
 * ```
 */
export function useSupabase(): TypedSupabaseClient {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }

  return context;
}
