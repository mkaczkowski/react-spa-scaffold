import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from '@/mocks/node';
import { resetClerkMocks } from '@/test/clerkMock';

// =============================================================================
// Module Mocks
// =============================================================================

// Mock @clerk/react-router for testing
vi.mock('@clerk/react-router', async () => import('@/test/clerkMock'));

// Mock @clerk/themes for testing
vi.mock('@clerk/themes', () => ({
  shadcn: { baseTheme: 'shadcn' },
}));

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
