# Authentication

Clerk authentication integration with shadcn theming and Supabase token injection.
For quick-start usage, see [CLAUDE.md](../CLAUDE.md#authentication-clerk).

---

## Why Clerk

This project uses Clerk instead of Supabase Auth for:

- **Production-ready UI** - Pre-built `SignInButton`, `UserButton` components with modal flows
- **Superior OAuth** - 20+ providers vs ~10, dashboard configuration vs code
- **Automatic session management** - Cross-tab sync, token refresh handled transparently
- **Separation of concerns** - Clerk = authentication (who), Supabase = authorization + data (what)

---

## Architecture

```
ClerkProvider (ClerkThemeProvider wrapper)
    │
    ├── useAuth()    → { isLoaded, isSignedIn, userId, getToken }
    ├── useUser()    → { user: { id, email, fullName, imageUrl } }
    └── useSession() → { session.getToken() } → JWT Token
                                                   │
                                                   ▼
                                    SupabaseProvider injects token
                                                   │
                                                   ▼
                                    Supabase validates JWT
                                    auth.uid() = Clerk user_id
```

**Authentication Flow:**

1. User clicks Sign In → Clerk modal opens
2. User authenticates (email, OAuth, etc.)
3. Clerk creates session, `useAuth()` returns `isSignedIn: true`
4. `useSession().getToken()` provides JWT for Supabase
5. RLS policies grant access via `auth.uid()`

---

## Setup

### 1. Environment Variable

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

Get from [Clerk Dashboard](https://dashboard.clerk.com) → API Keys.

### 2. Dashboard Setup

1. Create application at [clerk.com](https://clerk.com)
2. Configure sign-in methods (Email, Google, GitHub, etc.)
3. **For Supabase**: Integrations → Supabase → Activate (adds `role: authenticated` claim)
4. Copy Clerk domain → Supabase Dashboard → Authentication → Add Clerk provider

### 3. Provider Hierarchy

```tsx
// main.tsx - SupabaseProvider MUST be inside ClerkProvider
<ClerkThemeProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
  <SupabaseProvider>
    <App />
  </SupabaseProvider>
</ClerkThemeProvider>
```

---

## File Structure

```
src/
├── contexts/
│   └── clerkContext.tsx          # ClerkThemeProvider with shadcn theme
├── components/shared/
│   ├── AccountButton/            # Sign in / User button
│   ├── ProtectedRoute/           # Auth guard wrapper
│   └── ProfileSync/              # Auto-sync Clerk → Supabase
├── test/
│   └── clerkMock.tsx             # Comprehensive Clerk mocks
├── mocks/
│   ├── constants.ts              # Mock user/session constants
│   └── fixtures/users.ts         # Mock user factories
└── index.css                     # Includes @clerk/themes/shadcn.css
```

---

## Theme Configuration

### ClerkThemeProvider

```typescript
// src/contexts/clerkContext.tsx
import { ClerkProvider } from '@clerk/react-router';
import { shadcn } from '@clerk/themes';

const appearance: Appearance = {
  baseTheme: shadcn,
  variables: {
    fontFamily: '"Inter Variable", sans-serif',
    borderRadius: '0.45rem',
  },
  elements: {
    modalBackdrop: 'backdrop-blur-sm',
    modalContent: 'sm:max-w-md max-sm:min-h-svh max-sm:min-w-full max-sm:rounded-none',
    card: 'max-sm:rounded-none max-sm:shadow-none',
  },
};

export function ClerkThemeProvider({ children, publishableKey }: Props) {
  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/" appearance={appearance}>
      {children}
    </ClerkProvider>
  );
}
```

### CSS Import

```css
/* src/index.css */
@import '@clerk/themes/shadcn.css';
```

Enables automatic light/dark mode adaptation with shadcn CSS variables.

---

## Components

| Component            | Location                            | Purpose                                              |
| -------------------- | ----------------------------------- | ---------------------------------------------------- |
| `ClerkThemeProvider` | `contexts/clerkContext.tsx`         | Clerk wrapper with shadcn theme                      |
| `AccountButton`      | `components/shared/AccountButton/`  | Sign-in button (logged out) / UserButton (logged in) |
| `ProtectedRoute`     | `components/shared/ProtectedRoute/` | Auth guard, redirects to sign-in                     |
| `ProfileSync`        | `components/shared/ProfileSync/`    | Auto-syncs Clerk user → Supabase profiles            |

### AccountButton

Shows `SignInButton` when logged out, `UserButton` when logged in. Displays skeleton while loading.

### ProtectedRoute

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

Returns `<PageLoading />` while checking auth, `<RedirectToSignIn />` if not authenticated.

### ProfileSync

Invisible component that syncs Clerk user data to Supabase on sign-in:

- `id` → Clerk user ID
- `email` → Primary email
- `full_name` → Full name
- `avatar_url` → Profile image

---

## Hooks Reference

All hooks imported from `@clerk/react-router`:

| Hook           | Key Returns                                                   | Use Case                                     |
| -------------- | ------------------------------------------------------------- | -------------------------------------------- |
| `useAuth()`    | `isLoaded`, `isSignedIn`, `userId`, `sessionId`, `getToken()` | Auth state without user details              |
| `useUser()`    | `isLoaded`, `user`                                            | User profile (id, email, fullName, imageUrl) |
| `useSession()` | `isLoaded`, `session.getToken()`                              | JWT token for API calls                      |
| `useClerk()`   | `signOut({ redirectUrl })`                                    | Programmatic sign-out                        |

### User Object Properties

| Property                                 | Type             | Description   |
| ---------------------------------------- | ---------------- | ------------- |
| `user.id`                                | `string`         | Clerk user ID |
| `user.primaryEmailAddress?.emailAddress` | `string`         | Email         |
| `user.fullName`                          | `string \| null` | Full name     |
| `user.imageUrl`                          | `string`         | Avatar URL    |

For usage examples, see [CLAUDE.md](../CLAUDE.md#authentication-clerk).

---

## Supabase Integration

Clerk tokens are injected into Supabase for authenticated database access:

```typescript
// src/contexts/supabaseContext.tsx
const { session } = useSession();

const supabase = useMemo(
  () =>
    createSupabaseClient(async () => {
      if (!session) return null;
      return session.getToken(); // Clerk JWT injected
    }),
  [session?.id], // Only recreate on sign in/out, not every render
);
```

**Key points:**

- JWT includes `sub` (user ID) and `role: authenticated` claims
- Supabase `auth.uid()` equals Clerk user ID
- RLS policies enforce user-scoped access

See [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) for full details.

---

## Testing

### Mock Utilities

Import from `@/test`:

| Utility                      | Purpose                                  |
| ---------------------------- | ---------------------------------------- |
| `setMockClerkSignedIn(bool)` | Set sign-in status                       |
| `setMockClerkLoaded(bool)`   | Set loading state                        |
| `setMockClerkState({ ... })` | Set multiple values                      |
| `setMockClerkUser({ ... })`  | Customize mock user                      |
| `resetClerkMocks()`          | Reset to defaults (call in `beforeEach`) |

### Mock Components

| Component          | Test ID               |
| ------------------ | --------------------- |
| `SignInButton`     | `sign-in-button`      |
| `SignUpButton`     | `sign-up-button`      |
| `UserButton`       | `user-button`         |
| `RedirectToSignIn` | `redirect-to-sign-in` |

### Mock Constants & Fixtures

```typescript
// src/mocks/constants.ts
export const MOCK_USER = {
  id: 'user_123',
  email: 'test@example.com',
  fullName: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
};
export const MOCK_SESSION_ID = 'sess_123';
export const MOCK_AUTH_TOKEN = 'mock-auth-token';
```

```typescript
// src/mocks/fixtures/users.ts
import { createUser, createUsers } from '@/test';

const user = createUser({ fullName: 'Jane Doe' }); // Single user with overrides
const users = createUsers(3); // Array of mock users
```

### E2E Testing

For Playwright tests requiring authentication, use `@clerk/testing`:

```bash
CLERK_SECRET_KEY=sk_test_xxxxx
E2E_CLERK_USER_USERNAME=test@example.com
E2E_CLERK_USER_PASSWORD=your-password
```

See [E2E_TESTING.md](./E2E_TESTING.md#authenticated-testing) for full details.

---

## Troubleshooting

| Issue                                       | Cause                      | Fix                                                   |
| ------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| "Missing VITE_CLERK_PUBLISHABLE_KEY"        | Env var not set            | Add to `.env`, restart dev server                     |
| UI not matching theme                       | Missing CSS import         | Add `@import '@clerk/themes/shadcn.css'` to index.css |
| "useAuth must be used within ClerkProvider" | Component outside provider | Check `main.tsx` provider order                       |
| Modal not opening                           | Missing `mode="modal"`     | Use `<SignInButton mode="modal">`                     |
| Supabase not getting tokens                 | Wrong provider order       | SupabaseProvider must be inside ClerkProvider         |
| User data undefined                         | Checking before loaded     | Wait for `isLoaded === true` before accessing user    |

### Debug Auth State

```typescript
const { isLoaded, isSignedIn, userId } = useAuth();
console.log({ isLoaded, isSignedIn, userId });
```

### Debug Token Claims

```typescript
const { session } = useSession();
const token = await session?.getToken();
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log(payload); // { sub: "user_xxx", role: "authenticated", ... }
}
```

---

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React Router Integration](https://clerk.com/docs/references/react-router/overview)
- [Clerk Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)
- [Clerk Appearance Customization](https://clerk.com/docs/customization/overview)
- [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) - Database integration with Clerk tokens
