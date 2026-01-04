import { Trans, useLingui } from '@lingui/react/macro';
import { Profiler, useState } from 'react';

import { SEO } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { usePerformance } from '@/contexts/performanceContext';
import { useProfile, useSyncedState, useUpdateProfile } from '@/hooks';

/**
 * Profile page demonstrating Supabase database integration.
 * Shows current user's profile with ability to edit the name.
 */
export function ProfilePage() {
  const { t } = useLingui();
  const { onProfilerRender } = usePerformance();
  const { profile, isLoading, error, refetch } = useProfile();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);
  // Sync name with profile, blocking sync while editing
  const [name, setName] = useSyncedState(profile?.full_name ?? '', isEditing);

  // Extract error messages for i18n (avoids object property access in Trans)
  const fetchErrorMessage = error?.message;
  const updateErrorMessage = updateProfile.error?.message;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(profile?.full_name ?? '');
    setIsEditing(false);
  };

  const handleSave = () => {
    updateProfile.mutate(
      { full_name: name },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Profiler id="profile-page" onRender={onProfilerRender}>
      <div className="container mx-auto max-w-lg px-4 py-8">
        <SEO
          title={t({ message: 'Profile', comment: 'Profile page title for SEO' })}
          description={t({
            message: 'Manage your profile information',
            comment: 'Profile page meta description for SEO',
          })}
        />

        <Card>
          <CardHeader>
            <CardTitle>
              <Trans comment="Profile page card title">Your Profile</Trans>
            </CardTitle>
            <CardDescription>
              <Trans comment="Profile page card description">Manage your profile information stored in Supabase</Trans>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            )}

            {error && (
              <div className="space-y-4">
                <p className="text-destructive text-sm" role="alert">
                  <Trans comment="Error message when profile fails to load">
                    Failed to load profile: {fetchErrorMessage}
                  </Trans>
                </p>
                <Button variant="outline" onClick={() => refetch()}>
                  <Trans comment="Retry button label">Try Again</Trans>
                </Button>
              </div>
            )}

            {profile && (
              <div className="space-y-6">
                {/* Avatar and Email */}
                <div className="flex items-center gap-4">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={t({ message: 'Profile avatar', comment: 'Alt text for profile avatar image' })}
                      className="size-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                      <span className="text-muted-foreground text-xl">
                        {profile.full_name?.[0]?.toUpperCase() ?? profile.email[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{profile.full_name ?? profile.email}</p>
                    <p className="text-muted-foreground text-sm">{profile.email}</p>
                  </div>
                </div>

                {/* Name Editor */}
                <div className="space-y-2">
                  <Label htmlFor="full-name">
                    <Trans comment="Full name field label">Full Name</Trans>
                  </Label>
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-2">
                      <Input
                        id="full-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t({ message: 'Enter your name', comment: 'Name input placeholder' })}
                      />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={updateProfile.isPending}>
                          {updateProfile.isPending ? (
                            <Trans comment="Save button loading state">Saving...</Trans>
                          ) : (
                            <Trans comment="Save button label">Save</Trans>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={updateProfile.isPending}
                        >
                          <Trans comment="Cancel button label">Cancel</Trans>
                        </Button>
                      </div>
                      {updateProfile.error && (
                        <p className="text-destructive text-sm" role="alert">
                          <Trans comment="Error message when update fails">
                            Failed to update: {updateErrorMessage}
                          </Trans>
                        </p>
                      )}
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-muted-foreground">
                        {profile.full_name || <Trans comment="Placeholder when no name is set">Not set</Trans>}
                      </p>
                      <Button variant="ghost" size="sm" onClick={handleEdit}>
                        <Trans comment="Edit button label">Edit</Trans>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Profiler>
  );
}
