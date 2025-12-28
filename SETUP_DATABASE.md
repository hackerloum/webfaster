# Database Setup Guide

## Option 1: Using Prisma (Recommended)

This is the easiest and recommended way to set up your database.

### Steps:

1. **Get your Supabase connection string**
   - Go to Supabase Dashboard > Settings > Database
   - Copy the **Connection String** (use "URI" format)
   - Use the direct connection (port 5432) for migrations

2. **Create `.env.local` file** in the root of your project:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

3. **Run Prisma commands**:
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to Supabase database
   npm run db:push
   ```

That's it! Your database tables will be created automatically.

---

## Option 2: Run SQL Directly in Supabase

If you prefer to run SQL directly, follow these steps:

### Steps:

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**

2. **Copy and paste the SQL**
   - Open `supabase-schema.sql` file
   - Copy all the SQL code
   - Paste it into the Supabase SQL Editor
   - Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

3. **Verify tables were created**
   - Go to **Table Editor** in Supabase
   - You should see `User` and `Project` tables

4. **Generate Prisma Client** (still needed for your app):
   ```bash
   npm run db:generate
   ```

---

## Database Schema Overview

Your database has 2 tables:

### `User` Table
- `id` (Text, Primary Key) - Unique user identifier
- `email` (Text, Unique) - User's email address
- `name` (Text, Optional) - User's name
- `image` (Text, Optional) - User's profile image URL
- `emailVerified` (Timestamp, Optional) - Email verification date
- `createdAt` (Timestamp) - Account creation date
- `updatedAt` (Timestamp) - Last update date

### `Project` Table
- `id` (Text, Primary Key) - Unique project identifier
- `userId` (Text, Foreign Key) - Links to User.id
- `title` (Text) - Project title
- `description` (Text, Optional) - Project description
- `data` (JSONB) - Stores the website structure as JSON
- `createdAt` (Timestamp) - Project creation date
- `updatedAt` (Timestamp) - Last update date

### Relationships
- One User can have many Projects (One-to-Many)
- When a User is deleted, all their Projects are automatically deleted (CASCADE)

---

## Verify Setup

### Check in Supabase:
1. Go to **Table Editor**
2. You should see both `User` and `Project` tables
3. Click on each table to see the columns

### Check with Prisma Studio:
```bash
npm run db:studio
```
This opens a visual database browser at `http://localhost:5555`

---

## Troubleshooting

### If Prisma db:push fails:
- Make sure your `DATABASE_URL` is correct
- Use the direct connection (port 5432) for migrations, not the pooled one
- Check that your Supabase project is active (free tier can pause)

### If SQL script fails:
- Make sure you're running it in the SQL Editor (not Table Editor)
- Check for any syntax errors
- If tables already exist, you can drop them first:
  ```sql
  DROP TABLE IF EXISTS "Project";
  DROP TABLE IF EXISTS "User";
  ```
  Then run the schema script again.

---

## Next Steps

After setting up the database:
1. Set up authentication (NextAuth.js)
2. Configure your API routes to use the database
3. Test creating a user and project
