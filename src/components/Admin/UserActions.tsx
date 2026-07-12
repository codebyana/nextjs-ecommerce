'use client';

import { useTransition } from 'react';
import { deleteUser } from '@/actions/admin';

export default function UserActions({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Are you sure you want to ban/delete this user?')) {
      startTransition(async () => {
        const result = await deleteUser(id);
        if (!result.success) {
          alert(result.message);
        }
      });
    }
  };

  return (
    <button 
      style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? 'Processing...' : 'Ban User'}
    </button>
  );
}
