# Supabase Setup Guide

This guide will help you set up Supabase as your database for this project.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Fill in your project details:
   - **Name**: Choose a project name
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Wait for the project to be provisioned (takes 1-2 minutes)

## Step 2: Get Your Connection Strings

1. In your Supabase project dashboard, go to **Settings > Database**
2. Scroll down to **Connection String** section
3. You'll see two connection strings:

### Connection Pooler (Recommended for Production/Vercel)

Use this for your `DATABASE_URL` in production:
- **Port 6543** (Transaction mode) - Recommended for serverless
- **Port 5432** (Session mode) - Alternative for serverless

Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

### Direct Connection (For Migrations & Prisma Studio)

Use this for local development and migrations:
- **Port 5432** - Direct database connection

Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Step 3: Configure Environment Variables

### Local Development (.env.local)

```env
# Use pooled connection for better performance
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# Or use direct connection for local development
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Vercel Production

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add `DATABASE_URL` with the **pooled connection string** (port 6543)

**Important:** Always use the pooled connection (port 6543) in Vercel to avoid connection limit issues in serverless environments.

## Step 4: Run Database Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to Supabase
npm run db:push

# Or use migrations (recommended for production)
npx prisma migrate dev --name init
```

## Step 5: Verify Setup

1. Open Prisma Studio to view your database:
   ```bash
   npm run db:studio
   ```

2. Or check in Supabase Dashboard:
   - Go to **Table Editor** in your Supabase project
   - You should see the `User` and `Project` tables

## Troubleshooting

### Connection Issues

- **Error: Too many connections**
  - Solution: Use the pooled connection string (port 6543) instead of direct connection

- **Error: Connection timeout**
  - Solution: Check your Supabase project is active (free tier pauses after inactivity)
  - Verify your connection string is correct
  - Check your IP is not blocked in Supabase Settings > Database > Connection Pooling

### Migration Issues

If migrations fail with pooled connection:
1. Temporarily use direct connection URL for migrations
2. Or add `DIRECT_URL` to your `.env.local`:
   ```env
   DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```
3. Update `prisma/schema.prisma` to include:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

### Free Tier Limitations

Supabase free tier includes:
- 500 MB database storage
- 2 GB bandwidth
- Connection pooling included
- Automatic backups (daily)

For production apps, consider upgrading to Pro plan for:
- More storage and bandwidth
- Point-in-time recovery
- Daily backups with 7-day retention

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-supabase)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
