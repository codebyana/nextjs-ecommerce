'use client';
import { useState } from 'react';
import Link from 'next/link';
import ProductCard from "@/components/ProductCard/ProductCard";
import FilterDrawer from "@/components/FilterDrawer/FilterDrawer";
import styles from "./page.module.css";
import { safeParseJson } from '@/lib/utils';

export default function ShopContent({ products, categories }: { products: any[], categories: string[] }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');

  const filteredProducts = products
    .filter(p => category === 'All' || p.category === category)
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.price - b.price;
      if (sortBy === 'Price: High to Low') return b.price - a.price;
      return 0;
    });

  return (
    <>
      <main className={styles.main}>
        <div className="container">
          <header className={styles.pageHeader}>
            <div className={styles.topBreadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>
                <span className="uppercase-spaced">Home</span>
              </Link>
              <span className={styles.separator}>{">"}</span>
              <span className="uppercase-spaced">Shop</span>
            </div>
            <h1 className={styles.pageTitle}>Shop</h1>
          </header>

          <div className={styles.toolbar}>
            <button className={styles.filterBtn} onClick={() => setIsFilterOpen(true)}>
              Filter & Sort
            </button>
            <div className={styles.breadcrumb}>
              <span className="uppercase-spaced">{category === 'All' ? 'All Products' : category}</span>
            </div>
            <div className={styles.viewOptions}>
              <span className={styles.count}>{filteredProducts.length} Products</span>
            </div>
          </div>

          <div className={styles.productGrid}>
            {filteredProducts.map(product => {
              const images = safeParseJson(product.images);
              return (
                <ProductCard 
                  key={product.id} 
                  id={product.id.toString()}
                  title={product.title}
                  price={`${(product.price).toLocaleString('id-ID')} IDR`}
                  image={images[0] || '/images/placeholder.png'}
                  soldCount={product.soldCount}
                  stock={product.stock}
                />
              );
            })}
          </div>
        </div>
      </main>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategory={category}
        setSelectedCategory={setCategory}
        selectedSort={sortBy}
        setSelectedSort={setSortBy}
        categories={categories}
      />
    </>
  );
}
