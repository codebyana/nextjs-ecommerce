'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { incrementProductInterest } from '@/actions/shop';
import styles from "./page.module.css";
import { safeParseJson } from '@/lib/utils';

export default function ProductDetailClient({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeError, setShowSizeError] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('description');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const images = safeParseJson(product.images);
  const sizes = safeParseJson(product.sizes);
  const stock: number = product.stock ?? 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const isJacket = product.category === 'Jaket';

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (isJacket && !selectedSize && sizes.length > 1) {
      setShowSizeError(true);
      return;
    }

    // Increment interest count in database
    await incrementProductInterest(product.id);

    addToCart({
      id: product.id.toString(),
      title: product.title,
      price: `${product.price.toLocaleString('id-ID')} IDR`,
      image: Array.isArray(images) ? images[0] : '/images/placeholder.png',
      size: isJacket ? (selectedSize || sizes[0]) : 'All Size',
      quantity: 1
    });
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setShowSizeError(false);
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className={styles.pdpLayout}>
      {/* Left: Image Gallery */}
      <div className={styles.gallery}>
        {images.map((img: string, idx: number) => (
          <div key={idx} className={styles.imageWrapper}>
            <Image
              src={img}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* Right: Product Info */}
      <div className={styles.infoColumn}>
        <div className={styles.stickyContent}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/shop">Shop</Link>
            <span>/</span>
            <span>{product.title}</span>
          </nav>

          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.price}>{`${product.price.toLocaleString('id-ID')} IDR`}</p>

          {isJacket && (
            <div className={styles.sizeSelection}>
              <p className={styles.label}>Select Size</p>
              <div className={styles.sizeGrid}>
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isJacket && showSizeError && (
            <p className={styles.sizeError}>Please select a size before adding to bag</p>
          )}

          {/* Stock Status */}
          <div className={styles.stockStatus}>
            <span className={`${styles.stockDot} ${isOutOfStock ? styles.dotRed : isLowStock ? styles.dotOrange : styles.dotGreen}`} />
            <span className={`${styles.stockText} ${isOutOfStock ? styles.textRed : isLowStock ? styles.textOrange : styles.textGreen}`}>
              {isOutOfStock ? 'Stok Habis' : isLowStock ? `Stok Terbatas — Sisa ${stock} unit` : `In Stock — ${stock} unit`}
            </span>
          </div>

          <button
            className={styles.addBtn}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={isOutOfStock ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
          >
            {isOutOfStock ? 'Stok Habis' : 'Add to Bag'}
          </button>

          <div className={styles.accordions}>
            <div className={styles.accordionItem}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleAccordion('description')}
              >
                Description
                <span>{activeAccordion === 'description' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'description' && (
                <div className={styles.accordionContent}>
                  <p>{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
