/**
 * ProfileSync - Invisible component that syncs Clerk user data to Supabase.
 *
 * This component ensures the authenticated user's profile exists in Supabase
 * and stays in sync with their Clerk account data. It runs once per session
 * and handles first-time profile creation automatically.
 *
 * @example
 * ```tsx
 * // Add to your app layout or protected routes
 * function App() {
 *   return (
 *     <>
 *       <ProfileSync />
 *       <Routes>...</Routes>
 *     </>
 *   );
 * }
 * ```
 */

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/react-router';

import { useCurrentProfile, useUpsertProfile } from '@/hooks';

interface ProfileSyncProps {
  /**
   * Callback fired when profile sync completes successfully.
   */
  onSyncComplete?: () => void;
  /**
   * Callback fired when profile sync fails.
   */
  onSyncError?: (error: Error) => void;
}

/**
 * Syncs the current Clerk user's data to Supabase profiles table.
 *
 * This component:
 * 1. Waits for Clerk user to be loaded
 * 2. Checks if a profile already exists
 * 3. Creates or updates the profile if needed
 * 4. Only syncs once per component mount to prevent loops
 *
 * The sync uses upsert, so it's safe to call multiple times - it will
 * create the profile if it doesn't exist, or update if data changed.
 */
export function ProfileSync({ onSyncComplete, onSyncError }: ProfileSyncProps) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { data: profiles, isLoading: isProfileLoading } = useCurrentProfile();
  const { mutate: upsertProfile } = useUpsertProfile();

  // Track if we've already synced this session to prevent infinite loops
  const hasAttempted = useRef(false);
  const isSyncing = useRef(false);

  useEffect(() => {
    // Skip if already synced, currently syncing, or data not ready
    if (hasAttempted.current || isSyncing.current) return;
    if (!isUserLoaded || !user) return;
    if (isProfileLoading) return;

    const existingProfile = profiles?.[0];

    // Check if sync is needed:
    // - No profile exists, OR
    // - Email has changed (user updated in Clerk)
    const needsSync = !existingProfile || existingProfile.email !== user.primaryEmailAddress?.emailAddress;

    if (!needsSync) {
      hasAttempted.current = true;
      return;
    }

    // Perform the sync
    isSyncing.current = true;

    upsertProfile(
      {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? '',
        full_name: user.fullName ?? null,
        avatar_url: user.imageUrl ?? null,
      },
      {
        onSuccess: () => {
          hasAttempted.current = true;
          isSyncing.current = false;
          onSyncComplete?.();
        },
        onError: (error) => {
          isSyncing.current = false;
          // Don't set hasAttempted so it can retry on next render
          onSyncError?.(new Error(error.message));
        },
      },
    );
  }, [isUserLoaded, user, profiles, isProfileLoading, upsertProfile, onSyncComplete, onSyncError]);

  // This component renders nothing - it's purely for side effects
  return null;
}
