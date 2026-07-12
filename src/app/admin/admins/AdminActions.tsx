'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAdmin, deleteAdmin } from '@/actions/admin';
import styles from './page.module.css';

export function CreateAdminButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const res = await createAdmin({ firstName, lastName, email, password });
    
    if (res.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      alert(res.message);
    }
    
    setIsPending(false);
  }

  return (
    <>
      <button className={styles.addBtn} onClick={() => setIsOpen(true)}>+ Create New Admin</button>

      {isOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Create New Admin</h2>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>First Name</label>
                <input type="text" name="firstName" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input type="text" name="lastName" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input type="email" name="email" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Password</label>
                <input type="password" name="password" required />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsOpen(false)}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={isPending}>
                  {isPending ? 'Saving...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function DeleteAdminButton({ id }: { id: number }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (confirm('Are you sure you want to remove this admin?')) {
      setIsPending(true);
      await deleteAdmin(id);
      router.refresh();
      setIsPending(false);
    }
  }

  return (
    <button 
      className={styles.removeBtn} 
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? 'Removing...' : 'Remove Admin'}
    </button>
  );
}
