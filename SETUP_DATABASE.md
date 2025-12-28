# MySQL Database Setup Guide

## Option 1: Using Prisma (Recommended)

This is the easiest and recommended way to set up your database.

### Steps:

1. **Choose a MySQL provider** (examples below):
   - **PlanetScale** (Recommended for serverless/Vercel) - Free tier available
   - **Railway** - Easy setup, free tier
   - **AWS RDS** - Enterprise-grade
   - **DigitalOcean** - Managed MySQL
   - **Local MySQL** - For development

2. **Get your MySQL connection string**
   - Format: `mysql://user:password@host:port/database`
   - Example (PlanetScale): `mysql://root:password@aws.connect.psdb.cloud/database?sslaccept=strict`
   - Example (Local): `mysql://root:password@localhost:3306/ai_website_builder`

3. **Create `.env.local` file** in the root of your project:
   ```env
   DATABASE_URL="mysql://user:password@host:port/database"
   ```

4. **Run Prisma commands**:
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to MySQL database
   npm run db:push
   ```

That's it! Your database tables will be created automatically.

---

## Option 2: Run SQL Directly

If you prefer to run SQL directly, follow these steps:

### Steps:

1. **Connect to your MySQL database**
   - Using MySQL CLI: `mysql -u root -p`
   - Using phpMyAdmin, MySQL Workbench, or your database GUI
   - Using PlanetScale CLI: `pscale connect database-name`

2. **Select your database**
   ```sql
   CREATE DATABASE IF NOT EXISTS ai_website_builder;
   USE ai_website_builder;
   ```

3. **Copy and paste the SQL**
   - Open `mysql-schema.sql` file
   - Copy all the SQL code
   - Paste and execute it

4. **Verify tables were created**
   ```sql
   SHOW TABLES;
   DESCRIBE User;
   DESCRIBE Project;
   ```

5. **Generate Prisma Client** (still needed for your app):
   ```bash
   npm run db:generate
   ```

---

## MySQL Provider Setup Guides

### PlanetScale (Recommended for Vercel)

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get connection string from Database > Connect
4. Use the connection string as `DATABASE_URL`
5. **Important:** Add `relationMode = "prisma"` to `prisma/schema.prisma` datasource (for PlanetScale branch-based workflow)

### Railway

1. Sign up at [railway.app](https://railway.app)
2. Create new project > Add MySQL service
3. Copy connection string from Variables tab
4. Use as `DATABASE_URL`

### Local MySQL

1. Install MySQL (via XAMPP, Homebrew, or MySQL installer)
2. Create database: `CREATE DATABASE ai_website_builder;`
3. Use connection string: `mysql://root:password@localhost:3306/ai_website_builder`

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
- `id` (Varchar, Primary Key) - Unique project identifier
- `userId` (Varchar, Foreign Key) - Links to User.id
- `title` (Varchar) - Project title
- `description` (Varchar, Optional) - Project description
- `data` (JSON) - Stores the website structure as JSON
- `createdAt` (DateTime) - Project creation date
- `updatedAt` (DateTime) - Last update date

### Relationships
- One User can have many Projects (One-to-Many)
- When a User is deleted, all their Projects are automatically deleted (CASCADE)

---

## Verify Setup

### Check in your MySQL database:
1. Run `SHOW TABLES;` - You should see `User` and `Project`
2. Run `DESCRIBE User;` and `DESCRIBE Project;` to see columns
3. Or use your database GUI (phpMyAdmin, MySQL Workbench, etc.)

### Check with Prisma Studio:
```bash
npm run db:studio
```
This opens a visual database browser at `http://localhost:5555`

---

## Troubleshooting

### If Prisma db:push fails:
- Make sure your `DATABASE_URL` is correct
- Check that MySQL server is running (if local)
- Verify user has CREATE TABLE permissions
- For PlanetScale: Make sure you're using the correct branch connection string

### If SQL script fails:
- Make sure you selected the correct database: `USE database_name;`
- Check MySQL version (requires MySQL 5.7+ for JSON support)
- If tables already exist, you can drop them first:
  ```sql
  DROP TABLE IF EXISTS `Project`;
  DROP TABLE IF EXISTS `User`;
  ```
  Then run the schema script again.

### Common MySQL Issues:
- **JSON support**: Requires MySQL 5.7.8+ or MariaDB 10.2.7+
- **Character set**: Tables use `utf8mb4` for full Unicode support (emojis, etc.)
- **Foreign keys**: Make sure you're using InnoDB engine (default in most setups)

---

## Next Steps

After setting up the database:
1. Set up authentication (NextAuth.js)
2. Configure your API routes to use the database
3. Test creating a user and project
