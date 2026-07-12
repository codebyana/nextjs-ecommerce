import Link from 'next/link';
import Image from 'next/image';
import styles from './JournalCard.module.css';

interface JournalCardProps {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
}

const JournalCard = ({ id, date, title, excerpt, image }: JournalCardProps) => {
  return (
    <article className={styles.article}>
      <div className={styles.content}>
        <p className={styles.date}>{date}</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.excerpt}>{excerpt}</p>
        <Link href={`/shop/${id}`} className={styles.readMore}>View Product</Link>
      </div>
      <div className={styles.imageWrapper}>
        <Image 
          src={image} 
          alt={title} 
          fill
          className={styles.image}
        />
      </div>
    </article>
  );
};

export default JournalCard;
