'use client';

import { useState } from 'react';
import ProductModal from './ProductModal';
import styles from '@/app/admin/products/page.module.css';

export default function AddProductButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={styles.addBtn} onClick={() => setIsOpen(true)}>
        + Add New Product
      </button>

      <ProductModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
