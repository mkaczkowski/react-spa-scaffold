import { I18nProvider } from '@lingui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import './index.css';
import { ErrorBoundary } from '@/components/shared';
import { Toaster } from '@/components/ui/sonner';
import { ClerkThemeProvider } from '@/contexts/clerkContext';
import { MobileProvider } from '@/contexts/mobileContext';
import { PerformanceProviderWrapper } from '@/contexts/performanceContext';
import { QueryProvider } from '@/contexts/queryContext';
import { SupabaseProvider } from '@/contexts/supabaseContext';
import { i18n, initI18n } from '@/i18n';
import { env } from '@/lib/env';
import { SENTRY_CONFIG } from '@/lib/config';
import { initPreferencesSync } from '@/stores/preferencesStore';

import App from './App';

// Clerk Publishable Key - required when auth feature is enabled
const CLERK_PUBLISHABLE_KEY = env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}

// Supabase - validate that both URL and key are set together
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;

if ((SUPABASE_URL && !SUPABASE_ANON_KEY) || (!SUPABASE_URL && SUPABASE_ANON_KEY)) {
  throw new Error(
    'Supabase configuration incomplete. Both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set together.',
  );
}

/**
 * Lazy load Sentry after initial render to avoid blocking web vitals.
 * Returns the Sentry module for use in global error handlers.
 */
async function initSentry() {
  if (import.meta.env.PROD && SENTRY_CONFIG.enabled && SENTRY_CONFIG.dsn) {
    try {
      const Sentry = await import('@sentry/react');
      Sentry.init({
        dsn: SENTRY_CONFIG.dsn,
        sendDefaultPii: true,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,
      });
      return Sentry;
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
    }
  }
  return null;
}

/**
 * Setup global error handlers for uncaught errors and promise rejections.
 * @param Sentry - The Sentry module or null if not available
 */
function setupGlobalErrorHandlers(Sentry: Awaited<ReturnType<typeof initSentry>>) {
  // Handle uncaught errors
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Uncaught error:', { message, source, lineno, colno, error });

    if (Sentry && error) {
      Sentry.captureException(error);
    }

    // Return false to allow default browser handling
    return false;
  };

  // Handle unhandled promise rejections
  window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    if (Sentry) {
      Sentry.captureException(event.reason);
    }
  };
}

// Initialize i18n before rendering
initI18n().then(() => {
  // Initialize multi-tab sync for preferences
  const cleanupPreferencesSync = initPreferencesSync();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryProvider>
        <I18nProvider i18n={i18n}>
          <BrowserRouter>
            <ClerkThemeProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
              <SupabaseProvider>
                <MobileProvider>
                  <ErrorBoundary>
                    <PerformanceProviderWrapper>
                      <App />
                      <Toaster />
                    </PerformanceProviderWrapper>
                  </ErrorBoundary>
                </MobileProvider>
              </SupabaseProvider>
            </ClerkThemeProvider>
          </BrowserRouter>
        </I18nProvider>
      </QueryProvider>
    </StrictMode>,
  );

  // Initialize Sentry after render, using idle callback for best web vitals
  const initSentryAndHandlers = () => {
    initSentry().then((Sentry) => {
      setupGlobalErrorHandlers(Sentry);
    });
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(initSentryAndHandlers);
  } else {
    setTimeout(initSentryAndHandlers, 1);
  }

  // Cleanup on HMR (development only)
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      cleanupPreferencesSync();
    });
  }
});
