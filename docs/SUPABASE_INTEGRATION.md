# Supabase Integration

Clerk-Supabase integration architecture, RLS patterns, and database operations.
For quick-start usage and hooks, see [CLAUDE.md](../CLAUDE.md#database-supabase).

---

## Architecture

```
ClerkProvider
    │
    ▼
useSession().getToken() ──► Clerk JWT (role: authenticated)
    │
    ▼
SupabaseProvider
    │
    ▼
createClient({ accessToken: getToken }) ──► Supabase API
    │
    ▼
PostgreSQL + Row Level Security (RLS)
    └── auth.uid() = Clerk user_id (JWT sub claim)
```

**Key Design Decisions:**

- **No Supabase Auth** - Clerk handles authentication; Supabase validates JWTs via third-party provider
- **Modern `accessToken` pattern** - No JWT templates needed (post April 2025)
- **Automatic `role` claim** - Clerk integration adds `"role": "authenticated"` to JWTs, enabling RLS `TO authenticated` policies
- **Session-based client** - Client recreates only on `session?.id` change, not every render
- **TanStack Query integration** - All data fetching uses React Query for caching/invalidation
- **RLS enforcement** - Security at database level via `auth.uid()` = Clerk `user_id`

---

## Setup

### 1. Enable Clerk as Third-Party Auth Provider

1. **Clerk Dashboard** → Integrations → Supabase → Activate
2. Copy your **Clerk domain** (e.g., `your-app.clerk.accounts.dev`)
3. **Supabase Dashboard** → Authentication → Sign In/Up → Add provider → Clerk
4. Paste your Clerk domain

### 2. Environment Variables

| Variable                     | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `VITE_SUPABASE_DATABASE_URL` | `https://your-project.supabase.co`          |
| `VITE_SUPABASE_ANON_KEY`     | Client-side API key (respects RLS)          |
| `SUPABASE_PROJECT_ID`        | For `npm run db:types` (subdomain from URL) |

Both URL and key must be set together. Find them in Supabase Dashboard → Project Settings → Data API.

### 3. Provider Hierarchy

```tsx
// main.tsx - SupabaseProvider MUST be inside ClerkProvider
<ClerkProvider>
  <SupabaseProvider>
    <App />
  </SupabaseProvider>
</ClerkProvider>
```

---

## File Structure

```
src/
├── lib/supabase/
│   └── client.ts           # createSupabaseClient(getToken)
├── contexts/
│   └── supabaseContext.tsx # SupabaseProvider + useSupabase hook
├── hooks/supabase/
│   ├── useSupabaseQuery.ts # Generic SELECT with TanStack Query
│   └── useProfiles.ts      # Profile CRUD hooks
├── types/
│   ├── supabase.ts         # Auto-generated (npm run db:types)
│   └── database.ts         # Convenience aliases (Profile, etc.)
└── components/shared/
    └── ProfileSync/        # Auto-sync Clerk user to Supabase
```

---

## Database & RLS

### Complete Table Example

```sql
-- Create table with user_id linked to Clerk
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,              -- Clerk user_id (auth.uid())
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies (all four CRUD operations)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (id = (auth.uid())::text);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = (auth.uid())::text);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = (auth.uid())::text)
  WITH CHECK (id = (auth.uid())::text);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE TO authenticated
  USING (id = (auth.uid())::text);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### RLS Policy Template

For tables where `user_id` is NOT the primary key:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub',  -- Auto-set from Clerk
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Apply this pattern for each operation (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Users can select own tasks"
  ON tasks FOR SELECT TO authenticated
  USING (user_id = (auth.uid())::text);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT TO authenticated
  WITH CHECK (user_id = (auth.uid())::text);

-- UPDATE needs both USING (existing rows) and WITH CHECK (new values)
-- DELETE only needs USING
```

### SQL Functions Reference

| Function              | Returns | Use Case                                       |
| --------------------- | ------- | ---------------------------------------------- |
| `auth.uid()`          | UUID    | Primary comparison (`::text` for TEXT columns) |
| `auth.jwt()`          | JSON    | Access full JWT claims                         |
| `auth.jwt()->>'sub'`  | TEXT    | User ID directly as text                       |
| `(select auth.uid())` | UUID    | Performance optimization in RLS                |

### MCP Tools for Database Operations

| Tool                                       | Purpose                              |
| ------------------------------------------ | ------------------------------------ |
| `mcp__supabase__apply_migration`           | Apply DDL (CREATE, ALTER, DROP)      |
| `mcp__supabase__execute_sql`               | Run queries (SELECT, INSERT, UPDATE) |
| `mcp__supabase__list_tables`               | List all tables in schemas           |
| `mcp__supabase__list_migrations`           | View applied migrations              |
| `mcp__supabase__get_advisors`              | Check security/performance issues    |
| `mcp__supabase__generate_typescript_types` | Generate types from schema           |

### Type Generation

After schema changes:

```bash
npm run db:types   # Regenerates src/types/supabase.ts
```

Add convenience aliases in `src/types/database.ts`:

```typescript
export type Profile = Tables<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;
```

---

## React Integration

### Hooks Reference

| Hook                        | Purpose                     | Returns                          |
| --------------------------- | --------------------------- | -------------------------------- |
| `useSupabase()`             | Direct client access        | `TypedSupabaseClient`            |
| `useSupabaseQuery(options)` | Generic SELECT with caching | `UseQueryResult<T[]>`            |
| `useProfile()`              | Current user's profile      | `{ profile, exists, isLoading }` |
| `useCurrentProfile()`       | Raw profile query           | `UseQueryResult<Profile[]>`      |
| `useUpsertProfile()`        | Create/update profile       | `UseMutationResult`              |
| `useUpdateProfile()`        | Update current profile      | `UseMutationResult`              |
| `useDeleteProfile()`        | Delete current profile      | `UseMutationResult`              |

**`useSupabaseQuery` options:** `{ table, queryKey, select?, filter?, queryOptions? }`

**Query key pattern:** All queries use `['supabase', table, ...queryKey]` for cache invalidation.

For usage examples, see [CLAUDE.md](../CLAUDE.md#database-supabase).

### ProfileSync Component

Automatically syncs Clerk user data to Supabase on sign-in:

```tsx
import { ProfileSync } from '@/components/shared';

function App() {
  return (
    <>
      <ProfileSync /> {/* Optional: onSyncComplete, onSyncError callbacks */}
      <Routes>...</Routes>
    </>
  );
}
```

**Behavior:** Creates profile on first login, updates if email changed, runs once per mount.

---

## Testing

### Mock Utilities

Import from `@/test`:

| Utility                                   | Purpose                                  |
| ----------------------------------------- | ---------------------------------------- |
| `setMockSupabaseData(data[])`             | Set data to return                       |
| `setMockSupabaseError({ message, code })` | Simulate error                           |
| `resetSupabaseMocks()`                    | Reset to defaults (call in `beforeEach`) |
| `createProfile(overrides?)`               | Create mock profile                      |
| `mockProfiles`                            | Pre-built profile array                  |

For test examples, see [CLAUDE.md](../CLAUDE.md#database-supabase).

---

## Security

- **Always enable RLS** on every table
- **Use `anon` key** in client code (respects RLS)
- **Never expose `service_role` key** (bypasses RLS)
- **Cast `auth.uid()` to text** when comparing with TEXT columns: `(auth.uid())::text`
- **Use `(select auth.uid())`** in policies for performance (prevents re-evaluation per row)
- **Test with multiple accounts** to verify users can't access each other's data

---

## Deployment

For Netlify deployment with Supabase integration, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Troubleshooting

| Issue                                              | Cause                             | Fix                                                  |
| -------------------------------------------------- | --------------------------------- | ---------------------------------------------------- |
| "useSupabase must be used within SupabaseProvider" | Component outside provider        | Check `main.tsx` provider order                      |
| 403 RLS Policy Violation                           | JWT missing `role: authenticated` | Verify Clerk-Supabase integration enabled            |
| Empty arrays returned                              | RLS blocking access               | Check policies use `auth.uid()` correctly            |
| Stale data after mutations                         | Missing invalidation              | Ensure `invalidateQueries(['supabase', 'profiles'])` |
| Missing env vars error                             | Incomplete config                 | Both URL and key must be set                         |

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

- [AUTHENTICATION.md](./AUTHENTICATION.md) - Clerk authentication setup and configuration
- [Supabase + Clerk Integration Guide](https://supabase.com/docs/guides/auth/third-party/clerk)
- [Row Level Security Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk Supabase Docs](https://clerk.com/docs/integrations/databases/supabase)
- [Supabase MCP Server](https://supabase.com/docs/guides/getting-started/mcp)
