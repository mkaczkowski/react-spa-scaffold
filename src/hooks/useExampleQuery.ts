import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { Todo } from '@/types/api';

async function fetchTodos(): Promise<Todo[]> {
  return api.get<Todo[]>('/todos?_limit=5');
}

/**
 * Example TanStack Query hook demonstrating the pattern.
 * Uses the centralized API client and shared types.
 */
export function useExampleQuery() {
  return useQuery({
    queryKey: ['example', 'todos'],
    queryFn: fetchTodos,
    // Uses default staleTime from QueryProvider (5 minutes)
  });
}
