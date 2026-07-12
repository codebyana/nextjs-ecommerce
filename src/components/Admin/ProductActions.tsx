'use client';

import { useState, useTransition } from 'react';
import { deleteProduct } from '@/actions/admin';
import ProductModal from './ProductModal';
import ConfirmationModal from './ConfirmationModal';

export default function ProductActions({ product }: { product: any }) {
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (result.success) {
        setIsDeleteOpen(false);
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

      <ProductModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        product={product} 
      />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
        isLoading={isPending}
      />
    </>
  );
}
