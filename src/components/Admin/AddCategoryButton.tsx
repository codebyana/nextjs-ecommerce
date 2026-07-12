'use client';

import { useState } from 'react';
import CategoryModal from './CategoryModal';
import styles from '@/app/admin/products/page.module.css';

export default function AddCategoryButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={styles.addBtn} onClick={() => setIsOpen(true)}>+ Add Category</button>
      <CategoryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
