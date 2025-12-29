import { I18nProvider } from '@lingui/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import './index.css';
import { ErrorBoundary } from '@/components/shared';
import { Toaster } from '@/components/ui/sonner';
import { MobileProvider } from '@/contexts/mobileContext';
import { QueryProvider } from '@/contexts/queryContext';
import { i18n, initI18n } from '@/i18n';
import { SENTRY_CONFIG } from '@/lib/config';
import { initPreferencesSync } from '@/stores/preferencesStore';

import App from './App';

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
            <MobileProvider>
              <ErrorBoundary>
                <App />
                <Toaster />
              </ErrorBoundary>
            </MobileProvider>
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
