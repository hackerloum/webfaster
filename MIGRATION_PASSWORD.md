# Add Password Column Migration

If you've already run the original `supabase-schema.sql` (without password field), use this migration to add the password column.

## Quick Steps:

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Copy and paste the SQL**
   - Open `add-password-column.sql` file
   - Copy all the SQL code
   - Paste it into Supabase SQL Editor

3. **Run the migration**
   - Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

4. **Verify it worked**
   - Go to **Table Editor** > **User** table
   - You should see the new `password` column
   - It will be empty (NULL) for existing users - that's normal!

---

## What This Does:

- ✅ Adds `password` column to existing `User` table
- ✅ Column is nullable (existing users won't break)
- ✅ Column accepts TEXT (for hashed passwords)

---

## After Migration:

Your User table will now have:
- `id`
- `email`
- `name`
- `password` ← **NEW COLUMN ADDED**
- `image`
- `emailVerified`
- `createdAt`
- `updatedAt`

Existing users will have `NULL` in the password field until they set a password.

---

## Note:

This migration is **safe** - it won't delete any data or break existing functionality.
