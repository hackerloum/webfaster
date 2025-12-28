import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma Client instance optimized for MySQL and serverless environments (Vercel)
 * 
 * MySQL Connection Tips:
 * - For PlanetScale: Use branch connection strings, enable connection pooling
 * - For Railway/other providers: Ensure connection pooling is enabled for serverless
 * - Connection string format: mysql://user:password@host:port/database
 * - MySQL 5.7.8+ required for JSON column support
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
