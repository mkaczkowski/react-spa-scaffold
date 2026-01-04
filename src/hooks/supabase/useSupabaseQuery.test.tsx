import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, it, expect, beforeEach } from 'vitest';

import {
  createTestQueryClient,
  createProfile,
  setMockSupabaseData,
  setMockSupabaseError,
  resetSupabaseMocks,
} from '@/test';
import type { Profile } from '@/types/database';

import { useSupabaseQuery } from './useSupabaseQuery';

function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useSupabaseQuery', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  it('returns empty array when no data', async () => {
    setMockSupabaseData([]);

    const { result } = renderHook(
      () =>
        useSupabaseQuery<Profile>({
          table: 'profiles',
          queryKey: ['test'],
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });

  it('returns data when available', async () => {
    const profile = createProfile({ id: 'user-1', full_name: 'Test User' });
    setMockSupabaseData([profile]);

    const { result } = renderHook(
      () =>
        useSupabaseQuery<Profile>({
          table: 'profiles',
          queryKey: ['test'],
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].full_name).toBe('Test User');
  });

  it('returns error when query fails', async () => {
    setMockSupabaseError({ message: 'Database error', code: 'DB_ERROR' });

    const { result } = renderHook(
      () =>
        useSupabaseQuery<Profile>({
          table: 'profiles',
          queryKey: ['test-error'],
          queryOptions: { retry: false },
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Database error');
  });

  it('applies custom select', async () => {
    const profile = createProfile({ id: 'user-1' });
    setMockSupabaseData([profile]);

    const { result } = renderHook(
      () =>
        useSupabaseQuery<Profile>({
          table: 'profiles',
          select: 'id, full_name',
          queryKey: ['test-select'],
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it('applies filter function', async () => {
    const profile = createProfile({ id: 'user-1' });
    setMockSupabaseData([profile]);

    const { result } = renderHook(
      () =>
        useSupabaseQuery<Profile>({
          table: 'profiles',
          filter: (query) => query.eq('id', 'user-1'),
          queryKey: ['test-filter'],
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
  });

  it('respects enabled option', async () => {
    const profile = createProfile();
    setMockSupabaseData([profile]);

    const { result } = renderHook(
      () =>
        useSupabaseQuery<Profile>({
          table: 'profiles',
          queryKey: ['test-disabled'],
          queryOptions: { enabled: false },
        }),
      { wrapper: createWrapper() },
    );

    // Query should not run when disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
