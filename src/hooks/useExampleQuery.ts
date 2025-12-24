import { useQuery } from '@tanstack/react-query';

interface ExampleData {
  id: string;
  title: string;
  completed: boolean;
}

async function fetchExampleData(): Promise<ExampleData[]> {
  // Replace with your actual API call
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

/**
 * Example TanStack Query hook demonstrating the pattern.
 * Replace with your actual data fetching logic.
 */
export function useExampleQuery() {
  return useQuery({
    queryKey: ['example', 'todos'],
    queryFn: fetchExampleData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
