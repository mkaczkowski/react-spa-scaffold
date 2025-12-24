import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { useExampleQuery } from '@/hooks/useExampleQuery';
import { server } from '@/test-utils';

// Create a wrapper with QueryClient for hook testing
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useExampleQuery', () => {
  it('fetches todos successfully', async () => {
    const { result } = renderHook(() => useExampleQuery(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify data
    expect(result.current.data).toHaveLength(5);
    expect(result.current.data?.[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      completed: expect.any(Boolean),
    });
  });

  it('handles server error gracefully', async () => {
    // Override handler for this specific test
    server.use(
      http.get('https://jsonplaceholder.typicode.com/todos', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useExampleQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('handles network error', async () => {
    server.use(
      http.get('https://jsonplaceholder.typicode.com/todos', () => {
        return HttpResponse.error();
      }),
    );

    const { result } = renderHook(() => useExampleQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('handles empty response', async () => {
    server.use(
      http.get('https://jsonplaceholder.typicode.com/todos', () => {
        return HttpResponse.json([]);
      }),
    );

    const { result } = renderHook(() => useExampleQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });
});
