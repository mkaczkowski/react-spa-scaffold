import type { Feature } from '../types.js';

export const database: Feature = {
  name: 'Database',
  description: 'Supabase database integration with Clerk authentication, TanStack Query hooks, and Row Level Security',
  required: false,
  requires: ['auth', 'state'], // Requires Clerk auth and TanStack Query (from state)
  dependencies: ['@supabase/supabase-js'],
  devDependencies: ['supabase'],
  files: [
    // Client and types
    'src/lib/supabase/client.ts',
    'src/lib/supabase/index.ts',
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
    // MSW handlers and fixtures
    'src/mocks/handlers/supabase.ts',
    'src/mocks/fixtures/profiles.ts',
  ],
  testFiles: [
    'src/test/supabaseMock.ts',
    'src/test/supabaseMock.test.ts',
    'src/contexts/supabaseContext.test.tsx',
    'src/mocks/fixtures/profiles.test.ts',
    'src/components/shared/ProfileSync/ProfileSync.test.tsx',
  ],
  scripts: {
    'db:types': 'supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/database.ts',
    'db:push': 'supabase db push',
    'db:reset': 'supabase db reset',
    'db:studio': 'supabase studio',
  },
};
