# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your OpenAI API key
   - Set up your PostgreSQL database URL
   - Generate a NextAuth secret (you can use: `openssl rand -base64 32`)

3. **Set Up Database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Environment Variables Required

- `OPENAI_API_KEY` - Your OpenAI API key (required for AI generation)
- `DATABASE_URL` - PostgreSQL connection string (required for saving projects)
- `NEXTAUTH_URL` - Your application URL (default: http://localhost:3000)
- `NEXTAUTH_SECRET` - Secret for NextAuth.js sessions

## First Run

1. Start the development server
2. Navigate to http://localhost:3000
3. Enter a prompt like: "Create a modern landing page for a SaaS product"
4. Click "Generate Website"
5. Once generated, you'll be redirected to the editor

## Troubleshooting

### OpenAI API Errors
- Make sure your API key is valid and has credits
- Check that the key is set in `.env.local` (not `.env`)
- Restart the dev server after adding environment variables

### Database Errors
- Ensure PostgreSQL is running
- Verify your `DATABASE_URL` is correct
- Run `npm run db:push` to sync the schema

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Production Deployment

1. Set all environment variables in your hosting platform
2. Run database migrations
3. Build the application: `npm run build`
4. Start the production server: `npm start`

For Vercel deployment:
- Push to GitHub
- Import in Vercel
- Add environment variables
- Deploy automatically
