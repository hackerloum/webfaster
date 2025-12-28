-- Migration: Add password column to User table
-- Run this in Supabase SQL Editor if you already created the tables without password field

-- Add password column to User table (nullable, for existing users)
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "password" TEXT;

-- Add comment to document the column
COMMENT ON COLUMN "User"."password" IS 'Hashed password for email/password authentication (nullable for OAuth users)';

-- Verify the column was added (optional - will show in Supabase Table Editor)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'User' AND column_name = 'password';
