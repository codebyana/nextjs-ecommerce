import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // 1. AUTO-COMPLETE SYSTEM (Like Shopee)
    // Check if there are any SHIPPED orders older than 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    await prisma.order.updateMany({
      where: {
        user: { email: email },
        status: 'SHIPPED',
        updatedAt: { lte: threeDaysAgo }
      },
      data: { status: 'DELIVERED' }
    });

    // 2. Fetch the updated orders
    const orders = await prisma.order.findMany({
      where: {
        user: {
          email: email
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        testimonial: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
