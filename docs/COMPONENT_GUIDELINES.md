# React + TypeScript Component Guidelines

This document provides a comprehensive blueprint for writing React components with TypeScript. Follow these patterns for consistency across the codebase.

## Table of Contents

1. [Component Anatomy](#component-anatomy)
2. [Props & TypeScript](#props--typescript)
3. [Component Categories](#component-categories)
4. [Styling with CVA](#styling-with-cva)
5. [State Management](#state-management)
6. [Hooks Integration](#hooks-integration)
7. [Internationalization](#internationalization)
8. [Testing](#testing)
9. [Complete Examples](#complete-examples)

---

## Component Anatomy

### Basic Structure

Every component follows this structure:

```tsx
// 1. Imports (grouped: external → internal → types → styles)
import { forwardRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { useMobileContext } from '@/contexts';

import type { ButtonHTMLAttributes } from 'react';

// 2. Types/Interfaces
export interface MyComponentProps {
  title: string;
  count?: number;
  onAction?: () => void;
}

// 3. Component Implementation
export function MyComponent({ title, count = 0, onAction }: MyComponentProps) {
  // a. Hooks (context, state, refs, custom hooks)
  const { isMobile } = useMobileContext();
  const [isOpen, setIsOpen] = useState(false);

  // b. Derived state / computations
  const displayCount = count > 99 ? '99+' : count;

  // c. Event handlers
  const handleClick = () => {
    setIsOpen(true);
    onAction?.();
  };

  // d. Early returns (loading, error states)
  if (!title) return null;

  // e. Render
  return (
    <div className="my-component">
      <h2>{title}</h2>
      <span>{displayCount}</span>
      <button onClick={handleClick}>
        {isMobile ? 'Tap' : 'Click'}
      </button>
    </div>
  );
}
```

### File Naming

| Type | File Name | Export |
|------|-----------|--------|
| UI Component | `button.tsx` (lowercase) | Named: `export { Button }` |
| Feature Component | `ThemeToggle.tsx` (PascalCase) | Named: `export { ThemeToggle }` |
| Page Component | `Home.tsx` (PascalCase) | Default: `export default HomePage` |
| Hook | `useMyHook.ts` | Named: `export { useMyHook }` |

---

## Props & TypeScript

### Interface for Props

Always use `interface` for component props:

```tsx
// Props interface - suffix with 'Props'
export interface CardProps {
  title: string;
  description?: string;
  children: ReactNode;
  onClose?: () => void;
}

export function Card({ title, description, children, onClose }: CardProps) {
  // ...
}
```

### Extending HTML Attributes

For components wrapping native elements, extend their attributes:

```tsx
import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', isLoading, children, ...props }: ButtonProps) {
  return (
    <button {...props}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

### Type vs Interface

```tsx
// Use 'type' for: unions, literals, utility types
type Theme = 'light' | 'dark' | 'system';
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type PropsWithChildren<P> = P & { children: ReactNode };

// Use 'interface' for: object shapes, component props, API responses
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}
```

### Generic Components

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string;
}

export function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={users}
  renderItem={(user) => <UserCard user={user} />}
  keyExtractor={(user) => user.id}
/>
```

### forwardRef Components

For components that need ref forwarding (especially UI primitives):

```tsx
import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div>
        {label && <label>{label}</label>}
        <input ref={ref} className={cn('input-base', className)} {...props} />
        {error && <span className="text-destructive">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

---

## Component Categories

### 1. UI Components (`src/components/ui/`)

Primitive, reusable building blocks. Keep them simple and focused.

```tsx
// src/components/ui/spinner.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva('animate-spin rounded-full border-2 border-current', {
  variants: {
    size: {
      sm: 'h-4 w-4 border-2',
      md: 'h-6 w-6 border-2',
      lg: 'h-8 w-8 border-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ size, className }: SpinnerProps) {
  return (
    <div
      className={cn(spinnerVariants({ size }), className)}
      role="status"
      aria-label="Loading"
    />
  );
}
```

### 2. Shared Components (`src/components/shared/`)

Feature-specific components organized in subdirectories:

```
src/components/shared/
├── ThemeToggle/
│   ├── ThemeToggle.tsx    # Component implementation
│   └── index.ts           # Barrel export
├── LanguageSwitcher/
│   ├── LanguageSwitcher.tsx
│   └── index.ts
└── index.ts               # Re-exports all shared components
```

```tsx
// src/components/shared/ThemeToggle/ThemeToggle.tsx
import { Trans } from '@lingui/react/macro';
import { useLingui } from '@lingui/react';
import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { usePreferencesStore } from '@/stores';

export function ThemeToggle() {
  const { t } = useLingui();
  const { theme, toggleTheme, getResolvedTheme } = usePreferencesStore();
  const resolvedTheme = getResolvedTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={t({
        message: resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        comment: 'Accessibility label for theme toggle button',
      })}
    >
      {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

// src/components/shared/ThemeToggle/index.ts
export { ThemeToggle } from './ThemeToggle';
```

### 3. Layout Components (`src/components/layout/`)

Page structure components:

```tsx
// src/components/layout/Header.tsx
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/react/macro';

import { ThemeToggle, LanguageSwitcher } from '@/components/shared';
import { ROUTES } from '@/lib/routes';

export function Header() {
  return (
    <header role="banner" className="border-b bg-background">
      <nav className="container flex h-16 items-center justify-between">
        <Link to={ROUTES.HOME} className="font-semibold">
          <Trans comment="Application name in header">My App</Trans>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
```

### 4. Page Components (`src/pages/`)

Route-level components with default exports for lazy loading:

```tsx
// src/pages/Home.tsx
import { Trans } from '@lingui/react/macro';

import { Header } from '@/components/layout/Header';
import { SEO } from '@/components/shared';
import { useExampleQuery } from '@/hooks';

export default function HomePage() {
  const { data, isLoading, error } = useExampleQuery();

  return (
    <>
      <SEO title="Home" description="Welcome to our application" />
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold">
          <Trans comment="Main heading on home page">Welcome</Trans>
        </h1>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error loading data</p>}
        {data && <ul>{data.map((item) => <li key={item.id}>{item.title}</li>)}</ul>}
      </main>
    </>
  );
}
```

---

## Styling with CVA

Use [Class Variance Authority](https://cva.style/docs) for variant-based styling:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// 1. Define variants
const badgeVariants = cva(
  // Base styles (always applied)
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-green-500 text-white',
        warning: 'bg-yellow-500 text-black',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-transparent',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
      },
    },
    // Compound variants for specific combinations
    compoundVariants: [
      {
        variant: 'outline',
        size: 'lg',
        className: 'border-2',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// 2. Type props from variants
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

// 3. Apply variants with cn() for className merging
export function Badge({ variant, size, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

// Export variants for external use if needed
export { badgeVariants };
```

### Using `cn()` Utility

The `cn()` function merges Tailwind classes intelligently:

```tsx
import { cn } from '@/lib/utils';

// Merges classes, later values override earlier ones
cn('px-4 py-2', 'px-6')           // → 'py-2 px-6'
cn('text-red-500', className)      // → allows override from props
cn(isActive && 'bg-primary')       // → conditional classes
```

---

## State Management

### Hierarchy

Follow this decision tree:

```
Need to persist across sessions?
  → Yes: Zustand with persist (stores/)
  → No: Continue ↓

Is it server/async data?
  → Yes: TanStack Query (hooks/use*Query)
  → No: Continue ↓

Shared across multiple components?
  → Yes: React Context (contexts/)
  → No: useState/useReducer (local)
```

### Local State

```tsx
export function Counter() {
  // Simple local state
  const [count, setCount] = useState(0);

  // Complex local state
  const [state, dispatch] = useReducer(reducer, initialState);

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

### Context State

```tsx
// contexts/myFeatureContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

interface MyFeatureContextValue {
  isEnabled: boolean;
  toggle: () => void;
}

const MyFeatureContext = createContext<MyFeatureContextValue | null>(null);

export function MyFeatureProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);

  const value: MyFeatureContextValue = {
    isEnabled,
    toggle: () => setIsEnabled((prev) => !prev),
  };

  return (
    <MyFeatureContext.Provider value={value}>
      {children}
    </MyFeatureContext.Provider>
  );
}

// Hook MUST throw if used outside provider
export function useMyFeature(): MyFeatureContextValue {
  const context = useContext(MyFeatureContext);
  if (!context) {
    throw new Error('useMyFeature must be used within MyFeatureProvider');
  }
  return context;
}
```

### Server State with TanStack Query

```tsx
// hooks/useUsersQuery.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User } from '@/types/api';

// Extract fetcher for reuse and testing
async function fetchUsers(): Promise<User[]> {
  return api.get<User[]>('/users');
}

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

// With parameters
export function useUserQuery(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => api.get<User>(`/users/${userId}`),
    enabled: Boolean(userId),
  });
}
```

---

## Hooks Integration

### Custom Hooks Pattern

```tsx
// hooks/useContactForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormData } from '@/lib/validations';

export function useContactForm() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Handle submission
    console.log('Form submitted:', data);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
}
```

### Composing Hooks

```tsx
// hooks/useTouchSizes.ts
import { useMobileContext } from '@/contexts';

export function useTouchSizes() {
  const { isMobile } = useMobileContext();

  return {
    button: isMobile ? 'touch' : 'default',
    input: isMobile ? 'lg' : 'default',
    icon: isMobile ? 24 : 20,
  } as const;
}
```

---

## Internationalization

**CRITICAL**: All user-facing text MUST include translator comments.

### Using `<Trans>` Component

```tsx
import { Trans } from '@lingui/react/macro';

export function WelcomeMessage({ name }: { name: string }) {
  return (
    <div>
      {/* Static text */}
      <h1>
        <Trans comment="Main greeting shown to logged-in users">Welcome back!</Trans>
      </h1>

      {/* With variables */}
      <p>
        <Trans comment="Personalized greeting with user's name">
          Hello, {name}
        </Trans>
      </p>

      {/* With plurals */}
      <p>
        <Trans comment="Item count in shopping cart">
          You have {count} {count === 1 ? 'item' : 'items'} in your cart
        </Trans>
      </p>
    </div>
  );
}
```

### Using `useLingui` Hook

```tsx
import { useLingui } from '@lingui/react';

export function ActionButton() {
  const { t } = useLingui();

  return (
    <button
      aria-label={t({
        message: 'Close dialog',
        comment: 'Accessibility label for close button in modal dialogs',
      })}
    >
      <CloseIcon />
    </button>
  );
}
```

---

## Testing

### Test File Location

Mirror `src/` structure in `tests/unit/`:

```
src/components/shared/ThemeToggle/ThemeToggle.tsx
→ tests/unit/components/ThemeToggle.test.tsx

src/hooks/useExampleQuery.ts
→ tests/unit/hooks/useExampleQuery.test.tsx
```

### Component Test Pattern

```tsx
// tests/unit/components/MyComponent.test.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MyComponent } from '@/components/shared/MyComponent';
import { render } from '@/test';

describe('MyComponent', () => {
  it('renders with required props', () => {
    render(<MyComponent title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when clicked', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();

    render(<MyComponent title="Test" onAction={handleAction} />);

    await user.click(screen.getByRole('button'));

    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('has accessible name', () => {
    render(<MyComponent title="Test" />);

    const button = screen.getByRole('button', { name: /action/i });
    expect(button).toBeInTheDocument();
  });
});
```

### Hook Test Pattern

```tsx
// tests/unit/hooks/useMyHook.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { useMyQuery } from '@/hooks/useMyQuery';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('useMyQuery', () => {
  it('fetches data successfully', async () => {
    const { result } = renderHook(() => useMyQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

---

## Complete Examples

### UI Component with Variants

```tsx
// src/components/ui/alert.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        info: 'border-blue-500/50 bg-blue-500/10 text-blue-700 [&>svg]:text-blue-500',
        success: 'border-green-500/50 bg-green-500/10 text-green-700 [&>svg]:text-green-500',
        warning: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 [&>svg]:text-yellow-500',
        destructive: 'border-destructive/50 bg-destructive/10 text-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  destructive: XCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'default', title, className, children, ...props }, ref) => {
    const Icon = iconMap[variant ?? 'default'];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-4 w-4" />
        <div>
          {title && <h5 className="mb-1 font-medium leading-none">{title}</h5>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
```

### Feature Component with All Patterns

```tsx
// src/components/shared/UserProfile/UserProfile.tsx
import { Trans } from '@lingui/react/macro';
import { useLingui } from '@lingui/react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserQuery } from '@/hooks';
import { cn } from '@/lib/utils';

export interface UserProfileProps {
  userId: string;
  className?: string;
  onLogout?: () => void;
}

export function UserProfile({ userId, className, onLogout }: UserProfileProps) {
  const { t } = useLingui();
  const { data: user, isLoading, error } = useUserQuery(userId);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className={cn('text-destructive', className)}>
        <Trans comment="Error message when user profile fails to load">
          Failed to load profile
        </Trans>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar src={user.avatar} alt={user.name} />
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      {onLogout && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          aria-label={t({
            message: 'Sign out of your account',
            comment: 'Accessibility label for logout button in user profile',
          })}
        >
          <Trans comment="Logout button text in user profile">Sign out</Trans>
        </Button>
      )}
    </div>
  );
}

// src/components/shared/UserProfile/index.ts
export { UserProfile, type UserProfileProps } from './UserProfile';
```

---

## Checklist

Before submitting a component, verify:

- [ ] Props defined with `interface` (suffix: `Props`)
- [ ] Named export (default only for pages)
- [ ] Imports use `@/` path alias
- [ ] All user-facing text has translator comments
- [ ] Accessible (proper roles, aria-labels, keyboard navigation)
- [ ] Uses `cn()` for className merging
- [ ] Handles loading/error states for async data
- [ ] Test file exists in `tests/unit/`
- [ ] Barrel export added to directory `index.ts`

---

## Related Documentation

- [Coding Standards](./CODING_STANDARDS.md) - General TypeScript patterns
- [Architecture Guide](./ARCHITECTURE.md) - Project structure and data flow
- [Testing Guide](./TESTING.md) - Unit testing patterns
- [Internationalization](./INTERNATIONALIZATION.md) - i18n setup and patterns
