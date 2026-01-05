/**
 * Supabase mocks for testing.
 *
 * Provides mock implementations of the Supabase context and client,
 * with state controls for testing different scenarios.
 */

import type { ReactNode } from 'react';
import { vi } from 'vitest';

// Re-export fixtures for test convenience
export { createProfile, createProfiles, mockProfiles } from '@/mocks/fixtures/profiles';
export type { Profile } from '@/types/database';

// =============================================================================
// Mock State
// =============================================================================

interface SupabaseMockState {
  data: unknown[];
  error: { message: string; code: string } | null;
}

const defaultState: SupabaseMockState = {
  data: [],
  error: null,
};

let mockState: SupabaseMockState = { ...defaultState };

// =============================================================================
// State Controls
// =============================================================================

/** Set mock data to be returned by Supabase queries */
export function setMockSupabaseData(data: unknown[]) {
  mockState.data = data;
}

/** Set a mock error to be returned by Supabase queries */
export function setMockSupabaseError(error: { message: string; code: string } | null) {
  mockState.error = error;
}

/** Reset all Supabase mocks to default state */
export function resetSupabaseMocks() {
  mockState = { ...defaultState };
}

// =============================================================================
// Mock Query Builder
// =============================================================================

/**
 * Creates a thenable object that works with both `.then()` and `await`.
 * This is necessary because Supabase queries can be used either way:
 *   - await supabase.from('table').select()
 *   - supabase.from('table').select().then(...)
 */
function createThenable<T>(resolver: () => T) {
  return {
    then<TResult1 = T, TResult2 = never>(
      onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ): Promise<TResult1 | TResult2> {
      return Promise.resolve(resolver()).then(onFulfilled, onRejected);
    },
    catch<TResult = never>(
      onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
    ): Promise<T | TResult> {
      return Promise.resolve(resolver()).catch(onRejected);
    },
  };
}

function createMockQueryBuilder() {
  const resolveQuery = () => {
    if (mockState.error) {
      return { data: null, error: mockState.error };
    }
    return { data: mockState.data, error: null };
  };

  const resolveSingle = () => {
    if (mockState.error) {
      return { data: null, error: mockState.error };
    }
    return { data: mockState.data[0] ?? null, error: null };
  };

  // Create a chainable builder that is also thenable
  const createChainableBuilder = (): ReturnType<typeof createChainableMethods> => {
    const methods = createChainableMethods();
    return methods;
  };

  const createChainableMethods = () => {
    const thenable = createThenable(resolveQuery);

    return {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => createThenable(resolveSingle)),
      maybeSingle: vi.fn().mockImplementation(() => createThenable(resolveSingle)),
      // Make the builder itself thenable (supports both await and .then())
      then: thenable.then,
      catch: thenable.catch,
    };
  };

  return createChainableBuilder();
}

// =============================================================================
// Mock Supabase Client
// =============================================================================

/** Create a mock Supabase client for testing */
export function createMockSupabaseClient() {
  return {
    from: vi.fn().mockReturnValue(createMockQueryBuilder()),
  };
}

// Singleton client instance for useSupabase hook (maintains referential equality)
const mockClientInstance = createMockSupabaseClient();

// =============================================================================
// Mock Context (for vi.mock)
// =============================================================================

/** Mock SupabaseProvider - passes through children */
export function SupabaseProvider({ children }: { children: ReactNode }) {
  return children;
}

/** Mock useSupabase hook - returns stable client instance */
export function useSupabase() {
  return mockClientInstance;
}
