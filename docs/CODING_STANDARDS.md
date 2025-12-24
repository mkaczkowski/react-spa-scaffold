# Coding Standards

## File Organization

```
src/
├── components/
│   ├── layout/     # Page structure (Header)
│   ├── shared/     # Feature components (ThemeToggle, LanguageSwitcher)
│   └── ui/         # Primitives (Button, Spinner)
├── hooks/          # Custom React hooks
├── stores/         # Zustand stores
├── contexts/       # React Context providers
├── lib/            # Utilities, API client, config
├── types/          # Shared TypeScript definitions
└── pages/          # Page components
```

## Components

Use named exports with props interface:

```tsx
export interface MyComponentProps {
  title: string;
  count?: number;
}

export function MyComponent({ title, count = 0 }: MyComponentProps) {
  // ...
}
```

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

| Use Case            | Tool                              |
| ------------------- | --------------------------------- |
| Persisted app state | Zustand with `persist` middleware |
| Server/async data   | TanStack Query                    |
| Shared UI state     | React Context                     |

Query hooks extract the fetcher function:

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
