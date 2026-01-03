/**
 * Supabase database types.
 *
 * This file can be auto-generated using the Supabase CLI:
 * ```bash
 * npm run db:types
 * ```
 *
 * For now, we define the types manually for the profiles table.
 * After connecting to a real Supabase project, regenerate this file.
 *
 * @see https://supabase.com/docs/guides/api/rest/generating-types
 */

/**
 * Database schema type definition.
 * This is the root type used by the Supabase client for type safety.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          /** Clerk user_id (from auth.uid()) */
          id: string;
          /** User's email address */
          email: string;
          /** User's full name (optional) */
          full_name: string | null;
          /** URL to user's avatar image (optional) */
          avatar_url: string | null;
          /** Timestamp when profile was created */
          created_at: string;
          /** Timestamp when profile was last updated */
          updated_at: string;
        };
        Insert: {
          /** Clerk user_id (required) */
          id: string;
          /** User's email address (required) */
          email: string;
          /** User's full name (optional) */
          full_name?: string | null;
          /** URL to user's avatar image (optional) */
          avatar_url?: string | null;
          /** Timestamp when profile was created (defaults to NOW()) */
          created_at?: string;
          /** Timestamp when profile was last updated (defaults to NOW()) */
          updated_at?: string;
        };
        Update: {
          /** Clerk user_id */
          id?: string;
          /** User's email address */
          email?: string;
          /** User's full name */
          full_name?: string | null;
          /** URL to user's avatar image */
          avatar_url?: string | null;
          /** Timestamp when profile was last updated */
          updated_at?: string;
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

/**
 * User profile linked to Clerk user_id.
 * The `id` field matches `auth.uid()` from Clerk's JWT sub claim.
 */
export type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Data required to insert a new profile.
 */
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

/**
 * Data for updating an existing profile.
 * All fields are optional.
 */
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Helper type to extract a table's Row type from the Database.
 */
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

/**
 * Helper type to extract a table's Insert type from the Database.
 */
export type TableInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

/**
 * Helper type to extract a table's Update type from the Database.
 */
export type TableUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
