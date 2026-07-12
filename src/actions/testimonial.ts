'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitTestimonial(orderId: number, userEmail: string, quote: string, rating: number) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Check if order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.id }
    });

    if (!order) return { success: false, message: 'Order not found' };

    // Create testimonial
    await prisma.testimonial.create({
      data: {
        orderId,
        userId: user.id,
        quote,
        rating
      }
    });

    revalidatePath('/');
    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    console.error('Failed to submit testimonial:', error);
    return { success: false, message: 'Failed to submit' };
  }
}

export async function updateOrderStatus(orderId: number, status: 'DELIVERED') {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath('/orders');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
