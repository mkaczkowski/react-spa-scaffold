import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { PerformanceProviderWrapper, usePerformance } from '@/contexts/performanceContext';

const wrapper = ({ children }: { children: ReactNode }) => (
  <PerformanceProviderWrapper>{children}</PerformanceProviderWrapper>
);

describe('usePerformance', () => {
  it('returns no-op callback when used outside provider', () => {
    // Should NOT throw, unlike usePerformanceRequired from the library
    const { result } = renderHook(() => usePerformance());

    expect(result.current).toBeDefined();
    expect(result.current.onProfilerRender).toBeInstanceOf(Function);

    // Verify no-op callback doesn't throw when called
    expect(() => {
      result.current.onProfilerRender('test-id', 'mount', 100, 50, 1000, 1001);
    }).not.toThrow();
  });

  it('returns context value when used with provider', () => {
    const { result } = renderHook(() => usePerformance(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.onProfilerRender).toBeInstanceOf(Function);
  });
});

describe('PerformanceProviderWrapper', () => {
  it('renders children when performance is disabled', () => {
    // In test environment, DEV is false and VITE_PERF_TEST is not set
    // So the provider should be disabled and just render children
    const { result } = renderHook(() => usePerformance(), { wrapper });

    expect(result.current).toBeDefined();
  });

  it('does not crash on mount or unmount', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { unmount } = renderHook(() => usePerformance(), { wrapper });

    expect(() => unmount()).not.toThrow();

    consoleSpy.mockRestore();
  });
});
