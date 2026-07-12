/**
 * Testimonial Seeder
 * 
 * Membuat 6 user pelanggan baru, masing-masing dengan 1 order DELIVERED
 * dan 1 testimonial yang realistis. Tidak menghapus data yang sudah ada.
 * 
 * Jalankan dengan: npx tsx prisma/seed-testimonials.ts
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // -----------------------------------------------------------------------
  // 1. Ambil produk yang ada di database untuk dipakai di order items
  // -----------------------------------------------------------------------
  const products = await prisma.product.findMany({
    select: { id: true, title: true, price: true },
  });

  if (products.length === 0) {
    console.error('❌ Tidak ada produk di database. Jalankan seed utama dulu.');
    process.exit(1);
  }

  console.log(`✅ Ditemukan ${products.length} produk.`);

  // -----------------------------------------------------------------------
  // 2. Data 6 pelanggan + testimoni mereka
  // -----------------------------------------------------------------------
  const testimoniData = [
    {
      user: {
        firstName: 'Reza',
        lastName: 'Mahendra',
        email: 'reza.mahendra@gmail.com',
        password: 'user123456',
      },
      orderItem: { productIndex: 0, size: '48', quantity: 1 },
      testimonial: {
        quote:
          'Kualitasnya jauh melebihi ekspektasi saya. Coat-nya terasa hangat, jahitannya rapi, dan bahannya premium banget. Worth every penny!',
        rating: 5,
      },
    },
    {
      user: {
        firstName: 'Sinta',
        lastName: 'Wijayanti',
        email: 'sinta.wjy@yahoo.com',
        password: 'user123456',
      },
      orderItem: { productIndex: 1, size: '40', quantity: 1 },
      testimonial: {
        quote:
          'Boots-nya keren banget dan nyaman dipakai seharian. Sudah 3 bulan pakai dan tidak ada tanda-tanda rusak. Pengiriman juga cepat, packagingnya elegan.',
        rating: 5,
      },
    },
    {
      user: {
        firstName: 'Bagas',
        lastName: 'Pratama',
        email: 'bagas.pratama@outlook.com',
        password: 'user123456',
      },
      orderItem: { productIndex: 2, size: 'OS', quantity: 1 },
      testimonial: {
        quote:
          'Tote bag-nya minimalis tapi fungsional banget. Kapasitasnya besar, bahan kulitnya halus, dan terlihat mewah. Sudah dapat banyak compliment dari teman-teman!',
        rating: 5,
      },
    },
    {
      user: {
        firstName: 'Laila',
        lastName: 'Rahmawati',
        email: 'laila.rahmawati@gmail.com',
        password: 'user123456',
      },
      orderItem: { productIndex: 4, size: 'M', quantity: 1 },
      testimonial: {
        quote:
          'Sweater cashmere-nya lembut luar biasa. Fit-nya pas di badan, dan warnanya sangat elegan untuk berbagai kesempatan. James Boogie tidak pernah mengecewakan!',
        rating: 5,
      },
    },
    {
      user: {
        firstName: 'Dimas',
        lastName: 'Ardhana',
        email: 'dimas.ardhana@icloud.com',
        password: 'user123456',
      },
      orderItem: { productIndex: 6, size: '50', quantity: 1 },
      testimonial: {
        quote:
          'Blazer-nya tailored sempurna dan terasa premium di bahan maupun jahitannya. Saya pakai ke meeting klien dan langsung banyak yang tanya beli di mana. Highly recommended!',
        rating: 5,
      },
    },
    {
      user: {
        firstName: 'Anisa',
        lastName: 'Kusuma',
        email: 'anisa.kusuma@gmail.com',
        password: 'user123456',
      },
      orderItem: { productIndex: 7, size: '41', quantity: 1 },
      testimonial: {
        quote:
          'Loafers-nya sangat nyaman dipakai dan desainnya timeless. Customer service James Boogie juga sangat responsif dan helpful. Pasti balik beli lagi!',
        rating: 5,
      },
    },
  ];

  // -----------------------------------------------------------------------
  // 3. Hapus testimonial lama yang dibuat oleh seeder ini sebelumnya
  //    (bisa dijalankan berulang kali dengan aman)
  // -----------------------------------------------------------------------
  const seederEmails = testimoniData.map((d) => d.user.email);
  const existingUsers = await prisma.user.findMany({
    where: { email: { in: seederEmails } },
    select: { id: true },
  });

  if (existingUsers.length > 0) {
    const userIds = existingUsers.map((u: { id: number }) => u.id);
    const existingOrders = await prisma.order.findMany({
      where: { userId: { in: userIds } },
      select: { id: true },
    });
    const orderIds = existingOrders.map((o: { id: number }) => o.id);

    if (orderIds.length > 0) {
      await prisma.testimonial.deleteMany({ where: { orderId: { in: orderIds } } });
      await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
      await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
    }
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    console.log('🧹 Data seeder lama dihapus.');
  }

  // -----------------------------------------------------------------------
  // 4. Buat users, orders, dan testimonials
  // -----------------------------------------------------------------------
  let createdCount = 0;

  for (const item of testimoniData) {
    const productIdx = Math.min(item.orderItem.productIndex, products.length - 1);
    const product = products[productIdx];

    // Buat user
    const user = await prisma.user.create({
      data: {
        ...item.user,
        role: 'USER',
      },
    });

    // Buat order dengan status DELIVERED
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount: product.price * item.orderItem.quantity,
        shippingAddress: 'Jl. Contoh No. 1, Jakarta Selatan',
        city: 'Jakarta',
        status: 'DELIVERED',
        paymentProof: '/images/proof-mock.png',
        orderItems: {
          create: [
            {
              productId: product.id,
              size: item.orderItem.size,
              quantity: item.orderItem.quantity,
              price: product.price,
            },
          ],
        },
      },
    });

    // Buat testimonial
    await prisma.testimonial.create({
      data: {
        userId: user.id,
        orderId: order.id,
        quote: item.testimonial.quote,
        rating: item.testimonial.rating,
      },
    });

    createdCount++;
    console.log(`  ✅ [${createdCount}/6] Testimoni dari ${user.firstName} ${user.lastName} berhasil dibuat.`);
  }

  // -----------------------------------------------------------------------
  // 5. Summary
  // -----------------------------------------------------------------------
  const totalTestimonials = await prisma.testimonial.count();
  console.log(`\n🎉 Selesai! Total testimonial di database: ${totalTestimonials}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
