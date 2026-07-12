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
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
