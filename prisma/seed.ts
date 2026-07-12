import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.testimonial.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.bankDetail.deleteMany();

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@jamesboogie.com',
      password: 'adminpassword123',
      firstName: 'Admin',
      lastName: 'James',
      role: 'ADMIN',
    },
  });

  // Create Sample User
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: 'userpassword123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  });

  // Create Products
  const productData = [
    {
      title: 'Double-Breasted Wool Coat',
      description: 'A timeless double-breasted coat crafted from premium Italian wool.',
      price: 4500000,
      images: JSON.stringify(['/images/product-1.png']),
      sizes: JSON.stringify(['46', '48', '50', '52']),
      category: 'Outerwear',
      interestCount: 15
    },
    {
      title: 'Heritage Leather Boots',
      description: 'Handcrafted heritage boots made from full-grain leather.',
      price: 3200000,
      images: JSON.stringify(['/images/product-2.png']),
      sizes: JSON.stringify(['40', '41', '42', '43', '44']),
      category: 'Footwear',
      interestCount: 22
    },
    {
      title: 'Minimalist Leather Tote',
      description: 'A spacious tote bag for your everyday essentials.',
      price: 2800000,
      images: JSON.stringify(['/images/product-3.png']),
      sizes: JSON.stringify(['OS']),
      category: 'Accessories',
      interestCount: 18
    },
    {
      title: 'Relaxed Fit Linen Trousers',
      description: 'A breezy, high-waisted linen trouser perfect for relaxed elegance.',
      price: 1250000,
      images: JSON.stringify(['/images/product-4.png']),
      sizes: JSON.stringify(['S', 'M', 'L']),
      category: 'Trousers',
      interestCount: 30
    },
    {
      title: 'Classic Cashmere Sweater',
      description: 'Knitted from premium Mongolian cashmere for ultimate comfort and warmth.',
      price: 2100000,
      images: JSON.stringify(['/images/product-5.png']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      category: 'Knitwear',
      interestCount: 25
    },
    {
      title: 'Premium Cotton Silk Shirt',
      description: 'A sophisticated blend of high-grade long-staple cotton and natural silk.',
      price: 1450000,
      images: JSON.stringify(['/images/product-6.png']),
      sizes: JSON.stringify(['38', '40', '42']),
      category: 'Shirts',
      interestCount: 12
    },
    {
      title: 'Wool Blend Tailored Blazer',
      description: 'An elegant unstructured blazer in a rich olive tone for modern tailoring.',
      price: 3800000,
      images: JSON.stringify(['/images/product-7.png']),
      sizes: JSON.stringify(['48', '50', '52']),
      category: 'Outerwear',
      interestCount: 40
    },
    {
      title: 'Structured Leather Loafers',
      description: 'Handcrafted black calfskin leather loafers with structured silhouette.',
      price: 2600000,
      images: JSON.stringify(['/images/product-8.png']),
      sizes: JSON.stringify(['40', '41', '42', '43']),
      category: 'Footwear',
      interestCount: 35
    },
    {
      title: 'Raw Edge Denim Jacket',
      description: 'A classic boxy denim jacket featuring raw edge collar detail.',
      price: 1950000,
      images: JSON.stringify(['/images/product-9.png']),
      sizes: JSON.stringify(['S', 'M', 'L']),
      category: 'Outerwear',
      interestCount: 8
    }
  ];

  const products = [];
  for (const p of productData) {
    const product = await prisma.product.create({ data: p });
    products.push(product);
  }

  // Create Sample Orders
  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: 7700000,
      shippingAddress: 'Jl. Sudirman No. 123, Jakarta Selatan',
      city: 'Jakarta',
      status: 'PAID',
      paymentProof: '/images/proof-mock.png',
      orderItems: {
        create: [
          {
            productId: products[0].id,
            size: '48',
            quantity: 1,
            price: 4500000,
          },
          {
            productId: products[1].id,
            size: '42',
            quantity: 1,
            price: 3200000,
          }
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: 2800000,
      shippingAddress: 'Jl. Merdeka No. 45, Bandung',
      city: 'Bandung',
      status: 'PENDING',
      orderItems: {
        create: [
          {
            productId: products[2].id,
            size: 'OS',
            quantity: 1,
            price: 2800000,
          }
        ]
      }
    }
  });

  // Create Bank Details
  await prisma.bankDetail.createMany({
    data: [
      {
        bankName: 'BCA',
        accountName: 'PT DIJA STYLE INDONESIA',
        accountNumber: '8820-1234-567',
        isActive: true,
      },
      {
        bankName: 'Mandiri',
        accountName: 'DIJA STYLE OFFICIAL',
        accountNumber: '1122-3344-5566',
        isActive: true,
      }
    ]
  });

  // Create Categories
  await prisma.category.createMany({
    data: [
      { name: 'Tas' },
      { name: 'Jaket' },
      { name: 'Sarung bantal' },
      { name: 'Kalung' },
      { name: 'Kain' }
    ],
    skipDuplicates: true
  });

  console.log('Seed data created successfully, including sample orders and bank details');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
