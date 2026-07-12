import Link from 'next/link';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import JournalCard from "@/components/JournalCard/JournalCard";
import styles from "./page.module.css";
import { prisma } from '@/lib/prisma';
import { safeParseJson } from '@/lib/utils';

export default async function JournalPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const formattedPosts = products.map(product => {
    // Parse images safely
    const parsedImages = safeParseJson(product.images);
    const firstImage = Array.isArray(parsedImages) && parsedImages.length > 0
      ? parsedImages[0]
      : '/images/placeholder.png';

    // Format date beautifully
    const dateStr = new Date(product.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).toUpperCase();

    return {
      id: product.id.toString(),
      date: dateStr,
      title: product.title.toUpperCase(),
      excerpt: product.description,
      image: firstImage
    };
  });

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
              <span className="uppercase-spaced">Journal</span>
            </div>
            <h1 className={styles.pageTitle}>Journal</h1>
          </header>
          
          <div className={styles.journalFeed}>
            {formattedPosts.map(post => (
              <JournalCard key={post.id} {...post} />
            ))}
            {formattedPosts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>No products found</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
