'use server';

import { prisma } from '@/lib/prisma';

export async function getOrderById(orderId: number, email: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        user: {
          email: email
        }
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan atau Anda tidak memiliki akses.' };
    }

    return { success: true, order };
  } catch (error) {
    console.error('Failed to get order by ID:', error);
    return { success: false, error: 'Gagal mengambil data pesanan.' };
  }
}
