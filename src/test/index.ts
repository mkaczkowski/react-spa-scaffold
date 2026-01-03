// Custom render with all providers
export { createTestQueryClient, render } from './providers';

// Browser API mocks
export {
  mockAnimationFrame,
  mockMatchMedia,
  mockScrollTo,
  mockStorageRemoveItemError,
  mockStorageSetItemError,
  silenceConsoleError,
  silenceConsoleLog,
  silenceConsoleWarn,
} from './mocks';

// Clerk test utilities
export {
  createUser,
  createUsers,
  mockUsers,
  resetClerkMocks,
  setMockClerkLoaded,
  setMockClerkSignedIn,
  setMockClerkState,
  setMockClerkUser,
  type MockUser,
} from './clerkMock';

// Supabase test utilities
export {
  createMockSupabaseClient,
  createProfile,
  createProfiles,
  mockProfiles,
  resetSupabaseMocks,
  setMockSupabaseData,
  setMockSupabaseError,
  type Profile,
} from './supabaseMock';

// MSW server instance
export { server } from '@/mocks/node';

// Todo fixtures
export { createTodo, createTodos, mockTodos, type Todo } from '@/mocks/fixtures/todos';

// Shared test constants
export { MOCK_AUTH_TOKEN, MOCK_SESSION_ID, MOCK_SUPABASE_URL, MOCK_TIMESTAMPS, MOCK_USER } from '@/mocks/constants';
