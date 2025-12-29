# API Reference

Quick reference for what's available. For architectural decisions, see [Architecture Guide](./ARCHITECTURE.md).

## Utilities (`lib/`)

| Module           | Purpose               | When to Use                                                         |
| ---------------- | --------------------- | ------------------------------------------------------------------- |
| `api.ts`         | HTTP client           | Any API calls - handles errors, timeouts, JSON. Includes API_CONFIG |
| `config.ts`      | App configuration     | Access APP_CONFIG, SENTRY_CONFIG                                    |
| `env.ts`         | Environment variables | Type-safe `env.VITE_*` access                                       |
| `format.ts`      | Formatters            | Dates, numbers, currency, bytes - all locale-aware                  |
| `routes.ts`      | Route constants       | Type-safe navigation, avoid magic strings                           |
| `storage.ts`     | localStorage wrapper  | SSR-safe, typed storage with error handling                         |
| `storageKeys.ts` | Storage key constants | Centralized key management                                          |
| `utils.ts`       | Common utilities      | `cn()` for Tailwind class merging                                   |

### Key Pattern: API Client

```tsx
import { api } from '@/lib/api';

const data = await api.get<User[]>('/users');
// Throws ApiClientError on failure (check .status for HTTP code)
```

## Hooks (`hooks/`)

| Hook                           | Purpose               | When to Use                          |
| ------------------------------ | --------------------- | ------------------------------------ |
| `useMediaQuery`                | Track media query     | Custom responsive logic              |
| `useIsMobile` / `useIsDesktop` | Viewport checks       | Conditional rendering by screen size |
| `useLanguage`                  | Locale state          | Language switcher components         |
| `useThemeEffect`               | Theme sync            | Apply theme to document              |
| `useTouchSizes`                | Touch-friendly sizing | Mobile-optimized UI                  |

### Key Pattern: Context Hooks

Context hooks throw if used outside their provider:

```tsx
const { isMobile } = useMobileContext();
// Throws if not wrapped in <MobileProvider>
```

## Contexts (`contexts/`)

| Context         | Provider         | Purpose                                  |
| --------------- | ---------------- | ---------------------------------------- |
| `mobileContext` | `MobileProvider` | Viewport detection (isMobile, isDesktop) |

## Stores (`stores/`)

| Store              | Purpose                        | Persisted?         |
| ------------------ | ------------------------------ | ------------------ |
| `preferencesStore` | User preferences (theme, etc.) | Yes (localStorage) |

Access via Zustand hooks - see store files for available actions.
