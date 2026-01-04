/**
 * User profile hooks for Supabase with Clerk authentication.
 *
 * All operations are automatically scoped to the current user via RLS policies.
 * The profile `id` field corresponds to the Clerk user_id (`auth.uid()`).
 */

import { useUser } from '@clerk/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PostgrestError } from '@supabase/supabase-js';

import { useSupabase } from '@/contexts/supabaseContext';
import type { Profile, ProfileInsert, ProfileUpdate } from '@/types/database';

import { useSupabaseQuery } from './useSupabaseQuery';

/**
 * Hook to fetch the current user's profile (returns array).
 *
 * Uses Clerk's user ID to query the profile and automatically
 * respects RLS policies. For convenience, consider using `useProfile()`
 * which returns a single profile instead of an array.
 *
 * @example
 * ```tsx
 * function ProfilePage() {
 *   const { data: profiles, isLoading, error } = useCurrentProfile();
 *   const profile = profiles?.[0];
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <Error message={error.message} />;
 *   if (!profile) return <CreateProfileForm />;
 *
 *   return <ProfileDisplay profile={profile} />;
 * }
 * ```
 */
export function useCurrentProfile() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  return useSupabaseQuery<Profile>({
    table: 'profiles',
    filter: (query) => query.eq('id', userId ?? ''),
    queryKey: ['current', userId ?? ''],
    queryOptions: {
      enabled: isLoaded && !!userId,
    },
  });
}

/**
 * Convenience hook to fetch the current user's profile as a single object.
 *
 * This is a wrapper around `useCurrentProfile()` that extracts the first
 * profile from the array and provides a cleaner API for common use cases.
 *
 * @example
 * ```tsx
 * function ProfilePage() {
 *   const { profile, isLoading, error, exists } = useProfile();
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <Error message={error.message} />;
 *   if (!exists) return <CreateProfileForm />;
 *
 *   return <ProfileDisplay profile={profile} />;
 * }
 * ```
 */
export function useProfile() {
  const query = useCurrentProfile();
  const profile = query.data?.[0] ?? null;

  return {
    /** The user's profile, or null if not found */
    profile,
    /** Whether a profile exists for the current user */
    exists: profile !== null,
    /** Whether the query is currently loading */
    isLoading: query.isLoading,
    /** Whether the query is fetching (includes background refetches) */
    isFetching: query.isFetching,
    /** Error from the query, if any */
    error: query.error,
    /** Refetch the profile data */
    refetch: query.refetch,
  };
}

/**
 * Hook to create or update the current user's profile.
 *
 * Uses upsert to handle both creation and updates in a single operation.
 * This is useful for syncing Clerk user data to Supabase on first login.
 *
 * @example
 * ```tsx
 * function ProfileSync() {
 *   const { user } = useUser();
 *   const upsertProfile = useUpsertProfile();
 *
 *   useEffect(() => {
 *     if (user) {
 *       upsertProfile.mutate({
 *         id: user.id,
 *         email: user.primaryEmailAddress?.emailAddress ?? '',
 *         full_name: user.fullName,
 *         avatar_url: user.imageUrl,
 *       });
 *     }
 *   }, [user]);
 * }
 * ```
 */
export function useUpsertProfile() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation<Profile, PostgrestError, ProfileInsert>({
    mutationFn: async (profile) => {
      const { data, error } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' }).select().single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      // Invalidate profile queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['supabase', 'profiles'] });
    },
  });
}

/**
 * Hook to update the current user's profile.
 *
 * Only updates the specified fields, leaving others unchanged.
 *
 * @example
 * ```tsx
 * function EditProfileForm() {
 *   const updateProfile = useUpdateProfile();
 *
 *   const handleSubmit = (values: ProfileUpdate) => {
 *     updateProfile.mutate(values, {
 *       onSuccess: () => toast.success('Profile updated!'),
 *       onError: (error) => toast.error(error.message),
 *     });
 *   };
 * }
 * ```
 */
export function useUpdateProfile() {
  const { user } = useUser();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation<Profile, PostgrestError, ProfileUpdate>({
    mutationFn: async (updates) => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supabase', 'profiles'] });
    },
  });
}

/**
 * Hook to delete the current user's profile.
 *
 * Use with caution - this permanently removes the user's profile data.
 *
 * @example
 * ```tsx
 * function DeleteAccountButton() {
 *   const deleteProfile = useDeleteProfile();
 *
 *   const handleDelete = async () => {
 *     if (confirm('Are you sure? This cannot be undone.')) {
 *       await deleteProfile.mutateAsync();
 *       // User should be signed out after deletion
 *     }
 *   };
 * }
 * ```
 */
export function useDeleteProfile() {
  const { user } = useUser();
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError, void>({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      const { error } = await supabase.from('profiles').delete().eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['supabase', 'profiles'] });
    },
  });
}
