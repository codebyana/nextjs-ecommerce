'use client';

import { useState, useTransition } from 'react';
import { deletePaymentMethod, updatePaymentMethod } from '@/actions/admin';
import ConfirmationModal from './ConfirmationModal';
import styles from './PaymentActions.module.css';

export default function PaymentActions({ payment }: { payment: any }) {
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    bankName: payment.bankName,
    accountName: payment.accountName,
    accountNumber: payment.accountNumber,
    isActive: payment.isActive
  });

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePaymentMethod(payment.id);
      if (result.success) {
        setIsDeleteOpen(false);
      } else {
        alert(result.message);
      }
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updatePaymentMethod(payment.id, formData);
      if (result.success) {
        setIsEditOpen(false);
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}
          onClick={() => setIsEditOpen(true)}
        >
          Edit
        </button>
        <button 
          style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #e5e7eb', color: '#ef4444', background: 'white', cursor: 'pointer' }}
          onClick={() => setIsDeleteOpen(true)}
        >
          Delete
        </button>
      </div>

      {isEditOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <h2>Edit Payment Method</h2>
              <button onClick={() => setIsEditOpen(false)} className={styles.closeBtn}>&times;</button>
            </div>
            <form onSubmit={handleEditSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Bank Name</label>
                <input 
                  type="text" 
                  value={formData.bankName} 
                  onChange={(e) => setFormData({...formData, bankName: e.target.value})} 
                  required 
                />
              </div>
              <div className={styles.field}>
                <label>Account Name</label>
                <input 
                  type="text" 
                  value={formData.accountName} 
                  onChange={(e) => setFormData({...formData, accountName: e.target.value})} 
                  required 
                />
              </div>
              <div className={styles.field}>
                <label>Account Number</label>
                <input 
                  type="text" 
                  value={formData.accountNumber} 
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} 
                  required 
                />
              </div>
              <div className={styles.fieldCheckbox}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  Active (Show to users)
                </label>
              </div>
              <div className={styles.actions}>
                <button type="button" onClick={() => setIsEditOpen(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete payment method "${payment.bankName} - ${payment.accountNumber}"? This action cannot be undone.`}
        isLoading={isPending}
      />
    </>
  );
}
