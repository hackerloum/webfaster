# Environment Variables Setup Guide

## Required for Local Development

Create a `.env.local` file in the root of your project with the following variables:

```env
# Database Connection (Supabase PostgreSQL)
# Get this from: Supabase Dashboard > Settings > Database > Connection String
# Use the connection pooler URL (port 6543) for serverless environments
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"

# JWT Secret for Authentication
# Generate a secure random string (64 characters recommended)
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# OpenAI API Key (for AI website generation)
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

## Quick Setup Steps:

### 1. Get DATABASE_URL from Supabase:
   - Go to Supabase Dashboard
   - Settings > Database
   - Copy the **Connection String** (URI format)
   - Use the **Connection Pooler** URL (port 6543) for better performance

### 2. Generate JWT_SECRET:
   Run this command in your terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and use it as your JWT_SECRET

### 3. Get OPENAI_API_KEY:
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key (starts with `sk-`)

## For Vercel Deployment:

Add these same environment variables in:
- Vercel Dashboard > Your Project > Settings > Environment Variables

Make sure to add them for:
- ✅ Production
- ✅ Preview  
- ✅ Development

## Troubleshooting:

If you see "Failed to create account" error:
1. Check that `.env.local` exists in the project root
2. Verify all three variables are set correctly
3. Make sure DATABASE_URL uses the connection pooler (port 6543)
4. Restart your dev server after creating/updating `.env.local`
