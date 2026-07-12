'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SearchOverlay.module.css';
import { safeParseJson } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      fetch('/api/products')
        .then(res => res.json())
        .then(data => {
          const formatted = data.map((p: any) => {
            const images = safeParseJson(p.images);
            return {
              id: p.id.toString(),
              title: p.title,
              price: `${p.price.toLocaleString('id-ID')} IDR`,
              image: Array.isArray(images) ? images[0] : '/images/placeholder.png'
            };
          });
          setAllProducts(formatted);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = allProducts.filter(p => 
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, allProducts]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.searchField}>
            <input 
              type="text" 
              placeholder="Search products..." 
              className={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <button className={styles.closeBtn} onClick={onClose}>Close</button>
        </header>

        <div className={styles.content}>
          {results.length > 0 ? (
            <div className={styles.resultsGrid}>
              {results.map(product => (
                <Link 
                  href={`/shop/${product.id}`} 
                  key={product.id} 
                  className={styles.resultItem}
                  onClick={onClose}
                >
                  <div className={styles.imageWrapper}>
                    <Image src={product.image} alt={product.title} fill className={styles.image} />
                  </div>
                  <div className={styles.info}>
                    <h4 className={styles.title}>{product.title}</h4>
                    <p className={styles.price}>{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <p className={styles.noResults}>No products found for "{query}"</p>
          ) : (
            <p className={styles.noResults}>Start typing to search...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
