/**
 * Shared test constants for mocks and fixtures.
 *
 * Use these values across all mocks to ensure consistency
 * between Clerk, Supabase, and other test utilities.
 */

/** Mock user data - consistent across all auth/database mocks */
export const MOCK_USER = {
  id: 'user_123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  fullName: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
} as const;

/** Mock session ID for auth mocks */
export const MOCK_SESSION_ID = 'sess_123';

/** Mock auth token for API requests */
export const MOCK_AUTH_TOKEN = 'mock-auth-token';

/** Mock Supabase URL for MSW handlers */
export const MOCK_SUPABASE_URL = 'https://mock.supabase.co';

/** Default timestamps for fixtures */
export const MOCK_TIMESTAMPS = {
  created: '2024-01-01T00:00:00.000Z',
  updated: '2024-01-01T00:00:00.000Z',
} as const;
