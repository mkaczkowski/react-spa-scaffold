/**
 * Mock user fixtures for Clerk authentication testing.
 * Used by clerkMock.tsx to simulate authenticated users.
 */

import { MOCK_USER } from '@/mocks/constants';

// =============================================================================
// Types
// =============================================================================

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  primaryEmailAddress?: { emailAddress: string };
  imageUrl?: string;
}

// =============================================================================
// Default User
// =============================================================================

/** Default mock user based on MOCK_USER constants */
export const defaultUser: MockUser = {
  id: MOCK_USER.id,
  firstName: MOCK_USER.firstName,
  lastName: MOCK_USER.lastName,
  fullName: MOCK_USER.fullName,
  primaryEmailAddress: { emailAddress: MOCK_USER.email },
  imageUrl: MOCK_USER.avatarUrl,
};

// =============================================================================
// Static Fixtures
// =============================================================================

/** Sample users for MSW handlers */
export const mockUsers: MockUser[] = [{ ...defaultUser }];

// =============================================================================
// Factory Functions
// =============================================================================

/** Counter for unique ID generation */
let idCounter = 0;

/**
 * Create a mock user with optional overrides.
 *
 * @example
 * ```ts
 * const user = createUser({ firstName: 'Jane' });
 * ```
 */
export function createUser(overrides: Partial<MockUser> = {}): MockUser {
  const id = overrides.id ?? `user_${Date.now()}_${idCounter++}`;
  const firstName = overrides.firstName ?? MOCK_USER.firstName;
  const lastName = overrides.lastName ?? MOCK_USER.lastName;

  return {
    id,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    primaryEmailAddress: { emailAddress: MOCK_USER.email },
    imageUrl: MOCK_USER.avatarUrl,
    ...overrides,
  };
}

/**
 * Create multiple mock users.
 *
 * @example
 * ```ts
 * const users = createUsers(3);
 * ```
 */
export function createUsers(count: number, overrides: Partial<MockUser> = {}): MockUser[] {
  return Array.from({ length: count }, (_, i) =>
    createUser({
      id: `user_${i + 1}`,
      firstName: `User${i + 1}`,
      lastName: 'Test',
      primaryEmailAddress: { emailAddress: `user${i + 1}@example.com` },
      ...overrides,
    }),
  );
}
