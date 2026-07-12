'use client';

import { useState, useTransition } from 'react';
import { addCategory, updateCategory } from '@/actions/admin';
import styles from './ProductModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category?: any;
  onSaved?: () => void;
}

export default function CategoryModal({ isOpen, onClose, category, onSaved }: Props) {
  const [name, setName] = useState(category?.name || '');
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      let result;
      if (category) {
        result = await updateCategory(category.id, name);
      } else {
        result = await addCategory(name);
      }

      if (result.success) {
        if (onSaved) onSaved();
        onClose();
      } else {
        alert(result.message || 'Operation failed');
      }
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className={styles.closeBtn}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Category Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
