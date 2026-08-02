import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// Forcefully clear the cached instance to pick up the new Testimonial schema
if (process.env.NODE_ENV !== 'production' && globalForPrisma.prisma) {
  console.log("Reloading Prisma client instance...");
  globalForPrisma.prisma = undefined;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "mysql://mbstarex_ecom1:kSAkjasnfasd!10@127.0.0.1:3306/mbstarex_ecom",
      },
    },
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
