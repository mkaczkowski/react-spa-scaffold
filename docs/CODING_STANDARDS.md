# Coding Standards

See [Architecture Guide](./ARCHITECTURE.md) for project structure and [Component Guidelines](./COMPONENT_GUIDELINES.md) for the complete React component blueprint.

## TypeScript

Use `type` for unions, `interface` for object shapes:

```tsx
type Theme = 'light' | 'dark' | 'system';

interface User {
  id: string;
  name: string;
}
```

## State Management

See [Architecture Guide](./ARCHITECTURE.md#state-management) for when to use each solution.

### Query Hooks

Extract the fetcher function:

```tsx
async function fetchTodos(): Promise<Todo[]> {
  return api.get<Todo[]>('/todos');
}

export function useTodosQuery() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });
}
```

### Context Hooks

Throw if used outside their provider:

```tsx
const MyContext = createContext<MyValue | null>(null);

export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}
```
