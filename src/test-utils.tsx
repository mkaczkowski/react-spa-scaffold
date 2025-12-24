import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

import { MobileProvider } from '@/contexts/mobileContext';

// Setup empty English catalog for tests
i18n.loadAndActivate({ locale: 'en', messages: {} });

/**
 * Creates a fresh QueryClient for each test with test-optimized settings.
 * Best practices from TanStack Query docs:
 * - retry: false - Faster failure tests, no retry delays
 * - gcTime: 0 - Prevents caching between tests
 * - staleTime: 0 - Data always considered stale in tests
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });
}

interface WrapperProps {
  children: ReactNode;
}

function AllProviders({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider i18n={i18n}>
        <MemoryRouter>
          <MobileProvider>{children}</MobileProvider>
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
export { createTestQueryClient };

// Re-export MSW utilities for test convenience
export { server } from '@/mocks/node';
export { http, HttpResponse, delay } from 'msw';

// Re-export vi for test utilities that need it
export { vi } from 'vitest';

/**
 * Creates a mock for window.matchMedia.
 * Usage: window.matchMedia = mockMatchMedia(true) // matches
 */
export const mockMatchMedia = (matches: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
