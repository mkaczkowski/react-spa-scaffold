# Supabase Integration Documentation

This document provides a comprehensive guide to the Supabase database integration in this React application, including architecture, configuration, usage patterns, and testing strategies.

## Table of Contents

1. [What is Supabase](#what-is-supabase)
2. [Architecture Overview](#architecture-overview)
3. [File Structure](#file-structure)
4. [Configuration](#configuration)
5. [Supabase Dashboard Setup](#supabase-dashboard-setup)
6. [Database Schema & SQL](#database-schema--sql)
7. [Database Migrations](#database-migrations)
8. [Authentication Flow](#authentication-flow)
9. [Database Types](#database-types)
10. [React Hooks](#react-hooks)
11. [Provider Hierarchy](#provider-hierarchy)
12. [Usage Examples](#usage-examples)
13. [Server-Side Rendering](#server-side-rendering)
14. [Testing](#testing)
15. [Security](#security)
16. [Netlify Deployment](#netlify-deployment)
17. [Troubleshooting](#troubleshooting)
18. [Migration Notes](#migration-notes)

---

## What is Supabase

Supabase is an open-source Firebase alternative built on PostgreSQL. It provides a complete backend platform with:

- **PostgreSQL Database** - Full Postgres with extensions (pg_vector, PostGIS, etc.)
- **Authentication** - Built-in auth + third-party providers (like Clerk)
- **Real-time Subscriptions** - WebSocket-based live data updates
- **Storage** - S3-compatible file storage with CDN
- **Edge Functions** - Serverless Deno functions
- **PostgREST API** - Auto-generated REST API from your schema

### Unique Capabilities

| Feature                      | What Makes It Special                                         |
| ---------------------------- | ------------------------------------------------------------- |
| **Row Level Security (RLS)** | Security enforced at database level, not application code     |
| **Real-time built-in**       | `supabase.channel().on('postgres_changes')` - instant updates |
| **PostgREST**                | Zero backend code for CRUD - your schema becomes your API     |
| **Full PostgreSQL**          | Extensions, stored procedures, triggers, full SQL power       |
| **Third-party auth**         | JWT validation without managing users (Clerk integration)     |
| **Self-hostable**            | Unlike Firebase, you can run it on your own infrastructure    |

### When Supabase Shines

**Ideal use cases:**

- **MVPs and rapid prototyping** - Instant API from schema, no backend code needed
- **Real-time applications** - Chat, live dashboards, collaborative tools
- **Teams who know SQL** - Leverage existing PostgreSQL expertise
- **Complex queries** - Joins, aggregations, full-text search, window functions
- **Multi-tenant apps** - RLS makes tenant isolation elegant and secure

**This project's approach:** Clerk handles auth complexity, Supabase handles data with RLS policies tied to `auth.uid()`.

### Strengths

| Strength                   | Details                                                          |
| -------------------------- | ---------------------------------------------------------------- |
| **PostgreSQL power**       | Real relational database, not NoSQL limitations                  |
| **RLS security**           | Policies enforced at DB level - impossible to bypass in app code |
| **Generous free tier**     | 500MB storage, 2GB transfer, unlimited API requests              |
| **Open source**            | No vendor lock-in, can self-host anytime                         |
| **TypeScript generation**  | `npm run db:types` provides full type safety                     |
| **Familiar SQL**           | No proprietary query language to learn                           |
| **Ecosystem integrations** | Works with Clerk, Netlify, Vercel, and more                      |

### Weaknesses

| Weakness                   | Details                                                  |
| -------------------------- | -------------------------------------------------------- |
| **Cold starts**            | Paused projects on free tier take ~1s to wake up         |
| **Complex RLS**            | Policies can get complicated for multi-role applications |
| **Limited edge functions** | Less mature than Vercel/Cloudflare Workers               |
| **No offline support**     | Unlike Firebase, no built-in offline-first capabilities  |
| **Learning curve**         | RLS and Postgres concepts require understanding          |

### Comparison with Alternatives

| Feature            | Supabase          | Firebase          | PlanetScale | Neon       | Convex     |
| ------------------ | ----------------- | ----------------- | ----------- | ---------- | ---------- |
| **Database**       | PostgreSQL        | NoSQL (Firestore) | MySQL       | PostgreSQL | Custom     |
| **Real-time**      | Built-in          | Built-in          | No          | No         | Built-in   |
| **Auth**           | Yes + third-party | Built-in          | No          | No         | Built-in   |
| **Storage**        | Yes               | Yes               | No          | No         | Yes        |
| **Serverless**     | Edge Functions    | Cloud Functions   | No          | No         | Yes        |
| **Self-host**      | Yes               | No                | No          | No         | No         |
| **SQL**            | Full SQL          | NoSQL queries     | Full SQL    | Full SQL   | TypeScript |
| **Vendor lock-in** | Low               | High              | Medium      | Low        | Medium     |

### Quick Decision Guide

| Choose          | When                                                        |
| --------------- | ----------------------------------------------------------- |
| **Supabase**    | Need SQL, real-time, open-source, RLS security              |
| **Firebase**    | Google ecosystem, mobile-first, offline support needed      |
| **PlanetScale** | MySQL expertise, branching workflows, pure database only    |
| **Neon**        | Serverless Postgres only, no extras needed                  |
| **Convex**      | TypeScript-first, reactive by default, simpler mental model |

---

## Architecture Overview

This integration uses **Clerk as a third-party authentication provider for Supabase**, following the modern `accessToken` pattern (recommended as of April 2025). This approach:

- Validates Clerk JWTs directly in Supabase (no shared secrets needed)
- Enables Row Level Security (RLS) via `auth.uid()` = Clerk `user_id`
- Provides seamless authentication without managing separate Supabase users
- No need to fetch a new token for each Supabase request (handled automatically)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        React Application                             │
├─────────────────────────────────────────────────────────────────────┤
│  ClerkProvider (authentication)                                      │
│       │                                                              │
│       ▼                                                              │
│  useSession().getToken() ──► Clerk JWT Token                        │
│       │                      (includes role: authenticated)          │
│       ▼                                                              │
│  SupabaseProvider                                                    │
│       │                                                              │
│       ▼                                                              │
│  createClient({ accessToken: getToken })                             │
│       │                                                              │
│       ▼                                                              │
│  TanStack Query Hooks (useSupabaseQuery, useProfiles, etc.)         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Supabase Backend                              │
├─────────────────────────────────────────────────────────────────────┤
│  Third-Party Auth Provider: Clerk                                   │
│  - Validates Clerk JWTs automatically                                │
│  - auth.uid() = Clerk user_id (JWT sub claim)                        │
│  - auth.jwt() = Full JWT claims (for custom data)                    │
│  - auth.jwt()->>'sub' = User ID in SQL                               │
│       │                                                              │
│       ▼                                                              │
│  PostgreSQL + Row Level Security (RLS)                               │
│  - Policies enforce user-scoped data access                          │
│  - No direct table access without authentication                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **No Supabase Auth** - Clerk handles all authentication; Supabase only validates JWTs
2. **Modern `accessToken` Pattern** - Uses the new third-party auth approach (not deprecated JWT templates)
3. **Type-Safe Mutations** - Domain-specific hooks (e.g., `useProfiles`) instead of generic mutations
4. **Session-Based Client Recreation** - Client recreates only on session ID change, not every render
5. **TanStack Query Integration** - All data fetching uses React Query for caching/invalidation

### What the Clerk Supabase Integration Does

When enabled, the Clerk Supabase integration automatically adds a `"role": "authenticated"` claim to your Clerk session tokens. This claim is required by Supabase's APIs for authenticated requests.

---

## File Structure

```
src/
├── lib/
│   └── supabase/
│       ├── client.ts          # Supabase client factory with Clerk token injection
│       └── index.ts           # Barrel exports
│
├── contexts/
│   └── supabaseContext.tsx    # SupabaseProvider + useSupabase hook
│
├── hooks/
│   └── supabase/
│       ├── useSupabaseQuery.ts    # Generic SELECT hook with TanStack Query
│       ├── useProfiles.ts         # Profile-specific CRUD hooks
│       └── index.ts               # Barrel exports
│
├── types/
│   ├── supabase.ts            # Auto-generated types (npm run db:types)
│   └── database.ts            # Convenience aliases + re-exports (manual)
│
├── mocks/
│   ├── handlers/
│   │   └── supabase.ts        # MSW handlers for PostgREST API
│   └── fixtures/
│       └── profiles.ts        # Mock data factories
│
└── test/
    ├── supabaseMock.ts        # Unit test mock utilities
    ├── supabaseMock.test.ts   # Tests for mock utilities
    └── providers.tsx          # Test wrapper with SupabaseProvider
```

---

## Configuration

### Environment Variables

Add to `.env`:

```bash
# Supabase Database (required)
VITE_SUPABASE_DATABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase CLI (required for npm run db:types)
SUPABASE_PROJECT_ID=your-project-id
```

> **Finding your Project ID**: The project ID is the subdomain from your Supabase URL. If your URL is `https://abc123xyz.supabase.co`, then your project ID is `abc123xyz`.

> **CLI Authentication**: The `db:types` command requires Supabase CLI authentication. Run `npx supabase login` first, or set `SUPABASE_ACCESS_TOKEN` environment variable.

> **Note on API Keys**: Supabase is transitioning to new "publishable keys" with the format `sb_publishable_xxx`. During the transition period, both the legacy `anon` key and new publishable keys work. Get the correct key from your [Project's Connect dialog](https://supabase.com/dashboard/project/_?showConnect=true).

Both variables must be set together. The application validates this at startup in `main.tsx`:

```typescript
if ((SUPABASE_URL && !VITE_SUPABASE_ANON_KEY) || (!SUPABASE_URL && VITE_SUPABASE_ANON_KEY)) {
  throw new Error(
    'Supabase configuration incomplete. Both VITE_SUPABASE_DATABASE_URL and VITE_SUPABASE_ANON_KEY must be set together.',
  );
}
```

### Environment Validation

The `src/lib/env.ts` file validates environment variables using Zod:

```typescript
const envSchema = z.object({
  VITE_SUPABASE_DATABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  // ... other variables
});
```

### Where to Find Your Keys

1. Navigate to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Select your project
3. Go to **Project Settings > Data API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_DATABASE_URL`
   - **Project API keys** → `VITE_SUPABASE_ANON_KEY`

---

## Supabase Dashboard Setup

### Step 1: Enable Clerk as Third-Party Auth Provider

1. In the [Clerk Dashboard](https://dashboard.clerk.com), navigate to the **Supabase integration setup**
2. Select your configuration options and click **Activate Supabase integration**
3. Copy the **Clerk domain** shown (e.g., `your-app.clerk.accounts.dev`)
4. In the [Supabase Dashboard](https://supabase.com/dashboard), navigate to **Authentication > Sign In / Up**
5. Click **Add provider** and select **Clerk** from the list
6. Paste your **Clerk domain**

### Step 2: Create Your Database Tables

Use the Supabase SQL Editor to create tables. See [Database Schema & SQL](#database-schema--sql) for complete examples.

### Step 3: Enable RLS and Create Policies

Every table that stores user data must have:

1. RLS enabled
2. Policies that restrict access based on `auth.jwt()->>'sub'`

---

## Database Schema & SQL

### Creating Tables with User Scoping

When creating tables, add a `user_id` column that automatically captures the Clerk user ID:

```sql
-- Create a "profiles" table with automatic user_id from Clerk JWT
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,              -- Clerk user_id (matches auth.uid())
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Alternative: Auto-Generated User ID

For tables where user_id isn't the primary key, use the JWT sub claim as default:

```sql
-- Create a "tasks" table with automatic user_id default
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub',  -- Auto-set from Clerk JWT
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
```

### RLS Policies Using JWT Claims

Access Clerk session token data in Supabase using `auth.jwt()`:

```sql
-- Policy: Users can only view their own data
CREATE POLICY "Users can view own tasks"
ON tasks FOR SELECT TO authenticated
USING ((SELECT auth.jwt()->>'sub') = user_id);

-- Policy: Users can only insert their own data
CREATE POLICY "Users can insert own tasks"
ON tasks FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.jwt()->>'sub') = user_id);

-- Policy: Users can only update their own data
CREATE POLICY "Users can update own tasks"
ON tasks FOR UPDATE TO authenticated
USING ((SELECT auth.jwt()->>'sub') = user_id)
WITH CHECK ((SELECT auth.jwt()->>'sub') = user_id);

-- Policy: Users can only delete their own data
CREATE POLICY "Users can delete own tasks"
ON tasks FOR DELETE TO authenticated
USING ((SELECT auth.jwt()->>'sub') = user_id);
```

### Complete Profiles Table Setup

```sql
-- ============================================================
-- PROFILES TABLE (linked to Clerk user_id)
-- ============================================================

-- Create the table
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,              -- Clerk user_id (from auth.uid())
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (id = (auth.uid())::text);

-- Users can insert their own profile (first login)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = (auth.uid())::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = (auth.uid())::text)
  WITH CHECK (id = (auth.uid())::text);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE TO authenticated
  USING (id = (auth.uid())::text);

-- ============================================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Accessing JWT Claims in SQL

| Function               | Returns                      | Example                                                 |
| ---------------------- | ---------------------------- | ------------------------------------------------------- |
| `auth.uid()`           | Clerk user_id (uuid type)    | Cast to text with `(auth.uid())::text`                  |
| `auth.jwt()`           | Full JWT as JSON             | `{"sub": "user_2abc...", "role": "authenticated", ...}` |
| `auth.jwt()->>'sub'`   | User ID from JWT (text)      | `'user_2abc123xyz'`                                     |
| `auth.jwt()->>'email'` | Email from JWT (if included) | `'user@example.com'`                                    |

---

## Database Migrations

Supabase tracks schema changes through migrations, providing version control for your database.

### How It Works

Migrations are stored in the `supabase_migrations.schema_migrations` table:

| version        | name                                   |
| -------------- | -------------------------------------- |
| 20260104010905 | fix_rls_policies_and_function_security |

The version is a timestamp (`YYYYMMDDHHMMSS`) ensuring migrations run in order.

### Two Ways to Create Migrations

| Method                                | When to Use                          |
| ------------------------------------- | ------------------------------------ |
| **Supabase MCP** (AI-assisted)        | Claude applies directly to remote DB |
| **Supabase CLI** (version-controlled) | Local SQL files tracked in git       |

### Supabase MCP (Model Context Protocol)

The [Supabase MCP server](https://supabase.com/docs/guides/getting-started/mcp) enables AI assistants like Claude to interact directly with your Supabase project.

**Available MCP tools:**

| Tool                        | Description                                  |
| --------------------------- | -------------------------------------------- |
| `apply_migration`           | Apply DDL changes (CREATE, ALTER, DROP)      |
| `execute_sql`               | Run queries (SELECT, INSERT, UPDATE, DELETE) |
| `list_tables`               | List all tables in schemas                   |
| `list_migrations`           | View applied migrations                      |
| `get_advisors`              | Check security/performance recommendations   |
| `generate_typescript_types` | Generate types from schema                   |

**Example - Claude applying a migration:**

```
mcp__supabase__apply_migration
  name: "add_user_preferences"
  query: "CREATE TABLE user_preferences (...)"
```

### Supabase CLI Workflow (Recommended for Teams)

```bash
# Create a new migration file
npx supabase migration new add_posts_table
# Creates: supabase/migrations/20260104_add_posts_table.sql

# Edit the SQL file, then push to remote
npm run db:push   # or: npx supabase db push

# Pull remote schema changes to local
npx supabase db pull

# List all migrations
npx supabase migration list
```

### Project Commands

```bash
npm run db:push    # Push local migrations → Supabase
npm run db:types   # Generate TypeScript types from schema
npm run db:studio  # Open Supabase Studio (visual editor)
```

### Key Points

- Migrations are **one-way** (applied once, never re-run)
- Each migration should be **idempotent** where possible (use `IF EXISTS`, `IF NOT EXISTS`)
- Track migrations in git via `supabase/migrations/` folder for team reproducibility
- Use `npx supabase db pull` to sync remote schema changes to local migration files

### Best Practices

1. **Use `(select auth.uid())` in RLS policies** - Prevents re-evaluation per row for better performance
2. **Set `search_path = ''` on functions** - Security best practice for `SECURITY DEFINER` functions
3. **Name migrations descriptively** - Use snake_case: `add_user_preferences_table`, `fix_rls_policies`
4. **Test migrations locally first** - Use `npx supabase start` for local development

---

## Authentication Flow

### Token Injection

The `createSupabaseClient` function in `src/lib/supabase/client.ts` creates a typed Supabase client that automatically injects Clerk tokens:

```typescript
export function createSupabaseClient(getToken: GetTokenFn): TypedSupabaseClient {
  return createClient<Database>(supabaseUrl, supabaseApiKey, {
    accessToken: getToken, // Called automatically on every request
  });
}
```

### Session Management

The `SupabaseProvider` uses `useMemo` with `session?.id` dependency to prevent unnecessary client recreation:

```typescript
export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const { session } = useSession();

  const supabase = useMemo(
    () => createSupabaseClient(async () => {
      if (!session) return null;
      return session.getToken();  // No template needed with native integration
    }),
    [session?.id]  // Only recreate on sign in/out
  );

  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>;
}
```

### Why `session?.id` Instead of `session`?

- The `session` object reference changes on every Clerk re-render
- `session.id` only changes on actual session changes (sign in/out)
- This prevents performance issues from constant client recreation

### Why No JWT Template?

The modern integration (post April 2025) doesn't require JWT templates:

| Old Approach (Deprecated)                 | New Approach (Current)               |
| ----------------------------------------- | ------------------------------------ |
| Create Supabase JWT template in Clerk     | Enable Clerk as third-party provider |
| Share JWT secret between platforms        | No shared secrets needed             |
| Call `getToken({ template: 'supabase' })` | Call `getToken()` directly           |
| Manually inject token in fetch            | Use `accessToken` config option      |

---

## Database Types

### Schema Definition (`src/types/database.ts`)

The database types follow Supabase's structure and can be auto-generated:

```typescript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // Clerk user_id (from auth.uid())
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          /* required fields for INSERT */
        };
        Update: {
          /* optional fields for UPDATE */
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
```

### Helper Types

```typescript
// Convenience aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Generic helpers
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
```

### Regenerating Types

After schema changes, regenerate types:

```bash
npm run db:types
```

This requires `SUPABASE_PROJECT_ID` in your `.env` file. The project ID is the subdomain from your Supabase URL (e.g., `abc123xyz` from `https://abc123xyz.supabase.co`).

The script uses `dotenv-cli` (installed as a dev dependency) to automatically load environment variables from `.env`.

### Adding Convenience Type Aliases

The auto-generated `supabase.ts` is overwritten on each regeneration. Convenience type aliases live in `database.ts` which provides a database-agnostic public API:

```typescript
// src/types/database.ts
export * from './supabase'; // Re-export all generated types

import type { Tables, TablesInsert, TablesUpdate } from './supabase';

// Add aliases for your tables
export type Profile = Tables<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

// When adding new tables, add aliases here:
// export type Post = Tables<'posts'>;
// export type PostInsert = TablesInsert<'posts'>;
// export type PostUpdate = TablesUpdate<'posts'>;
```

Import convenience types from `@/types/database`:

```typescript
import type { Profile, ProfileInsert } from '@/types/database';
```

---

## React Hooks

### Generic Query Hook

`useSupabaseQuery` provides type-safe SELECT queries with TanStack Query integration:

```typescript
import { useSupabaseQuery } from '@/hooks';

// Fetch all profiles (respects RLS)
const { data, isLoading, error } = useSupabaseQuery<Profile>({
  table: 'profiles',
  queryKey: ['all'],
});

// Fetch with filter
const { data } = useSupabaseQuery<Profile>({
  table: 'profiles',
  select: 'id, full_name',
  filter: (query) => query.eq('id', userId),
  queryKey: ['single', userId],
});

// With custom options
const { data } = useSupabaseQuery<Profile>({
  table: 'profiles',
  queryKey: ['current'],
  queryOptions: {
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!userId,
  },
});
```

### Profile Hooks

Domain-specific hooks provide type-safe CRUD operations:

#### `useProfile()` (Recommended)

Convenience hook that returns a single profile object instead of an array:

```typescript
import { useProfile } from '@/hooks';

function ProfilePage() {
  const { profile, isLoading, error, exists } = useProfile();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!exists) return <CreateProfileForm />;

  return <ProfileDisplay profile={profile} />;
}
```

#### `useCurrentProfile()`

Lower-level hook that returns the raw query result (array):

```typescript
function ProfilePage() {
  const { data: profiles, isLoading, error } = useCurrentProfile();
  const profile = profiles?.[0];

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!profile) return <CreateProfileForm />;

  return <ProfileDisplay profile={profile} />;
}
```

#### `useUpsertProfile()`

Creates or updates a profile. For automatic syncing, use the `<ProfileSync />` component instead:

```typescript
const upsertProfile = useUpsertProfile();

upsertProfile.mutate({
  id: user.id,
  email: user.primaryEmailAddress?.emailAddress ?? '',
  full_name: user.fullName,
  avatar_url: user.imageUrl,
});
```

#### `useUpdateProfile()`

Updates specific fields of the current user's profile:

```typescript
function EditProfileForm() {
  const updateProfile = useUpdateProfile();

  const handleSubmit = (values: ProfileUpdate) => {
    updateProfile.mutate(values, {
      onSuccess: () => toast.success('Profile updated!'),
      onError: (error) => toast.error(error.message),
    });
  };
}
```

#### `useDeleteProfile()`

Deletes the current user's profile:

```typescript
function DeleteAccountButton() {
  const deleteProfile = useDeleteProfile();

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      await deleteProfile.mutateAsync();
    }
  };
}
```

### Cache Invalidation

All mutation hooks automatically invalidate related queries:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['supabase', 'profiles'] });
};
```

---

## Provider Hierarchy

The provider order is critical. `SupabaseProvider` must be inside `ClerkProvider`:

```tsx
// main.tsx
<QueryProvider>
  {' '}
  {/* TanStack Query */}
  <I18nProvider i18n={i18n}>
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
          {/* Supabase - needs useSession() from Clerk */}
          <MobileProvider>
            {' '}
            {/* Responsive context */}
            <ErrorBoundary>
              <PerformanceProviderWrapper>
                <App />
                <Toaster />
              </PerformanceProviderWrapper>
            </ErrorBoundary>
          </MobileProvider>
        </SupabaseProvider>
      </ClerkThemeProvider>
    </BrowserRouter>
  </I18nProvider>
</QueryProvider>
```

---

## ProfileSync Component

The `ProfileSync` component automatically syncs Clerk user data to Supabase when users sign in. It's an invisible component that handles profile creation and updates.

### Basic Usage

Add it to your app layout or inside protected routes:

```tsx
import { ProfileSync } from '@/components/shared';

function App() {
  return (
    <>
      <ProfileSync />
      <Routes>{/* Your routes */}</Routes>
    </>
  );
}
```

### With Callbacks

Handle sync completion or errors:

```tsx
<ProfileSync
  onSyncComplete={() => console.log('Profile synced!')}
  onSyncError={(error) => console.error('Sync failed:', error)}
/>
```

### How It Works

1. Waits for Clerk user to be loaded
2. Checks if a profile already exists in Supabase
3. Creates or updates the profile if:
   - No profile exists, OR
   - User's email has changed in Clerk
4. Only syncs once per component mount (prevents loops)

### When to Use

- **First-time users**: Automatically creates their profile
- **Profile updates**: Syncs changes from Clerk (email, name, avatar)
- **No webhooks needed**: Client-side sync for simple use cases

For more complex scenarios (e.g., syncing additional Clerk data, handling deletions), consider using [Clerk webhooks](https://clerk.com/docs/webhooks/overview).

---

## Usage Examples

### Direct Client Access

For operations not covered by hooks:

```typescript
import { useSupabase } from '@/hooks';

function MyComponent() {
  const supabase = useSupabase();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  };
}
```

### Complete CRUD Example (Tasks)

```typescript
'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/react-router';
import { useSupabase } from '@/hooks';

export function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  const { user } = useUser();
  const supabase = useSupabase();

  // Load tasks when user is available
  useEffect(() => {
    if (!user) return;

    async function loadTasks() {
      setLoading(true);
      const { data, error } = await supabase.from('tasks').select();
      if (!error) setTasks(data ?? []);
      setLoading(false);
    }

    loadTasks();
  }, [user, supabase]);

  // Create a new task
  async function createTask(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from('tasks').insert({ name });

    if (!error) {
      setName('');
      // Refresh tasks
      const { data } = await supabase.from('tasks').select();
      setTasks(data ?? []);
    }
  }

  return (
    <div>
      <h1>Tasks</h1>

      {loading && <p>Loading...</p>}

      {!loading && tasks.length > 0 && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
      )}

      {!loading && tasks.length === 0 && <p>No tasks found</p>}

      <form onSubmit={createTask}>
        <input
          type="text"
          placeholder="Enter new task"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
```

### Real-time Subscriptions

```typescript
function RealtimeProfiles() {
  const supabase = useSupabase();

  useEffect(() => {
    const subscription = supabase
      .channel('profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        console.log('Change received!', payload);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
}
```

### File Storage

```typescript
function AvatarUpload() {
  const supabase = useSupabase();
  const { user } = useUser();

  const uploadAvatar = async (file: File) => {
    const filePath = `avatars/${user.id}/${file.name}`;

    const { error } = await supabase.storage.from('avatars').upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    return data.publicUrl;
  };
}
```

---

## Server-Side Rendering

For Next.js or other SSR frameworks, you can access Supabase on the server:

```typescript
// app/page.tsx (Next.js Server Component)
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export default async function Page() {
  const { getToken } = await auth();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return await getToken() ?? null;
      },
    }
  );

  const { data: tasks } = await supabase.from('tasks').select();

  return (
    <ul>
      {tasks?.map((task) => (
        <li key={task.id}>{task.name}</li>
      ))}
    </ul>
  );
}
```

---

## Testing

### Test Setup (`src/test-setup.ts`)

The global test setup mocks both Clerk and Supabase:

```typescript
// Mock Supabase context with test client
vi.mock('@/contexts/supabaseContext', () => {
  const mockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    // ...
  };

  return {
    SupabaseProvider: ({ children }) => children,
    useSupabase: () => ({ from: vi.fn().mockReturnValue(mockQueryBuilder) }),
  };
});

// Reset mocks after each test
afterEach(() => {
  resetSupabaseMocks();
});
```

### Mock Utilities (`src/test/supabaseMock.ts`)

Control mock behavior in tests:

```typescript
import { setMockSupabaseData, setMockSupabaseError, resetSupabaseMocks, createProfile } from '@/test';

// Set data to return
setMockSupabaseData([createProfile({ full_name: 'Test User' })]);

// Simulate an error
setMockSupabaseError({ message: 'Database error', code: 'DB_ERROR' });

// Reset to defaults
resetSupabaseMocks();
```

### MSW Handlers (`src/mocks/handlers/supabase.ts`)

For integration tests, MSW handlers simulate the PostgREST API:

```typescript
export const supabaseHandlers = [
  // GET /rest/v1/profiles
  http.get(`${SUPABASE_URL}/rest/v1/profiles`, async ({ request }) => {
    const authError = checkAuth(request);
    if (authError) return authError;

    // Simulate RLS
    const userId = getUserIdFromToken(request);
    const profiles = mockProfiles.filter((p) => p.id === userId);

    return HttpResponse.json(profiles);
  }),

  // POST, PATCH, DELETE handlers...
];
```

### Test Providers (`src/test/providers.tsx`)

The test wrapper includes all providers:

```typescript
function AllProviders({ children }: WrapperProps) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      <ClerkThemeProvider publishableKey="test_key">
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </ClerkThemeProvider>
    </QueryClientProvider>
  );
}

// Usage in tests
import { render, setMockSupabaseData, mockProfiles } from '@/test';

it('renders profile', () => {
  setMockSupabaseData(mockProfiles);
  render(<ProfileComponent />);
  // ...
});
```

### Example Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, setMockSupabaseData, setMockSupabaseError, createProfile, resetSupabaseMocks } from '@/test';
import { ProfileDisplay } from './ProfileDisplay';

describe('ProfileDisplay', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  it('displays user profile', async () => {
    const profile = createProfile({
      full_name: 'John Doe',
      email: 'john@example.com',
    });
    setMockSupabaseData([profile]);

    const { findByText } = render(<ProfileDisplay />);

    expect(await findByText('John Doe')).toBeInTheDocument();
  });

  it('shows error on fetch failure', async () => {
    setMockSupabaseError({ message: 'Network error', code: 'NETWORK' });

    const { findByText } = render(<ProfileDisplay />);

    expect(await findByText('Network error')).toBeInTheDocument();
  });
});
```

### Testing RLS Policies

To verify RLS is working correctly:

1. Create tasks with different user accounts
2. Check that each user only sees their own tasks in the Supabase dashboard
3. The `user_id` column should show different values

---

## Security

### Row Level Security (RLS)

All tables must have RLS enabled with appropriate policies:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (id = (auth.uid())::text);

-- Users can only insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = (auth.uid())::text);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = (auth.uid())::text)
  WITH CHECK (id = (auth.uid())::text);

-- Users can only delete their own profile
CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE TO authenticated
  USING (id = (auth.uid())::text);
```

### Security Best Practices

1. **Never expose service role key** - Only use api key in client code
2. **Always enable RLS** - Every table should have RLS policies
3. **Validate on server** - Don't trust client-side validation alone
4. **Use `(auth.uid())::text`** - Cast to text when comparing with TEXT columns (Clerk user_id)
5. **Audit policies** - Regularly review RLS policies for holes
6. **Test with multiple accounts** - Verify users can't access each other's data

### Key Types Explained

| Key                  | Usage                                       | Expose to Client? |
| -------------------- | ------------------------------------------- | ----------------- |
| `anon` / Publishable | Client-side queries (respects RLS)          | Yes               |
| `service_role`       | Server-side admin operations (bypasses RLS) | **Never**         |

---

## Netlify Deployment

### Netlify Supabase Extension

The Supabase integration for Netlify streamlines your workflow by connecting your Supabase and Netlify projects with:

- **Seamless OAuth authentication** - Connect your Supabase account securely
- **Automated environment configuration** - Auto-sets crucial variables
- **Framework compatibility** - Select your frontend framework for proper prefixes

#### Installation Steps

1. In Netlify Dashboard → **Extensions** → Search "Supabase"
2. Click **Install**
3. Navigate to **Project configuration > General > Supabase**
4. Click **Connect** and authorize with Supabase
5. Select your Supabase project and framework
6. For Vite/React, select `Other` and enter prefix: `VITE_`

#### Auto-Configured Variables

The integration automatically creates these environment variables:

| Variable                    | Usage                                    |
| --------------------------- | ---------------------------------------- |
| `SUPABASE_DATABASE_URL`     | Direct database connection (server-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin operations (server-side only)      |
| `VITE_SUPABASE_ANON_KEY`    | Client-side queries                      |

With Vite prefix (`VITE_`):

- `VITE_SUPABASE_DATABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Local Development with Netlify CLI

```bash
# Install CLI
npm install -g netlify-cli

# Link to your site
netlify link

# Run with injected env vars (automatically loads from Netlify)
netlify dev
```

Netlify Dev will automatically inject the configuration environment variables for you.

### User-Level Authentication

The Supabase integration authenticates at the user-level. When collaborating on a team, each user needs to follow the authentication steps to connect to Supabase.

---

## Troubleshooting

### Common Issues

#### "Missing Supabase environment variables"

- Both `VITE_SUPABASE_DATABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set
- Check `.env` file exists and is loaded
- Verify the variable names match exactly

#### "useSupabase must be used within a SupabaseProvider"

- Component is outside the provider hierarchy
- Check `main.tsx` provider order
- Ensure SupabaseProvider is inside ClerkProvider

#### RLS Policy Violations (403 errors)

- Verify `auth.uid()` matches Clerk user_id
- Check Clerk-Supabase integration is enabled in both dashboards
- Ensure JWT has `role: authenticated` claim
- Double-check policy syntax uses correct comparison

#### Stale Data After Mutations

- Check `invalidateQueries` is called in `onSuccess`
- Verify query key matches: `['supabase', 'profiles', ...]`

#### No Data Returned (Empty Arrays)

- Check RLS is enabled on the table
- Verify policies exist for SELECT operations
- Ensure user is authenticated (check `isSignedIn`)

### Debug Queries

Enable verbose logging:

```typescript
const supabase = createClient(url, key, {
  accessToken: getToken,
  db: { schema: 'public' },
  // Enable debug logging
});

// Or log individual queries
const { data, error, status, statusText } = await supabase.from('profiles').select();

console.log('Query result:', { data, error, status, statusText });
```

### Verify Token Claims

```typescript
const { session } = useSession();
const token = await session?.getToken();

if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token claims:', payload);
  // Should include: { sub: "user_xxx", role: "authenticated", ... }
}
```

### Check RLS Policies in Dashboard

1. Go to Supabase Dashboard → **Authentication > Policies**
2. Find your table
3. Verify policies exist for all operations (SELECT, INSERT, UPDATE, DELETE)
4. Check the `USING` and `WITH CHECK` clauses are correct

---

## Migration Notes

### Migrating from JWT Templates (Pre-April 2025)

If you previously used the JWT template approach:

**Old approach (deprecated):**

```typescript
// Required JWT template named 'supabase' in Clerk
const token = await session?.getToken({ template: 'supabase' });

// Manual fetch injection
const supabase = createClient(url, key, {
  global: {
    fetch: async (url, options = {}) => {
      const headers = new Headers(options?.headers);
      headers.set('Authorization', `Bearer ${token}`);
      return fetch(url, { ...options, headers });
    },
  },
});
```

**New approach (current):**

```typescript
// No template needed - direct token
const supabase = createClient(url, key, {
  accessToken: async () => (await session?.getToken()) ?? null,
});
```

### Benefits of the New Integration

1. No need to create or manage JWT templates
2. No shared secrets between Clerk and Supabase
3. Simpler client configuration
4. Automatic token refresh handling

---

## NPM Scripts Reference

```bash
npm run db:types    # Generate TypeScript types (requires SUPABASE_PROJECT_ID in .env)
npm run db:push     # Push migrations to database
npm run db:reset    # Reset database (destructive!)
npm run db:studio   # Open Supabase Studio GUI
```

---

## Additional Resources

- [Supabase + Clerk Third-Party Auth Guide](https://supabase.com/docs/guides/auth/third-party/clerk)
- [Clerk Supabase Integration Docs](https://clerk.com/docs/integrations/databases/supabase)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase React Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Supabase TypeScript Types](https://supabase.com/docs/guides/api/rest/generating-types)
- [Netlify Supabase Extension](https://docs.netlify.com/integrations/supabase/)
- [Example: Supabase + Next.js + Clerk Demo](https://github.com/clerk/clerk-supabase-nextjs)
