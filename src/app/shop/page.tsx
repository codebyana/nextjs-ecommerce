import { prisma } from '@/lib/prisma';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ShopContent from "./ShopContent";

export default async function ShopPage() {
  // Fetch real products from database
  const dbProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        where: {
          order: {
            status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }
          }
        },
        select: {
          quantity: true
        }
      }
    }
  });

  const products = dbProducts.map(product => {
    const soldCount = product.orderItems.reduce((acc, item) => acc + item.quantity, 0);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      images: product.images,
      sizes: product.sizes,
      category: product.category,
      interestCount: product.interestCount,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      stock: product.stock,
      soldCount
    };
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <>
      <Header />
      <ShopContent products={products} categories={categories.map(c => c.name)} />
      <Footer />
    </>
  );
}
