import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  title: string;
  price: string;
  image: string;
  soldCount?: number;
  stock?: number;
}

const ProductCard = ({ id, title, price, image, soldCount, stock }: ProductCardProps) => {
  const isOutOfStock = stock !== undefined && stock === 0;
  const isLowStock = stock !== undefined && stock > 0 && stock <= 5;

  return (
    <Link href={`/shop/${id}`} className={`${styles.card} ${isOutOfStock ? styles.outOfStock : ''}`}>
      <div className={styles.imageWrapper}>
        <Image 
          src={image} 
          alt={title} 
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={styles.image}
        />
        {isOutOfStock && (
          <div className={styles.stockOverlay}>Stok Habis</div>
        )}
        {isLowStock && (
          <div className={styles.lowStockBadge}>Sisa {stock}</div>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.metaRow}>
          <p className={styles.price}>{price}</p>
          {soldCount !== undefined && soldCount > 0 && (
            <span className={styles.soldCount}>{soldCount} Terjual</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
