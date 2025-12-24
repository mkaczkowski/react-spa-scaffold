# Coding Standards

Concise guide to patterns used in this codebase.

## File Organization

```
src/
├── components/
│   ├── layout/     # Page structure (Header)
│   ├── shared/     # Feature components (ThemeToggle, LanguageSwitcher)
│   └── ui/         # Primitives (Button, Spinner, Loading)
├── hooks/          # Custom React hooks
├── stores/         # Zustand stores
├── contexts/       # React Context providers
├── lib/            # Utilities, API client, config
├── types/          # TypeScript type definitions
└── pages/          # Page components
```

## Components

**Named exports only** (no default exports):

```tsx
// ✅ Correct
export function MyComponent() { ... }

// ❌ Avoid
export default function MyComponent() { ... }
```

**Props interfaces at file level:**

```tsx
export interface MyComponentProps {
  title: string;
  count?: number;
}

export function MyComponent({ title, count = 0 }: MyComponentProps) {
  ...
}
```

**Re-export via index.ts:**

```ts
// components/shared/index.ts
export { ThemeToggle } from './ThemeToggle';
export { LanguageSwitcher } from './LanguageSwitcher';
```

## TypeScript

**Types vs Interfaces:**

```tsx
// Type for unions/literals
type Theme = 'light' | 'dark' | 'system';
type Status = 'idle' | 'loading' | 'error';

// Interface for object shapes
interface User {
  id: string;
  name: string;
}
```

**Type imports:**

```tsx
import type { User } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
```

## Imports

Use path alias `@/` for all imports. Order:

1. React/third-party libraries
2. `@/` aliased imports
3. Relative imports (rare)

```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { usePreferencesStore } from '@/stores';
```

## Styling

**Tailwind CSS only.** Use `cn()` for conditional classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-class', isActive && 'active-class')} />;
```

**CVA for component variants:**

```tsx
const buttonVariants = cva('base-classes', {
  variants: {
    size: { sm: 'h-8', md: 'h-10' },
  },
  defaultVariants: { size: 'md' },
});
```

## State Management

| Use Case        | Tool                   |
| --------------- | ---------------------- |
| App preferences | Zustand with `persist` |
| Server data     | TanStack Query         |
| Local UI state  | `useState`             |
| Shared UI state | React Context          |

**Zustand pattern:**

```tsx
export const useMyStore = create<MyState>()(
  devtools(
    persist(
      (set, get) => ({ ... }),
      { name: 'storage-key' }
    )
  )
);
```

**React Query pattern:**

```tsx
async function fetchData(): Promise<Data[]> {
  return api.get<Data[]>('/endpoint');
}

export function useMyQuery() {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: fetchData,
  });
}
```

## SSR Safety

Always check for `window` before accessing browser APIs:

```tsx
if (typeof window === 'undefined') return 'light';
return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
```

## Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add `aria-label` to icon-only buttons
- Use `role="alert"` for error messages
