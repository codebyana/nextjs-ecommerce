import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import ProductCard from "@/components/ProductCard/ProductCard";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import { safeParseJson } from '@/lib/utils';

export default async function Home() {
  const [dbProducts, testimonials] = await Promise.all([
    prisma.product.findMany({
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
    }),
    prisma.testimonial.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ]);

  // Compute soldCount for each product
  const productsWithSales = dbProducts.map(product => {
    const soldCount = product.orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
    return {
      ...product,
      soldCount
    };
  });

  // Best Sellers: Sort by soldCount desc, then interestCount desc. Take top 4
  const bestSellers = [...productsWithSales]
    .sort((a, b) => {
      if (b.soldCount !== a.soldCount) {
        return b.soldCount - a.soldCount;
      }
      return b.interestCount - a.interestCount;
    })
    .slice(0, 4);

  // Featured Arrivals: Sort by createdAt desc, take top 4
  const featuredArrivals = [...productsWithSales]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Format testimonials for the UI
  const formattedTestimonials = testimonials.length > 0 ? testimonials.map(t => ({
    id: t.id,
    quote: t.quote,
    author: `${t.user.firstName} ${t.user.lastName.charAt(0)}.`,
    role: "Verified Buyer",
    initial: t.user.firstName.charAt(0).toUpperCase()
  })) : null;

  return (
    <>
      <Header />
      <main>
        <Hero />
        
        {/* Best Sellers Section */}
        <section className="section-padding" style={{ paddingBottom: '0' }}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Best Sellers</h2>
              <Link href="/best-sellers" className="uppercase-spaced">View All</Link>
            </div>
            
            <div className={styles.productGrid}>
              {bestSellers.map(product => {
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
          </div>
        </section>
        
        {/* Featured Arrivals Section */}
        <section className="section-padding">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>All Product</h2>
              <Link href="/shop" className="uppercase-spaced">View All</Link>
            </div>
            
            <div className={styles.productGrid}>
              {featuredArrivals.map(product => {
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
          </div>
        </section>

        <section className={`${styles.editorial} section-padding`}>
          <div className="container">
            <div className={styles.editorialGrid}>
              <div className={styles.editorialText}>
                <h2 className={styles.editorialTitle}>The Journal</h2>
                <p className={styles.editorialDescription}>
                  Explore the stories behind our collections, craftsmanship, and the individuals who inspire us.
                </p>
                <a href="/journal" className="uppercase-spaced">Read More</a>
              </div>
              <div className={styles.editorialImage}>
                <div className={styles.imagePlaceholder} style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src="/images/about.png"
                    alt="The Journal"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Testimonials data={formattedTestimonials || undefined} />
      </main>
      <Footer />
    </>
  );
}
