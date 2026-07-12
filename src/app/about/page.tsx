import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.title}>The DIJA STYLE Story</h1>
            <p className={styles.subtitle}>Redefining modern luxury through timeless craftsmanship and bold aesthetics.</p>
          </div>
        </section>
        <section className={styles.mapSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Find Us</h2>
            <div className={styles.mapContainer}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.9619409111942!2d105.27057429999999!3d-5.4227537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40dbdb660e41c5%3A0x471d2c88a2ce3e17!2sDija%20Gallery%20%26%20Studio!5e0!3m2!1sid!2sid!4v1781152026352!5m2!1sid!2sid"
                title="Dija Gallery & Studio location"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className="container">
            <div className={styles.grid}>
              <div className={styles.textContent}>
                  <h2>About Us</h2>
                  <p>
                    Dija is a creative space that brings together culture, aesthetics, and local identity into meaningful
                    creations. We combine traditional elements with modern design to produce unique, elegant, and timeless works.
                  </p>
                  <p>
                    Every Dija creation is inspired by the richness of nature, culture, and local wisdom, reflected through
                    refined motifs and distinctive designs. With a passion for creativity and quality, Dija is committed to
                    delivering works that are not only visually beautiful but also carry stories and character.
                  </p>
                  <p>
                    Dija believes that every design represents identity, beauty, and cultural pride that can be worn and
                    appreciated by everyone.
                  </p>
              </div>
              <div className={styles.imagePlaceholder}>
                <div className={styles.imageBox}>
                  <Image
                    src="/images/about.png"
                    alt="About Dija"
                    fill
                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
