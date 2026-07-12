import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from '../shop/page.module.css';
import { safeParseJson } from '@/lib/utils';

export const revalidate = 0; // Ensure fresh data on every visit

export default async function BestSellersPage() {
  // Fetch products with their order items to calculate sales
  const dbProducts = await prisma.product.findMany({
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

  // Calculate soldCount for each product and sort by it descending
  const products = dbProducts
    .map(product => {
      const soldCount = product.orderItems.reduce((acc, item) => acc + item.quantity, 0);
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        images: product.images,
        interestCount: product.interestCount,
        stock: product.stock,
        soldCount
      };
    })
    .sort((a, b) => {
      if (b.soldCount !== a.soldCount) {
        return b.soldCount - a.soldCount;
      }
      return b.interestCount - a.interestCount;
    })
    .slice(0, 6); // Take exactly up to 6 products

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <header className={styles.pageHeader}>
            <div className={styles.topBreadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>
                <span className="uppercase-spaced">Home</span>
              </Link>
              <span className={styles.separator}>{">"}</span>
              <span className="uppercase-spaced">Best Sellers</span>
            </div>
            <h1 className={styles.pageTitle}>Best Sellers</h1>
            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Temukan produk-produk terlaris dan paling banyak dicari oleh pelanggan kami.
            </p>
          </header>

          <div className={styles.toolbar}>
            <div className={styles.breadcrumb}>
              <span className="uppercase-spaced">Produk Terpopuler</span>
            </div>
            <div className={styles.viewOptions}>
              <span className={styles.count}>{products.length} Products</span>
            </div>
          </div>

          {products.length > 0 ? (
            <div className={styles.productGrid}>
              {products.map(product => {
                const images = safeParseJson(product.images);
                  
                return (
                  <ProductCard 
                    key={product.id} 
                    id={product.id.toString()}
                    title={product.title}
                    price={`${(product.price).toLocaleString('id-ID')} IDR`}
                    image={Array.isArray(images) ? images[0] : '/images/placeholder.png'}
                    soldCount={product.soldCount}
                    stock={product.stock}
                  />
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ color: '#666', marginBottom: '2rem' }}>Belum ada produk terjual saat ini.</p>
              <Link href="/shop" className={styles.shopBtn}>Mulai Belanja</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
