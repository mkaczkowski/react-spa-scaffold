import { lazy, Suspense, type ReactNode } from 'react';

import { usePerformance as useLibPerformance } from 'react-performance-tracking/react';

/**
 * Lazy-load the PerformanceProvider to avoid bundling it in production.
 * This provider is only used during performance testing.
 */
const PerformanceProvider = lazy(() =>
  import('react-performance-tracking/react').then((m) => ({
    default: m.PerformanceProvider,
  })),
);

interface PerformanceProviderWrapperProps {
  children: ReactNode;
}

/**
 * Conditionally wraps children with PerformanceProvider for E2E performance testing.
 *
 * Only enabled when:
 * - Running in development mode (DEV), OR
 * - VITE_PERF_TEST environment variable is set to "true"
 *
 * In production builds without the env var, this is a pass-through component
 * with zero runtime overhead.
 *
 * @see https://github.com/mkaczkowski/react-performance-tracking
 */
export function PerformanceProviderWrapper({ children }: PerformanceProviderWrapperProps) {
  const isPerformanceEnabled = import.meta.env.DEV || import.meta.env.VITE_PERF_TEST === 'true';

  if (!isPerformanceEnabled) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<>{children}</>}>
      <PerformanceProvider>{children}</PerformanceProvider>
    </Suspense>
  );
}

/**
 * No-op profiler callback for when performance tracking is disabled.
 * This prevents crashes in production when the PerformanceProvider is not mounted.
 */
const noopProfilerCallback: React.ProfilerOnRenderCallback = () => {
  // Intentionally empty - performance tracking disabled
};

const noopContext = { onProfilerRender: noopProfilerCallback };

/**
 * Safe hook that returns performance context or a no-op fallback.
 * Unlike usePerformanceRequired from the library, this NEVER throws.
 */
export function usePerformance() {
  const context = useLibPerformance();

  // Return no-op if context is null (provider not mounted)
  return context ?? noopContext;
}
