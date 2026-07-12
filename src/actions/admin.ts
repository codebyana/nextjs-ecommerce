'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadProductImage(formData: FormData) {
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

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    return { success: true, url: `/uploads/${filename}` };
  } catch (error: any) {
    console.error('Upload error:', error);
    return { success: false, message: `Upload failed: ${error.message || error}` };
  }
}

// --- PRODUCT ACTIONS ---

export async function deleteProduct(id: number) {
  try {
    console.log('Attempting to delete product ID:', id);
    
    // 1. Delete associated order items to avoid constraint errors
    await prisma.orderItem.deleteMany({ 
      where: { productId: id } 
    });
    
    // 2. Delete the product
    await prisma.product.delete({ 
      where: { id } 
    });
    
    revalidatePath('/admin/products');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Delete product error details:', error.message);
    return { success: false, message: 'Gagal menghapus produk: ' + error.message };
  }
}

export async function addProduct(data: { title: string, description: string, price: number, category: string, images: string[], sizes: string[], stock: number }) {
  try {
    await prisma.product.create({
      data: {
        ...data,
        images: JSON.stringify(data.images),
        sizes: JSON.stringify(data.sizes),
      }
    });
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Add product error:', error);
    return { success: false, message: 'Failed to add product.' };
  }
}

export async function updateProduct(id: number, data: { title: string, description: string, price: number, category: string, images: string[], sizes: string[], stock: number }) {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...data,
        images: JSON.stringify(data.images),
        sizes: JSON.stringify(data.sizes),
      }
    });
    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath(`/shop/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Update product error:', error);
    return { success: false, message: 'Failed to update product.' };
  }
}

// --- ORDER ACTIONS ---

export async function updateOrderStatus(id: number, status: 'PAID' | 'SHIPPED' | 'CANCELLED') {
  try {
    await prisma.order.update({
      where: { id },
      data: { status }
    });
    revalidatePath('/admin/orders');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Update order error:', error);
    return { success: false, message: 'Failed to update order status.' };
  }
}

// --- USER ACTIONS ---

export async function deleteUser(id: number) {
  try {
    // Check if user has orders
    const orders = await prisma.order.findMany({ where: { userId: id } });
    if (orders.length > 0) {
      return { success: false, message: 'Cannot delete user with existing orders.' };
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false, message: 'Failed to delete user.' };
  }
}

export async function createAdmin(data: { firstName: string, lastName: string, email: string, password: string }) {
  try {
    // Basic password hashing simulation or use bcrypt later
    await prisma.user.create({
      data: {
        ...data,
        role: 'ADMIN'
      }
    });
    revalidatePath('/admin/admins');
    return { success: true };
  } catch (error) {
    console.error('Create admin error:', error);
    return { success: false, message: 'Failed to create admin account.' };
  }
}

export async function deleteAdmin(id: number) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/admins');
    return { success: true };
  } catch (error) {
    console.error('Delete admin error:', error);
    return { success: false, message: 'Failed to delete admin.' };
  }
}

// --- PAYMENT ACTIONS ---

export async function addPaymentMethod(formData: FormData) {
  try {
    const bankName = formData.get('bankName') as string;
    const accountName = formData.get('accountName') as string;
    const accountNumber = formData.get('accountNumber') as string;

    if (!bankName || !accountName || !accountNumber) {
      return { success: false, message: 'All fields are required.' };
    }

    await prisma.bankDetail.create({
      data: {
        bankName,
        accountName,
        accountNumber,
        isActive: true
      }
    });

    revalidatePath('/admin/payments');
    return { success: true };
  } catch (error) {
    console.error('Add payment error:', error);
    return { success: false, message: 'Failed to add payment method.' };
  }
}

export async function updatePaymentMethod(id: number, data: { bankName: string, accountName: string, accountNumber: string, isActive: boolean }) {
  try {
    await prisma.bankDetail.update({
      where: { id },
      data
    });
    revalidatePath('/admin/payments');
    return { success: true };
  } catch (error) {
    console.error('Update payment error:', error);
    return { success: false, message: 'Failed to update payment method.' };
  }
}

export async function deletePaymentMethod(id: number) {
  try {
    await prisma.bankDetail.delete({ where: { id } });
    revalidatePath('/admin/payments');
    return { success: true };
  } catch (error) {
    console.error('Delete payment error:', error);
    return { success: false, message: 'Failed to delete payment method.' };
  }
}

// --- CATEGORY ACTIONS ---

export async function addCategory(name: string) {
  try {
    if (!name || name.trim().length === 0) return { success: false, message: 'Nama kategori tidak boleh kosong.' };
    await prisma.category.create({ data: { name: name.trim() } });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    console.error('Add category error:', error.message || error);
    if (error.code === 'P2002') {
      return { success: false, message: 'Kategori dengan nama ini sudah ada.' };
    }
    return { success: false, message: error.message || 'Failed to add category.' };
  }
}

export async function updateCategory(id: number, name: string) {
  try {
    if (!name || name.trim().length === 0) return { success: false, message: 'Nama kategori tidak boleh kosong.' };
    await prisma.category.update({ where: { id }, data: { name: name.trim() } });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    console.error('Update category error:', error.message || error);
    if (error.code === 'P2002') {
      return { success: false, message: 'Kategori dengan nama ini sudah ada.' };
    }
    return { success: false, message: error.message || 'Failed to update category.' };
  }
}

export async function deleteCategory(id: number) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    console.error('Delete category error:', error.message || error);
    return { success: false, message: error.message || 'Failed to delete category.' };
  }
}
