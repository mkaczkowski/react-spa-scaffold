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

### Zustand Best Practices

**Auto-generated selectors**: All stores use `createSelectors` for cleaner access:

```tsx
// Store definition
const useStoreBase = create<State>()(/* ... */);
export const useStore = createSelectors(useStoreBase);

// Component usage - auto-generated selectors
const count = useStore.use.count();
const increment = useStore.use.increment();
```

**Use `useShallow` for multiple values**: Prevents unnecessary re-renders:

```tsx
import { useShallow } from 'zustand/react/shallow';

// Group state values with useShallow
const { searchQuery, sortBy } = useStore(
  useShallow((s) => ({
    searchQuery: s.searchQuery,
    sortBy: s.sortBy,
  })),
);
```

**Persist versioning**: Always include version and migrate for persisted stores:

```tsx
persist(
  (set, get) => ({
    /* ... */
  }),
  {
    name: 'store-key',
    version: 1, // Increment on breaking changes
    migrate: (persisted, version) => {
      if (version === 0) {
        return { ...persisted, newField: 'default' };
      }
      return persisted;
    },
  },
);
```

**Middleware order**: Stack middlewares correctly:

```tsx
// devtools → persist → subscribeWithSelector → store
create<State>()(
  devtools(
    persist(
      subscribeWithSelector((set, get) => ({
        /* ... */
      })),
      { name: 'key' },
    ),
    { name: 'StoreName', enabled: process.env.NODE_ENV === 'development' },
  ),
);
```

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
