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
import { CLERK_CONFIG } from '@/lib/config';
import { initSentry } from '@/lib/sentry';
import { initPreferencesSync } from '@/stores/preferencesStore';

import App from './App';

/** Sentry module type for error handlers */
type SentryModule = Awaited<ReturnType<typeof initSentry>>;

/**
 * Setup global error handlers for uncaught errors and promise rejections.
 * @param Sentry - The Sentry module or null if not available
 */
function setupGlobalErrorHandlers(Sentry: SentryModule) {
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
            <ClerkThemeProvider publishableKey={CLERK_CONFIG.publishableKey!}>
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
