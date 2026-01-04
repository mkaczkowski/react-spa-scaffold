import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';

import {
  createTestQueryClient,
  setMockClerkSignedIn,
  setMockClerkUser,
  resetClerkMocks,
  createProfile,
  setMockSupabaseData,
  resetSupabaseMocks,
} from '@/test';

import { useCurrentProfile, useProfile, useUpsertProfile, useUpdateProfile, useDeleteProfile } from './useProfiles';

function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useCurrentProfile', () => {
  beforeEach(() => {
    resetClerkMocks();
    resetSupabaseMocks();
  });

  it('fetches profile when user is signed in', async () => {
    const profile = createProfile({ id: 'user-123', full_name: 'Test User' });
    setMockSupabaseData([profile]);
    setMockClerkUser({ id: 'user-123' });

    const { result } = renderHook(() => useCurrentProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].full_name).toBe('Test User');
  });

  it('does not fetch when user is not signed in', async () => {
    setMockClerkSignedIn(false);

    const { result } = renderHook(() => useCurrentProfile(), {
      wrapper: createWrapper(),
    });

    // Query should be disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe('useProfile', () => {
  beforeEach(() => {
    resetClerkMocks();
    resetSupabaseMocks();
  });

  it('returns profile object and exists flag', async () => {
    const profile = createProfile({ id: 'user-123', full_name: 'Test User' });
    setMockSupabaseData([profile]);
    setMockClerkUser({ id: 'user-123' });

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile?.full_name).toBe('Test User');
    expect(result.current.exists).toBe(true);
  });

  it('returns null profile when not found', async () => {
    setMockSupabaseData([]);
    setMockClerkUser({ id: 'user-123' });

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.exists).toBe(false);
  });

  it('exposes isFetching and refetch', async () => {
    const profile = createProfile({ id: 'user-123' });
    setMockSupabaseData([profile]);
    setMockClerkUser({ id: 'user-123' });

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.isFetching).toBe('boolean');
    expect(typeof result.current.refetch).toBe('function');
  });
});

describe('useUpsertProfile', () => {
  beforeEach(() => {
    resetClerkMocks();
    resetSupabaseMocks();
  });

  it('returns mutation function', () => {
    const { result } = renderHook(() => useUpsertProfile(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.mutate).toBe('function');
    expect(typeof result.current.mutateAsync).toBe('function');
    expect(result.current.isIdle).toBe(true);
  });
});

describe('useUpdateProfile', () => {
  beforeEach(() => {
    resetClerkMocks();
    resetSupabaseMocks();
  });

  it('returns mutation function', () => {
    setMockClerkUser({ id: 'user-123' });

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.mutate).toBe('function');
    expect(typeof result.current.mutateAsync).toBe('function');
    expect(result.current.isIdle).toBe(true);
  });

  it('throws when user is not authenticated', async () => {
    setMockClerkSignedIn(false);

    const { result } = renderHook(() => useUpdateProfile(), {
      wrapper: createWrapper(),
    });

    let errorThrown = false;
    try {
      await result.current.mutateAsync({ full_name: 'Test' });
    } catch (error) {
      errorThrown = true;
      expect((error as Error).message).toBe('No authenticated user');
    }

    expect(errorThrown).toBe(true);
  });
});

describe('useDeleteProfile', () => {
  beforeEach(() => {
    resetClerkMocks();
    resetSupabaseMocks();
  });

  it('returns mutation function', () => {
    setMockClerkUser({ id: 'user-123' });

    const { result } = renderHook(() => useDeleteProfile(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.mutate).toBe('function');
    expect(typeof result.current.mutateAsync).toBe('function');
    expect(result.current.isIdle).toBe(true);
  });

  it('throws when user is not authenticated', async () => {
    setMockClerkSignedIn(false);

    const { result } = renderHook(() => useDeleteProfile(), {
      wrapper: createWrapper(),
    });

    let errorThrown = false;
    try {
      await result.current.mutateAsync();
    } catch (error) {
      errorThrown = true;
      expect((error as Error).message).toBe('No authenticated user');
    }

    expect(errorThrown).toBe(true);
  });
});
