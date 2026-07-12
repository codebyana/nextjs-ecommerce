'use server';

import { prisma } from '@/lib/prisma';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadPaymentProof(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { success: false, message: 'No file uploaded' };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    const filename = `proof-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    return { success: true, url: `/uploads/${filename}` };
  } catch (error: any) {
    console.error('Upload proof error:', error);
    return { success: false, message: `Upload failed: ${error.message || error}` };
  }
}

export async function createOrder(data: {
  userEmail: string;
  totalAmount: number;
  shippingAddress: string;
  city: string;
  paymentProof?: string;
  items: {
    productId: number;
    quantity: number;
    price: number;
    size: string;
  }[];
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.userEmail }
    });

    if (!user) {
      return { success: false, error: 'User not found in database' };
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: data.totalAmount,
        shippingAddress: data.shippingAddress,
        city: data.city,
        status: 'PENDING',
        paymentProof: data.paymentProof || null,
        orderItems: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size
          }))
        }
      }
    });

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Failed to create order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}
