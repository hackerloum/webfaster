# Database Schema Explanation

## ✅ Complete Feature Coverage

Your database schema supports all the features you need:

### 1. ✅ User Sign Up
- **User table** stores all user information
- **Email** field (unique) - for login identifier
- **Password** field (hashed) - for secure authentication
- **Name** field - for user's display name
- **Image** field - for profile picture URL

### 2. ✅ User Login
- **Email** + **Password** authentication
- Password is stored hashed (using bcrypt or similar)
- Unique email constraint prevents duplicate accounts

### 3. ✅ Create Projects
- **Project table** stores all website projects
- **userId** links projects to users (foreign key)
- **data** field (JSONB) stores complete website structure
- **title** and **description** for project organization

### 4. ✅ Recall Profile Details
- Query **User table** by user ID or email
- Fields available:
  - `id` - User identifier
  - `email` - User's email
  - `name` - User's name
  - `image` - Profile picture URL
  - `emailVerified` - Email verification status
  - `createdAt` - Account creation date
  - `updatedAt` - Last profile update

### 5. ✅ Recall Project Details
- Query **Project table** by project ID or userId
- Fields available:
  - `id` - Project identifier
  - `title` - Project name
  - `description` - Project description
  - `data` - Complete website structure (JSON)
  - `createdAt` - Project creation date
  - `updatedAt` - Last project update
  - `userId` - Owner of the project

---

## Database Structure

```
User (1) ──────< (Many) Project
```

**Relationship:**
- One User can have many Projects
- Each Project belongs to one User
- When User is deleted, all their Projects are automatically deleted (CASCADE)

---

## Example Queries

### Get User Profile
```sql
SELECT id, email, name, image, "emailVerified", "createdAt"
FROM "User"
WHERE id = 'user-id-here';
```

### Get All User Projects
```sql
SELECT id, title, description, data, "createdAt", "updatedAt"
FROM "Project"
WHERE "userId" = 'user-id-here'
ORDER BY "createdAt" DESC;
```

### Get Single Project
```sql
SELECT id, title, description, data, "createdAt", "updatedAt"
FROM "Project"
WHERE id = 'project-id-here';
```

### Get User with Projects (Join)
```sql
SELECT 
    u.id, u.email, u.name, u.image,
    p.id as project_id, p.title, p."createdAt"
FROM "User" u
LEFT JOIN "Project" p ON p."userId" = u.id
WHERE u.id = 'user-id-here';
```

---

## Security Notes

1. **Password Storage**: Always hash passwords before storing (use bcrypt or argon2)
2. **Email Verification**: Use `emailVerified` field to track verification status
3. **Cascade Delete**: Projects are automatically deleted when user is deleted
4. **Indexes**: Email is indexed for fast lookups, userId is indexed for project queries

---

## Schema Status: ✅ COMPLETE

Your current schema (`supabase-schema.sql` + updated `prisma/schema.prisma`) is **fully sufficient** for:
- ✅ User registration with email/password
- ✅ User login/authentication
- ✅ Creating and saving projects
- ✅ Retrieving user profile information
- ✅ Retrieving user's projects
- ✅ Project CRUD operations

No additional tables needed for basic functionality!
