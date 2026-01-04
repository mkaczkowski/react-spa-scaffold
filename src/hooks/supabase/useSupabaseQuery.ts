/**
 * Generic Supabase query hook with TanStack Query integration.
 *
 * Provides type-safe database queries with automatic Clerk authentication
 * and RLS policy enforcement.
 */

import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';

import { useSupabase } from '@/contexts/supabaseContext';
import type { TableName } from '@/types/database';

/**
 * Options for useSupabaseQuery hook.
 */
export interface UseSupabaseQueryOptions<TData> {
  /** The database table to query */
  table: TableName;
  /** Columns to select (defaults to '*') */
  select?: string;
  /** Optional filter function to apply conditions */
  filter?: (query: ReturnType<ReturnType<typeof useSupabase>['from']>) => unknown;
  /** Unique query key for caching (will be prefixed with ['supabase', table]) */
  queryKey: string[];
  /** Additional TanStack Query options */
  queryOptions?: Omit<UseQueryOptions<TData[], PostgrestError>, 'queryKey' | 'queryFn'>;
}

/**
 * Generic hook for Supabase SELECT queries with TanStack Query.
 *
 * Automatically applies Clerk authentication via the Supabase context,
 * ensuring RLS policies are enforced based on the current user.
 *
 * @example
 * ```tsx
 * // Simple query - fetch all user's profiles
 * const { data, isLoading } = useSupabaseQuery<Profile>({
 *   table: 'profiles',
 *   queryKey: ['all'],
 * });
 *
 * // Query with filter
 * const { data } = useSupabaseQuery<Profile>({
 *   table: 'profiles',
 *   select: 'id, full_name, avatar_url',
 *   filter: (query) => query.eq('id', userId),
 *   queryKey: ['single', userId],
 * });
 *
 * // Query with custom options
 * const { data } = useSupabaseQuery<Profile>({
 *   table: 'profiles',
 *   queryKey: ['current'],
 *   queryOptions: {
 *     staleTime: 1000 * 60 * 10, // 10 minutes
 *     enabled: !!userId,
 *   },
 * });
 * ```
 */
export function useSupabaseQuery<TData>({
  table,
  select = '*',
  filter,
  queryKey,
  queryOptions,
}: UseSupabaseQueryOptions<TData>): UseQueryResult<TData[], PostgrestError> {
  const supabase = useSupabase();

  return useQuery<TData[], PostgrestError>({
    queryKey: ['supabase', table, ...queryKey],
    queryFn: async () => {
      let query = supabase.from(table).select(select);

      if (filter) {
        query = filter(query) as typeof query;
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data ?? []) as TData[];
    },
    ...queryOptions,
  });
}
