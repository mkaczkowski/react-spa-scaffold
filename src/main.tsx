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

import App from './App';

// Lazy load Sentry after initial render to avoid blocking web vitals
function initSentry() {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    import('@sentry/react').then((Sentry) => {
      Sentry.init({
        dsn: import.meta.env.VITE_SENTRY_DSN,
        sendDefaultPii: true,
        integrations: [Sentry.browserTracingIntegration()],
        tracesSampleRate: 0.1, // 10% of transactions
      });
    });
  }
}

// Initialize i18n before rendering
initI18n().then(() => {
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
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initSentry);
  } else {
    setTimeout(initSentry, 1);
  }
});
