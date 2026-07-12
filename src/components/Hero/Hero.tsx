import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/bg-asset.png"
          alt="Premium Collection"
          fill
          priority
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>The New Standard</h1>
        <p className={styles.subtitle}>ELEVATED ESSENTIALS FOR THE MODERN INDIVIDUAL</p>
        <Link href="/shop" className={styles.cta}>Shop Now</Link>
      </div>
    </section>
  );
};

export default Hero;
