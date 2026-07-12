'use client';

import { useEffect } from 'react';
import styles from './FilterDrawer.module.css';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  categories: string[];
}

const FilterDrawer = ({ 
  isOpen, 
  onClose, 
  selectedCategory, 
  setSelectedCategory, 
  selectedSort, 
  setSelectedSort,
  categories = []
}: FilterDrawerProps) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const filterCategories = ['All', ...categories];
  const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low'];

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className="uppercase-spaced">Filter & Sort</h2>
          <button className={styles.closeBtn} onClick={onClose}>Close</button>
        </header>
        
        <div className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Category</h3>
            <div className={styles.options}>
              {filterCategories.map(cat => (
                <button 
                  key={cat}
                  className={selectedCategory === cat ? styles.optionActive : styles.option}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>
          
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Sort By</h3>
            <div className={styles.options}>
              {sortOptions.map(sort => (
                <button 
                  key={sort}
                  className={selectedSort === sort ? styles.optionActive : styles.option}
                  onClick={() => setSelectedSort(sort)}
                >
                  {sort}
                </button>
              ))}
            </div>
          </section>
        </div>
        
        <footer className={styles.footer}>
          <button className={styles.applyBtn} onClick={onClose}>Apply Filters</button>
        </footer>
      </div>
    </div>
  );
};

export default FilterDrawer;
