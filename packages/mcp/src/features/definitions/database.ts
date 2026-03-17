import type { Feature } from '../types.js';

export const database: Feature = {
  name: 'Database',
  description: 'Supabase database integration with Clerk authentication, TanStack Query hooks, and Row Level Security',
  required: false,
  requires: [],
  dependencies: ['@supabase/supabase-js'],
  devDependencies: ['supabase', 'dotenv-cli'],
  files: [
    // Client and types
    'src/lib/supabase/client.ts',
    'src/lib/supabase/index.ts',
    'src/types/supabase.ts',
    'src/types/database.ts',
    // Context
    'src/contexts/supabaseContext.tsx',
    // Hooks
    'src/hooks/supabase/useSupabaseQuery.ts',
    'src/hooks/supabase/useProfiles.ts',
    'src/hooks/supabase/index.ts',
    // Components
    'src/components/shared/ProfileSync/ProfileSync.tsx',
    'src/components/shared/ProfileSync/index.ts',
    'src/components/shared/SyncToggle/SyncToggle.tsx',
    'src/components/shared/SyncToggle/index.ts',
    // Pages - Profile demo page
    'src/pages/Profile.tsx',
    // MSW handlers and fixtures
    'src/mocks/handlers/supabase.ts',
    'src/mocks/fixtures/profiles.ts',
    // Migrations
    'supabase/migrations/20260104000000_create_profiles_table.sql',
  ],
  testFiles: [
    'src/test/supabaseMock.ts',
    'src/contexts/supabaseContext.test.tsx',
    'src/components/shared/ProfileSync/ProfileSync.test.tsx',
    'src/components/shared/SyncToggle/SyncToggle.test.tsx',
    'src/pages/Profile.test.tsx',
    'e2e/tests/profile.spec.ts',
  ],
  scripts: {
    'db:types': 'dotenv -- supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase.ts',
    'db:push': 'supabase db push',
    'db:reset': 'supabase db reset',
    'db:studio': 'supabase studio',
  },
};
