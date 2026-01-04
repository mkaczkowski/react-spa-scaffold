/**
 * Supabase hooks exports.
 *
 * Note: Generic mutation hooks were removed in favor of table-specific hooks
 * (like useProfiles) which provide better type safety with Supabase's complex types.
 */

// Generic query hook
export { useSupabaseQuery, type UseSupabaseQueryOptions } from './useSupabaseQuery';

// Domain-specific hooks (type-safe mutations)
export { useCurrentProfile, useProfile, useUpsertProfile, useUpdateProfile, useDeleteProfile } from './useProfiles';
