import { prisma } from '@/lib/prisma';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductDetailClient from "./ProductDetailClient";
import styles from "./page.module.css";
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <ProductDetailClient product={product} />
        </div>
      </main>
      <Footer />
    </>
  );
}
