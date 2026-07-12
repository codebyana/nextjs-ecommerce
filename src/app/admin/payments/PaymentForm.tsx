'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addPaymentMethod } from '@/actions/admin';
import styles from './page.module.css';

export default function PaymentForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const res = await addPaymentMethod(formData);

    if (res.success) {
      e.currentTarget.reset();
      router.refresh();
    } else {
      alert('Failed to add payment method');
    }

    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3>Add New Bank Account</h3>
      <div className={styles.inputGroup}>
        <label>Bank Name</label>
        <input type="text" name="bankName" placeholder="e.g. BCA" required />
      </div>
      <div className={styles.inputGroup}>
        <label>Account Name</label>
        <input type="text" name="accountName" placeholder="e.g. PT DIJA STYLE" required />
      </div>
      <div className={styles.inputGroup}>
        <label>Account Number</label>
        <input type="text" name="accountNumber" placeholder="e.g. 1234567890" required />
      </div>
      <button type="submit" className={styles.submitBtn} disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Payment Method'}
      </button>
    </form>
  );
}
