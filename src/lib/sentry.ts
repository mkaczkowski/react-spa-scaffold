import type * as SentryType from '@sentry/react';

import { SENTRY_CONFIG } from './config';
import { env } from './env';

let sentryInstance: typeof SentryType | null = null;

/**
 * Initialize Sentry error tracking.
 * Only runs in production when enabled and VITE_SENTRY_DSN is configured.
 */
export async function initSentry(): Promise<typeof SentryType | null> {
  // Skip if disabled, in development, already initialized, or no DSN
  if (!SENTRY_CONFIG.enabled || env.DEV || sentryInstance || !SENTRY_CONFIG.dsn) {
    return sentryInstance;
  }

  const sentry = await import('@sentry/react');

  sentry.init({
    dsn: SENTRY_CONFIG.dsn,
    environment: SENTRY_CONFIG.environment,
    sendDefaultPii: true,
    integrations: [sentry.browserTracingIntegration()],
    tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,
  });

  sentryInstance = sentry;
  return sentryInstance;
}

/**
 * Lazily initialize Sentry after the app is interactive.
 * Uses requestIdleCallback with fallback for older browsers.
 */
export function lazySentryInit(): void {
  const init = () => void initSentry();

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(init, { timeout: 2000 });
  } else {
    setTimeout(init, 1000);
  }
}

interface CaptureContext {
  componentStack?: string;
}

/**
 * Capture an exception to Sentry.
 * No-op if Sentry is not initialized.
 */
export function captureException(error: unknown, context?: CaptureContext): void {
  sentryInstance?.captureException(error, {
    extra: context?.componentStack ? { componentStack: context.componentStack } : undefined,
  });
}
