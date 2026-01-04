# Clerk Authentication Documentation

This document provides a comprehensive guide to the Clerk authentication integration in this React application, including architecture, configuration, usage patterns, and testing strategies.

## Table of Contents

1. [What is Clerk](#what-is-clerk)
2. [Why Clerk Over Supabase Auth](#why-clerk-over-supabase-auth)
3. [Architecture Overview](#architecture-overview)
4. [File Structure](#file-structure)
5. [Configuration](#configuration)
6. [Clerk Dashboard Setup](#clerk-dashboard-setup)
7. [Theme & Appearance](#theme--appearance)
8. [React Components](#react-components)
9. [Hooks Reference](#hooks-reference)
10. [Usage Examples](#usage-examples)
11. [Supabase Integration](#supabase-integration)
12. [Testing](#testing)
13. [Troubleshooting](#troubleshooting)
14. [Additional Resources](#additional-resources)

---

## What is Clerk

Clerk is a complete authentication and user management platform built for modern web applications. It provides:

- **Pre-built UI Components** - Beautiful, customizable sign-in/sign-up forms
- **Session Management** - Automatic session handling across tabs and devices
- **OAuth Providers** - 20+ social login providers out of the box
- **Multi-factor Authentication** - SMS, TOTP, and backup codes
- **Organizations & Teams** - Built-in multi-tenancy support
- **User Profiles** - Managed user data with avatars and metadata
- **Webhooks** - Real-time user lifecycle events

### Key Features

| Feature                | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| **Drop-in Components** | `<SignInButton>`, `<UserButton>`, etc. - ready to use     |
| **React Hooks**        | `useAuth()`, `useUser()`, `useSession()` for state access |
| **Theme System**       | Shadcn/Radix integration with light/dark mode             |
| **JWT Tokens**         | Automatic token generation for API authentication         |
| **Session Sync**       | Cross-tab session synchronization                         |
| **Passwordless**       | Magic links, passkeys, and email codes                    |
| **User Impersonation** | Support teams can act as users for debugging              |

### Strengths

| Strength                   | Details                                                       |
| -------------------------- | ------------------------------------------------------------- |
| **Production-ready UI**    | Polished, accessible components that match your design system |
| **Developer experience**   | Minimal code to add full authentication                       |
| **OAuth variety**          | Google, GitHub, Apple, Discord, LinkedIn, and 15+ more        |
| **Enterprise features**    | SSO, SAML, directory sync for B2B apps                        |
| **Active development**     | Regular updates, new features, and responsive support         |
| **Framework integrations** | First-class React Router, Next.js, Remix support              |

### Weaknesses

| Weakness              | Details                                                          |
| --------------------- | ---------------------------------------------------------------- |
| **Cost at scale**     | Free tier limited to 10,000 MAU (vs Supabase's 50,000)           |
| **Cloud-only**        | No self-hosting option available                                 |
| **Vendor dependency** | Auth is critical infrastructure tied to third party              |
| **Learning curve**    | Concepts like sessions, tokens, and claims require understanding |

---

## Why Clerk Over Supabase Auth

This project uses Clerk for authentication instead of Supabase Auth. Here's the decision rationale:

### Comparison Matrix

| Feature                | Clerk               | Supabase Auth         |
| ---------------------- | ------------------- | --------------------- |
| **Pre-built UI**       | Production-ready    | Basic, needs styling  |
| **OAuth Providers**    | 20+                 | ~10                   |
| **Organizations**      | Built-in            | Manual implementation |
| **MFA**                | SMS, TOTP, Passkeys | TOTP only             |
| **User Impersonation** | Yes                 | No                    |
| **Free Tier MAU**      | 10,000              | 50,000                |
| **Self-hosting**       | No                  | Yes                   |
| **Session Management** | Automatic cross-tab | Manual handling       |

### Why Clerk Was Chosen

1. **Superior Authentication UX**
   - Pre-built, polished UI components (`SignInButton`, `UserButton`)
   - Modal-based flows that don't require page navigation
   - Automatic theme integration with shadcn/radix
   - Mobile-optimized with fullscreen modals

2. **More OAuth Providers Out-of-the-Box**
   - Clerk: 20+ providers (Google, GitHub, Apple, Discord, LinkedIn, etc.)
   - Supabase Auth: ~10 providers, requires more manual configuration
   - Clerk handles provider setup in dashboard, not code

3. **Better Session Management**
   - Manages sessions across tabs/devices automatically
   - Built-in session revocation and multi-session support
   - Token refresh handled transparently

4. **Advanced Features Included**
   - Multi-factor authentication (MFA)
   - Passwordless (magic links, passkeys)
   - Organization/team management
   - User impersonation for support
   - Audit logs

5. **React-Router Integration**
   - `@clerk/react-router` provides optimized hooks for React Router
   - `RedirectToSignIn` component handles redirects cleanly
   - SSR-ready patterns

6. **Separation of Concerns**

   ```
   Clerk = Authentication (who is the user?)
   Supabase = Authorization + Data (what can they access?)
   ```

   This separation means:
   - Auth changes don't require database migrations
   - Database schema changes don't affect auth
   - Easier to swap either layer if needed

### When to Reconsider Supabase Auth

| Scenario                        | Recommendation         |
| ------------------------------- | ---------------------- |
| Budget is tight, >10k users     | Consider Supabase Auth |
| Need DB triggers on auth events | Consider Supabase Auth |
| Heavy Edge Functions usage      | Consider Supabase Auth |
| Self-hosting is required        | Must use Supabase Auth |
| Need anonymous → auth upgrade   | Consider Supabase Auth |

---

## Architecture Overview

This integration uses Clerk as the authentication provider, with tokens injected into Supabase for database access.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        React Application                             │
├─────────────────────────────────────────────────────────────────────┤
│  ClerkProvider (ClerkThemeProvider wrapper)                          │
│       │                                                              │
│       ├── useAuth()  ───► { isLoaded, isSignedIn, userId }          │
│       ├── useUser()  ───► { user: { id, email, fullName, ... } }    │
│       └── useSession() ─► { session.getToken() } ─► JWT Token       │
│                                                                      │
│  Components:                                                         │
│       ├── SignedIn / SignedOut  (conditional rendering)             │
│       ├── SignInButton          (modal sign-in trigger)             │
│       ├── UserButton            (user menu dropdown)                │
│       └── RedirectToSignIn      (auth guard redirect)               │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Clerk Backend                                 │
├─────────────────────────────────────────────────────────────────────┤
│  - User authentication (email, OAuth, passwordless)                  │
│  - Session management (cross-tab, multi-device)                      │
│  - JWT token generation with claims:                                 │
│      { sub: "user_xxx", role: "authenticated", ... }                 │
│  - User profile storage (name, email, avatar)                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Supabase Database                             │
├─────────────────────────────────────────────────────────────────────┤
│  - Validates Clerk JWTs (third-party auth provider)                  │
│  - auth.uid() = Clerk user_id (JWT sub claim)                        │
│  - RLS policies enforce user-scoped data access                      │
│  - ProfileSync component syncs Clerk user → profiles table           │
└─────────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
1. User clicks Sign In
       ↓
2. Clerk modal opens (SignInButton mode="modal")
       ↓
3. User authenticates (email, OAuth, etc.)
       ↓
4. Clerk creates session, stores in browser
       ↓
5. useAuth() returns { isSignedIn: true }
       ↓
6. useSession().session.getToken() returns JWT
       ↓
7. SupabaseProvider injects token into all requests
       ↓
8. Supabase validates JWT, sets auth.uid()
       ↓
9. RLS policies grant access to user's data
```

### Provider Hierarchy

The provider order is critical. `SupabaseProvider` must be inside `ClerkProvider`:

```tsx
<QueryProvider>
  {' '}
  {/* TanStack Query */}
  <I18nProvider>
    {' '}
    {/* Internationalization */}
    <BrowserRouter>
      {' '}
      {/* React Router */}
      <ClerkThemeProvider>
        {' '}
        {/* Clerk Auth - MUST be before Supabase */}
        <SupabaseProvider>
          {' '}
          {/* Supabase - needs useSession() */}
          <MobileProvider>
            {' '}
            {/* Responsive context */}
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </MobileProvider>
        </SupabaseProvider>
      </ClerkThemeProvider>
    </BrowserRouter>
  </I18nProvider>
</QueryProvider>
```

---

## File Structure

```
src/
├── contexts/
│   └── clerkContext.tsx          # ClerkThemeProvider with shadcn theme
│
├── components/
│   └── shared/
│       ├── AccountButton/
│       │   ├── AccountButton.tsx      # Sign in / User button component
│       │   ├── AccountButton.test.tsx # Component tests
│       │   └── index.ts               # Barrel export
│       │
│       ├── ProtectedRoute/
│       │   ├── ProtectedRoute.tsx     # Auth guard wrapper
│       │   ├── ProtectedRoute.test.tsx
│       │   └── index.ts
│       │
│       └── ProfileSync/
│           ├── ProfileSync.tsx        # Auto-sync Clerk → Supabase
│           ├── ProfileSync.test.tsx
│           └── index.ts
│
├── lib/
│   └── env.ts                    # Environment variable validation
│
├── test/
│   ├── clerkMock.tsx             # Comprehensive Clerk mocks
│   ├── providers.tsx             # Test wrapper with all providers
│   └── index.ts                  # Test utility exports
│
├── mocks/
│   ├── constants.ts              # Mock user/session constants
│   └── fixtures/
│       └── users.ts              # Mock user factories
│
├── index.css                     # Includes @clerk/themes/shadcn.css
├── main.tsx                      # App initialization with ClerkProvider
└── test-setup.ts                 # Global Clerk mock setup
```

---

## Configuration

### Environment Variables

Add to `.env`:

```bash
# Clerk Authentication (required)
# Get your Publishable Key from: https://dashboard.clerk.com/~/api-keys
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Environment Validation

The application validates the Clerk key at startup in `main.tsx`:

```typescript
const CLERK_PUBLISHABLE_KEY = env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}
```

### Zod Schema Validation

In `src/lib/env.ts`:

```typescript
const envSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
  // ... other variables
});
```

### Where to Find Your Key

1. Navigate to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **API Keys** in the sidebar
4. Copy the **Publishable key** (starts with `pk_test_` or `pk_live_`)

---

## Clerk Dashboard Setup

### Step 1: Create Application

1. Sign up at [clerk.com](https://clerk.com)
2. Click **Create Application**
3. Name your application
4. Select authentication methods:
   - Email (recommended)
   - Google, GitHub, etc. (optional)

### Step 2: Configure Sign-In Options

1. Go to **User & Authentication > Email, Phone, Username**
2. Enable/disable:
   - Email addresses (recommended: required)
   - Phone numbers (optional)
   - Usernames (optional)

### Step 3: Configure OAuth Providers

1. Go to **User & Authentication > Social Connections**
2. Enable desired providers (Google, GitHub, etc.)
3. For each provider:
   - Use Clerk's shared credentials (development)
   - Or add your own OAuth app credentials (production)

### Step 4: Configure Supabase Integration

1. Go to **Integrations** in Clerk Dashboard
2. Find **Supabase** and click **Activate**
3. This adds the `role: authenticated` claim to JWTs
4. Copy your Clerk domain (e.g., `your-app.clerk.accounts.dev`)
5. In Supabase Dashboard:
   - Go to **Authentication > Sign In / Up**
   - Click **Add provider** > **Clerk**
   - Paste your Clerk domain

### Step 5: Customize Appearance (Optional)

1. Go to **Customization > Branding**
2. Upload logo, set colors
3. The app uses `@clerk/themes/shadcn` for automatic theming

---

## Theme & Appearance

### ClerkThemeProvider

The custom wrapper in `src/contexts/clerkContext.tsx` applies shadcn theming:

```typescript
import { ClerkProvider } from '@clerk/react-router';
import { shadcn } from '@clerk/themes';
import type { Appearance } from '@clerk/types';

const appearance: Appearance = {
  baseTheme: shadcn,
  variables: {
    fontFamily: '"Inter Variable", sans-serif',
    borderRadius: '0.45rem',  // Matches app's --radius
  },
  elements: {
    // Mobile-responsive modals
    modalBackdrop: 'backdrop-blur-sm',
    modalContent: 'sm:max-w-md max-sm:min-h-svh max-sm:min-w-full max-sm:rounded-none',
    card: 'max-sm:rounded-none max-sm:shadow-none',
    // Form element styling
    formFieldInput: 'rounded-md',
    formButtonPrimary: 'rounded-md',
    socialButtonsBlockButton: 'rounded-md',
  },
};

export function ClerkThemeProvider({ children, publishableKey }: ClerkThemeProviderProps) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      afterSignOutUrl="/"
      appearance={appearance}
    >
      {children}
    </ClerkProvider>
  );
}
```

### CSS Import

In `src/index.css`:

```css
@import '@clerk/themes/shadcn.css';
```

This import enables:

- Automatic light/dark mode adaptation
- CSS variable integration with shadcn
- Consistent styling with your design system

### Appearance Customization Options

| Property    | Description                                        |
| ----------- | -------------------------------------------------- |
| `baseTheme` | Pre-built theme (`shadcn`, `dark`, `neobrutalism`) |
| `variables` | CSS variables (font, colors, border-radius)        |
| `elements`  | Class overrides for specific elements              |
| `layout`    | Layout configuration (logo placement, etc.)        |

---

## React Components

### ClerkThemeProvider

**Location:** `src/contexts/clerkContext.tsx`

Custom wrapper around Clerk's `ClerkProvider` with integrated shadcn theme.

```typescript
import { ClerkThemeProvider } from '@/contexts/clerkContext';

// In main.tsx
<ClerkThemeProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
  {/* App content */}
</ClerkThemeProvider>
```

**Props:**

- `publishableKey` - Required Clerk publishable key
- `children` - React children

### AccountButton

**Location:** `src/components/shared/AccountButton/AccountButton.tsx`

Displays sign-in button when logged out, user menu when logged in.

```typescript
import { AccountButton } from '@/components/shared';

// In header
<AccountButton />
```

**Implementation:**

```typescript
export function AccountButton() {
  const { isLoaded } = useAuth();

  // Show skeleton while loading
  if (!isLoaded) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="ghost" size="sm">
            <Trans comment="Sign in button">Sign In</Trans>
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
```

### ProtectedRoute

**Location:** `src/components/shared/ProtectedRoute/ProtectedRoute.tsx`

HOC wrapper that redirects unauthenticated users to sign-in.

```typescript
import { ProtectedRoute } from '@/components/shared';

// In routes
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

**Implementation:**

```typescript
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <PageLoading />;  // Show spinner while checking auth
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;  // Redirect to Clerk sign-in
  }

  return <>{children}</>;  // Render protected content
}
```

### ProfileSync

**Location:** `src/components/shared/ProfileSync/ProfileSync.tsx`

Invisible component that automatically syncs Clerk user data to Supabase.

```typescript
import { ProfileSync } from '@/components/shared';

// In app layout
function App() {
  return (
    <>
      <ProfileSync
        onSyncComplete={() => console.log('Synced!')}
        onSyncError={(error) => console.error(error)}
      />
      <Routes>...</Routes>
    </>
  );
}
```

**Props:**

- `onSyncComplete` - Optional callback when sync succeeds
- `onSyncError` - Optional callback when sync fails

**Behavior:**

1. Waits for Clerk user to load
2. Checks if Supabase profile exists
3. Creates or updates profile if needed
4. Only syncs once per component mount (prevents loops)

**Synced Fields:**

- `id` - Clerk user ID
- `email` - Primary email address
- `full_name` - Full name from Clerk
- `avatar_url` - Profile image URL

---

## Hooks Reference

### useAuth()

**Import:** `from '@clerk/react-router'`

Returns authentication state without user details.

```typescript
const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
```

**Returns:**

| Property     | Type                    | Description                        |
| ------------ | ----------------------- | ---------------------------------- |
| `isLoaded`   | `boolean`               | Whether Clerk has finished loading |
| `isSignedIn` | `boolean \| undefined`  | Whether user is authenticated      |
| `userId`     | `string \| null`        | Clerk user ID (e.g., `user_xxx`)   |
| `sessionId`  | `string \| null`        | Current session ID                 |
| `getToken`   | `() => Promise<string>` | Get JWT token for API calls        |

**Usage:**

```typescript
function MyComponent() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <Loading />;
  if (!isSignedIn) return <SignInPrompt />;

  return <AuthenticatedContent />;
}
```

### useUser()

**Import:** `from '@clerk/react-router'`

Returns the current user object with profile data.

```typescript
const { isLoaded, user } = useUser();
```

**User Object Properties:**

| Property                                | Type             | Description           |
| --------------------------------------- | ---------------- | --------------------- |
| `user.id`                               | `string`         | Clerk user ID         |
| `user.primaryEmailAddress`              | `EmailAddress`   | Primary email object  |
| `user.primaryEmailAddress.emailAddress` | `string`         | Email string          |
| `user.fullName`                         | `string \| null` | Full name             |
| `user.firstName`                        | `string \| null` | First name            |
| `user.lastName`                         | `string \| null` | Last name             |
| `user.imageUrl`                         | `string`         | Avatar URL            |
| `user.createdAt`                        | `Date`           | Account creation date |

**Usage:**

```typescript
function UserProfile() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return <Loading />;
  if (!user) return <NotSignedIn />;

  return (
    <div>
      <img src={user.imageUrl} alt={user.fullName} />
      <h1>{user.fullName}</h1>
      <p>{user.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
```

### useSession()

**Import:** `from '@clerk/react-router'`

Returns the current session object for token access.

```typescript
const { isLoaded, session } = useSession();
```

**Session Methods:**

| Method       | Returns           | Description                         |
| ------------ | ----------------- | ----------------------------------- |
| `getToken()` | `Promise<string>` | Get JWT for authenticated API calls |

**Usage (with Supabase):**

```typescript
const { session } = useSession();

// In SupabaseProvider
const supabase = useMemo(
  () =>
    createSupabaseClient(async () => {
      if (!session) return null;
      return session.getToken(); // Inject Clerk token
    }),
  [session?.id],
);
```

---

## Usage Examples

### Basic Authentication Check

```typescript
import { useAuth } from '@clerk/react-router';

function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  return <div>Welcome to your dashboard!</div>;
}
```

### Conditional Rendering

```typescript
import { SignedIn, SignedOut } from '@clerk/react-router';

function Header() {
  return (
    <header>
      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
```

### Accessing User Data

```typescript
import { useUser } from '@clerk/react-router';

function WelcomeBanner() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return null;

  return (
    <div>
      <img src={user.imageUrl} alt="Avatar" />
      <h1>Welcome, {user.firstName || user.fullName}!</h1>
      <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
```

### Protected API Calls

```typescript
import { useAuth } from '@clerk/react-router';

function ApiExample() {
  const { getToken } = useAuth();

  const fetchProtectedData = async () => {
    const token = await getToken();

    const response = await fetch('/api/protected', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  };
}
```

### Sign Out Programmatically

```typescript
import { useClerk } from '@clerk/react-router';

function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button onClick={() => signOut({ redirectUrl: '/' })}>
      Sign Out
    </button>
  );
}
```

---

## Supabase Integration

Clerk integrates with Supabase to provide authenticated database access. See [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) for full details.

### How It Works

1. **Clerk provides JWTs** with `sub` (user ID) and `role: authenticated` claims
2. **SupabaseProvider** injects tokens via `session.getToken()`
3. **Supabase validates** Clerk JWTs (third-party auth provider)
4. **RLS policies** use `auth.uid()` which equals Clerk user ID

### Token Injection

```typescript
// src/contexts/supabaseContext.tsx
const { session } = useSession(); // Clerk hook

const supabase = useMemo(
  () =>
    createSupabaseClient(async () => {
      if (!session) return null;
      return session.getToken(); // No template needed
    }),
  [session?.id], // Only recreate on session change
);
```

### ProfileSync Component

Automatically syncs Clerk user data to Supabase profiles table:

```typescript
// Syncs these fields from Clerk → Supabase
{
  id: user.id,                                    // Clerk user ID
  email: user.primaryEmailAddress?.emailAddress,  // Primary email
  full_name: user.fullName,                       // Full name
  avatar_url: user.imageUrl,                      // Avatar URL
}
```

---

## Testing

### Global Mock Setup

In `src/test-setup.ts`:

```typescript
vi.mock('@clerk/react-router', async () => import('@/test/clerkMock'));
vi.mock('@clerk/themes', () => ({
  shadcn: { baseTheme: 'shadcn' },
}));
```

### Mock Utilities

**Location:** `src/test/clerkMock.tsx`

#### State Control Functions

```typescript
import { setMockClerkSignedIn, setMockClerkLoaded, setMockClerkState, setMockClerkUser, resetClerkMocks } from '@/test';

// Set sign-in status
setMockClerkSignedIn(true); // User is signed in
setMockClerkSignedIn(false); // User is signed out

// Set loading state
setMockClerkLoaded(true); // Clerk has finished loading
setMockClerkLoaded(false); // Clerk is still loading

// Set multiple values at once
setMockClerkState({
  isSignedIn: true,
  isLoaded: true,
  userId: 'custom_user_id',
});

// Customize mock user
setMockClerkUser({
  fullName: 'John Doe',
  email: 'john@example.com',
});

// Reset to defaults (call in beforeEach)
resetClerkMocks();
```

#### Mock Components

The mock provides these components with test IDs:

| Component          | Test ID               |
| ------------------ | --------------------- |
| `SignInButton`     | `sign-in-button`      |
| `SignUpButton`     | `sign-up-button`      |
| `UserButton`       | `user-button`         |
| `RedirectToSignIn` | `redirect-to-sign-in` |

### Example Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render, setMockClerkSignedIn, setMockClerkLoaded, resetClerkMocks } from '@/test';
import { AccountButton } from './AccountButton';
import { ProtectedRoute } from './ProtectedRoute';

describe('AccountButton', () => {
  beforeEach(() => {
    resetClerkMocks();  // Reset to defaults (signed in, loaded)
  });

  it('shows user button when signed in', () => {
    render(<AccountButton />);
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });

  it('shows sign in button when signed out', () => {
    setMockClerkSignedIn(false);
    render(<AccountButton />);
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
  });

  it('shows loading skeleton while auth loads', () => {
    setMockClerkLoaded(false);
    const { container } = render(<AccountButton />);
    expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
  });
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    resetClerkMocks();
  });

  it('renders children when authenticated', () => {
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects when not authenticated', () => {
    setMockClerkSignedIn(false);
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByTestId('redirect-to-sign-in')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
```

### Mock Constants

**Location:** `src/mocks/constants.ts`

```typescript
export const MOCK_USER = {
  id: 'user_123',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  fullName: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
};

export const MOCK_SESSION_ID = 'sess_123';
export const MOCK_AUTH_TOKEN = 'mock-auth-token';
```

### User Fixtures

**Location:** `src/mocks/fixtures/users.ts`

```typescript
import { createUser, createUsers } from '@/test';

// Create a single user with overrides
const user = createUser({ fullName: 'Jane Doe' });

// Create multiple users
const users = createUsers(3); // Array of 3 mock users
```

---

## Troubleshooting

### Common Issues

#### "Missing VITE_CLERK_PUBLISHABLE_KEY environment variable"

**Cause:** Environment variable not set or `.env` file not loaded.

**Solution:**

1. Create `.env` file in project root
2. Add: `VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx`
3. Restart dev server (`npm run dev`)

#### Clerk UI Not Matching App Theme

**Cause:** Missing CSS import or theme configuration.

**Solution:**

1. Verify import in `src/index.css`:
   ```css
   @import '@clerk/themes/shadcn.css';
   ```
2. Check `ClerkThemeProvider` uses `appearance` prop with `shadcn` base theme

#### "useAuth must be used within ClerkProvider"

**Cause:** Component is outside the Clerk provider hierarchy.

**Solution:**

1. Check `main.tsx` provider order
2. Ensure `ClerkThemeProvider` wraps the component

#### Sign-In Modal Not Opening

**Cause:** Missing `mode="modal"` prop on `SignInButton`.

**Solution:**

```typescript
<SignInButton mode="modal">
  <Button>Sign In</Button>
</SignInButton>
```

#### SupabaseProvider Not Getting Clerk Tokens

**Cause:** Incorrect provider order - `SupabaseProvider` must be inside `ClerkProvider`.

**Solution:**

```typescript
<ClerkThemeProvider>
  <SupabaseProvider>  {/* Must be inside ClerkProvider */}
    <App />
  </SupabaseProvider>
</ClerkThemeProvider>
```

#### User Data Not Available After Sign-In

**Cause:** Checking user before `isLoaded` is true.

**Solution:**

```typescript
const { isLoaded, user } = useUser();

if (!isLoaded) return <Loading />;  // Wait for Clerk to load
if (!user) return <NotSignedIn />;

// Now safe to use user data
```

### Debug Techniques

#### Check Token Claims

```typescript
const { session } = useSession();

const debugToken = async () => {
  const token = await session?.getToken();
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token claims:', payload);
    // Should include: { sub: "user_xxx", role: "authenticated", ... }
  }
};
```

#### Verify Auth State

```typescript
const { isLoaded, isSignedIn, userId, sessionId } = useAuth();

console.log({
  isLoaded,
  isSignedIn,
  userId,
  sessionId,
});
```

#### Check Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Check **Users** for the expected user
3. Check **Sessions** for active sessions
4. Check **Logs** for authentication events

---

## Additional Resources

### Official Documentation

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React Router Integration](https://clerk.com/docs/references/react-router/overview)
- [Clerk Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)
- [Clerk Appearance Customization](https://clerk.com/docs/customization/overview)
- [Clerk Components Reference](https://clerk.com/docs/components/overview)

### Related Project Documentation

- [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) - Database integration with Clerk tokens
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall application architecture
- [TESTING.md](./TESTING.md) - Testing patterns and utilities

### Dependencies

```json
{
  "@clerk/react-router": "^2.3.7",
  "@clerk/themes": "^2.4.46"
}
```
