'use server';

import { prisma } from '@/lib/prisma';

export async function incrementProductInterest(productId: number) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        interestCount: {
          increment: 1,
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to increment product interest:', error);
    return { success: false };
  }
}
