-- Add sync_enabled column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sync_enabled boolean NOT NULL DEFAULT false;
