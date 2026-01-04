---
'react-spa-scaffold': minor
---

Add Supabase database integration with Clerk authentication

- Supabase client with automatic Clerk JWT token injection
- SupabaseProvider context for authenticated database access
- useSupabaseQuery hook for TanStack Query integration
- Profile management hooks (useProfile, useUpsertProfile, useUpdateProfile, useDeleteProfile)
- ProfileSync component for automatic Clerk-to-Supabase user synchronization
- MSW handlers and test utilities for Supabase mocking
- Database types and comprehensive documentation
