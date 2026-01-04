/**
 * Database type aliases and re-exports.
 *
 * This file provides a database-agnostic public API for type imports.
 * The underlying types are auto-generated in supabase.ts via `npm run db:types`.
 *
 * Usage:
 *   import type { Profile, ProfileInsert, ProfileUpdate } from '@/types/database';
 *
 * When adding new tables:
 *   1. Run `npm run db:types` to regenerate supabase.ts
 *   2. Add convenience aliases here for your new tables
 */

// Re-export everything from the auto-generated Supabase types
export * from './supabase';

// Re-import for creating aliases
import type { Database, Tables, TablesInsert, TablesUpdate } from './supabase';

// =============================================================================
// Generic Table Types
// =============================================================================

/**
 * Table names available in the database schema.
 */
export type TableName = keyof Database['public']['Tables'];

/**
 * Row type for a given table.
 */
export type TableRowType<T extends TableName> = Database['public']['Tables'][T]['Row'];

// =============================================================================
// Profile Types
// =============================================================================

/** Profile row type (read operations) */
export type Profile = Tables<'profiles'>;

/** Profile insert type (create operations) */
export type ProfileInsert = TablesInsert<'profiles'>;

/** Profile update type (update operations) */
export type ProfileUpdate = TablesUpdate<'profiles'>;
