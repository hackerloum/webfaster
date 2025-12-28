# AI Website Builder

A production-ready, enterprise-level AI-powered website builder built with Next.js 14, TypeScript, and OpenAI GPT-4. Generate complete websites from text descriptions, edit them with AI or manually, and export your projects.

## Features

- 🤖 **AI-Powered Generation**: Describe your website in natural language and watch it come to life
- ✏️ **Dual Editing Modes**: 
  - Manual Editor: Direct control over content, styles, and code
  - AI Editor: Click any section and describe changes in natural language
- 👁️ **Real-Time Preview**: See your website as you build with responsive viewport controls
- 💾 **Project Management**: Save, manage, and export your projects
- 🎨 **Professional UI**: Hand-crafted, modern interface that doesn't look AI-generated
- 🔒 **Type-Safe**: Built with TypeScript strict mode for maximum reliability

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **UI Components**: Radix UI primitives
- **Code Editor**: Monaco Editor
- **AI Integration**: OpenAI GPT-4 API
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Deployment**: Vercel
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Validation**: Zod
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works) or PostgreSQL database
- OpenAI API key

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd ai-website-builder
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

#### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > Database** to get your connection string
3. Use the connection pooler URL for production (recommended for Vercel):
   - Pooled connection (port 6543): `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - Direct connection (port 5432): `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

```env
# Database - Supabase
# Use pooled connection for production (Vercel/serverless)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"

# Optional: Direct connection for migrations (if using pooler above)
# DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-using-openssl-rand-base64-32"

# Optional: Environment
NODE_ENV="development"
```

**Note:** For local development, you can use either the direct or pooled connection. For production on Vercel, use the pooled connection (port 6543) to avoid connection limit issues.

4. **Set up the database**

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to Supabase database
npm run db:push
```

**Supabase Tips:**
- If you're using the connection pooler, you may need to temporarily use the direct connection URL for migrations
- After running `db:push`, verify your tables in Supabase Dashboard > Table Editor
- For production migrations, consider using Prisma Migrate: `npx prisma migrate dev`

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── editor/            # Editor page
│   └── page.tsx           # Home/generator page
├── components/
│   ├── ui/                # Base UI components
│   ├── generator/         # Generation components
│   ├── preview/           # Preview components
│   ├── editor/            # Editor components
│   └── layout/            # Layout components
├── lib/
│   ├── services/          # Business logic services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   └── db/                # Database configuration
└── store/                 # Zustand state stores
```

## Usage

### Generating a Website

1. Navigate to the home page
2. Enter a description of the website you want to create
3. Click "Generate Website"
4. Wait for the AI to create your website structure
5. You'll be automatically redirected to the editor

### Editing a Website

#### Manual Editing
1. Click on any section in the preview
2. Use the "Manual Edit" tab to modify content and styles
3. Click "Save Changes" to apply

#### AI Editing
1. Click on any section in the preview
2. Use the "AI Edit" tab
3. Describe the changes you want in natural language
4. Click "Apply AI Changes"

### Exporting

1. Click the "Export" button in the toolbar
2. Your website will be downloaded as a ZIP file containing:
   - `index.html` - Complete HTML file
   - `README.md` - Project documentation
   - `assets/` - Asset files (if any)

## API Routes

### POST `/api/ai/generate`
Generate a website from a prompt.

**Request Body:**
```json
{
  "prompt": "Create a modern landing page for a SaaS product",
  "options": {
    "stylePreference": "modern",
    "colorScheme": "blue and white"
  }
}
```

### POST `/api/ai/modify`
Modify a section using AI.

**Request Body:**
```json
{
  "section": { /* Section object */ },
  "instruction": "Make the heading larger and change background to gradient"
}
```

### GET `/api/projects`
Get all projects for the current user.

### GET `/api/projects/[id]`
Get a specific project.

### PUT `/api/projects/[id]`
Update a project.

### DELETE `/api/projects/[id]`
Delete a project.

## Development

### Code Style

This project uses:
- ESLint for linting
- Prettier for code formatting
- TypeScript strict mode

### Database Management

```bash
# Generate Prisma Client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Deployment

### Vercel + Supabase Deployment

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import the repository in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables in Vercel**
   Go to Project Settings > Environment Variables and add:
   - `DATABASE_URL`: Your Supabase pooled connection string (port 6543)
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXTAUTH_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`: Generate using `openssl rand -base64 32`

4. **Deploy**
   - Vercel will automatically detect Next.js and run the build
   - The build process includes `npm run db:generate` (configured in `vercel.json`)
   - After deployment, run migrations if needed:
     ```bash
     npx prisma migrate deploy
     ```

5. **Set up Supabase Database**
   - After first deployment, make sure your database schema is pushed:
     ```bash
     # Run this locally or in Vercel CLI
     npx prisma db push
     ```
   - Or create a migration and apply it:
     ```bash
     npx prisma migrate dev --name init
     npx prisma migrate deploy
     ```

**Important:** Use the **pooled connection string** (port 6543) for `DATABASE_URL` in Vercel to avoid connection limit issues in serverless environments.

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- AWS Amplify
- Netlify
- Railway
- DigitalOcean App Platform

Make sure to:
1. Set all required environment variables
2. Run database migrations
3. Build the application: `npm run build`

## Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection string (use pooled connection for Vercel) | Yes | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres` |
| `DIRECT_URL` | Optional: Direct connection for migrations | No | `postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres` |
| `OPENAI_API_KEY` | OpenAI API key | Yes | `sk-...` |
| `NEXTAUTH_URL` | Application URL (use production URL in Vercel) | Yes | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js (generate with `openssl rand -base64 32`) | Yes | Random 32+ character string |
| `NODE_ENV` | Environment (development/production) | No | `production` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
