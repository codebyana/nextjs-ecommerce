'use client';

import { useState, useTransition } from 'react';
import { deleteCategory } from '@/actions/admin';
import CategoryModal from './CategoryModal';
import ConfirmationModal from './ConfirmationModal';

export default function CategoryActions({ category }: { category: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteCategory(category.id);
      if (res.success) {
        setIsDeleteOpen(false);
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setIsEditOpen(true)} style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer' }}>Edit</button>
        <button onClick={() => setIsDeleteOpen(true)} style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #e5e7eb', color: '#ef4444', background: 'white', cursor: 'pointer' }}>Delete</button>
      </div>

      <CategoryModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} category={category} />

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${category.name}"?`}
        isLoading={isPending}
      />
    </>
  );
}
