import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement, type ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

import { ClerkThemeProvider } from '@/contexts/clerkContext';
import { MobileProvider } from '@/contexts/mobileContext';
import { PerformanceProviderWrapper } from '@/contexts/performanceContext';
import { SupabaseProvider } from '@/contexts/supabaseContext';

// Setup empty English catalog for tests
i18n.loadAndActivate({ locale: 'en', messages: {} });

/**
 * Creates a fresh QueryClient for each test with test-optimized settings.
 * Best practices from TanStack Query docs:
 * - retry: false - Faster failure tests, no retry delays
 * - gcTime: 0 - Prevents caching between tests
 * - staleTime: 0 - Data always considered stale in tests
 */
export function createTestQueryClient() {
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

  // Provider order matches main.tsx: Query > I18n > Router > Clerk > Supabase > Mobile > Performance
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider i18n={i18n}>
        <MemoryRouter>
          <ClerkThemeProvider publishableKey="test_key">
            <SupabaseProvider>
              <MobileProvider>
                <PerformanceProviderWrapper>{children}</PerformanceProviderWrapper>
              </MobileProvider>
            </SupabaseProvider>
          </ClerkThemeProvider>
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export { customRender as render };
