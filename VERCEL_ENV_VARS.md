# Vercel Environment Variables Guide

## Required Environment Variables

Add these to your Vercel project at **Settings > Environment Variables**:

### ✅ Already Added:
- `DATABASE_URL` - ✅ You already have this!

### ❌ Still Need to Add:

1. **`OPENAI_API_KEY`** (Required)
   - Get from: https://platform.openai.com/api-keys
   - Format: `sk-...`
   - Used for: AI website generation

2. **`NEXTAUTH_URL`** (Required if using authentication)
   - Value: Your Vercel production URL
   - Example: `https://your-app-name.vercel.app`
   - You can find this after your first deployment
   - Used for: NextAuth.js authentication callbacks

3. **`NEXTAUTH_SECRET`** (Required if using authentication)
   - Generate a random secret
   - **How to generate:**
     - Mac/Linux: `openssl rand -base64 32`
     - Windows PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))`
     - Or use online: https://generate-secret.vercel.app/32
   - Used for: Encrypting NextAuth sessions

---

## ❌ NOT Needed:

You **DO NOT** need:
- ❌ `SUPABASE_URL` - Not using Supabase client
- ❌ `SUPABASE_ANON_KEY` - Not using Supabase client  
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Not using Supabase client

**Why?** You're using **Prisma** to connect to Supabase (PostgreSQL), not the Supabase JavaScript client. You only need the `DATABASE_URL` connection string.

---

## Quick Setup Steps:

1. **Add OpenAI API Key:**
   ```
   Name: OPENAI_API_KEY
   Value: sk-your-actual-key-here
   ```

2. **Deploy once to get your URL, then add:**
   ```
   Name: NEXTAUTH_URL
   Value: https://your-app.vercel.app
   ```

3. **Generate and add NextAuth secret:**
   ```
   Name: NEXTAUTH_SECRET
   Value: [generated-secret-from-command-above]
   ```

4. **Redeploy** after adding all variables (or they'll be added on next deployment)

---

## Environment Variable Checklist:

- [x] `DATABASE_URL` - ✅ Already added!
- [ ] `OPENAI_API_KEY` - ⚠️ Add this
- [ ] `NEXTAUTH_URL` - ⚠️ Add after first deploy
- [ ] `NEXTAUTH_SECRET` - ⚠️ Generate and add

---

## Tips:

- Make sure to add variables to **Production**, **Preview**, and **Development** environments (or select all)
- After adding variables, trigger a new deployment
- You can verify variables are loaded by checking the build logs
