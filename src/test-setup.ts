import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from '@/mocks/node';
import { resetClerkMocks } from '@/test/clerkMock';
import { resetSupabaseMocks } from '@/test/supabaseMock';

// =============================================================================
// Module Mocks
// =============================================================================

// Mock @clerk/react-router for testing
vi.mock('@clerk/react-router', async () => import('@/test/clerkMock'));

// Mock @clerk/themes for testing
vi.mock('@clerk/themes', () => ({
  shadcn: { baseTheme: 'shadcn' },
}));

// Mock Supabase context with test client
vi.mock('@/contexts/supabaseContext', async () => import('@/test/supabaseMock'));

// =============================================================================
// MSW Server Setup
// =============================================================================

// Start MSW server before all tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn', // Warn about unhandled requests during tests
  });
});

// Reset handlers and mocks after each test to ensure test isolation
afterEach(() => {
  server.resetHandlers();
  resetClerkMocks();
  resetSupabaseMocks();
});

// Close MSW server after all tests complete
afterAll(() => {
  server.close();
});

// =============================================================================
// Browser API Mocks
// =============================================================================

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock scrollTo
window.scrollTo = () => {};
