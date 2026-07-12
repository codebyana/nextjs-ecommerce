'use client';

import { useTransition } from 'react';
import { updateOrderStatus } from '@/actions/admin';

export default function OrderActions({ id, currentStatus }: { id: number, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: 'PAID' | 'SHIPPED' | 'CANCELLED') => {
    startTransition(async () => {
      const result = await updateOrderStatus(id, newStatus);
      if (!result.success) {
        alert(result.message);
      }
    });
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {currentStatus === 'PENDING' && (
        <button 
          style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, border: 'none', background: '#166534', color: 'white' }}
          onClick={() => handleStatusChange('PAID')}
          disabled={isPending}
        >
          {isPending ? '...' : 'Approve'}
        </button>
      )}
      {currentStatus === 'PAID' && (
        <button 
          style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, border: 'none', background: '#1e40af', color: 'white' }}
          onClick={() => handleStatusChange('SHIPPED')}
          disabled={isPending}
        >
          {isPending ? '...' : 'Ship Order'}
        </button>
      )}
      {currentStatus === 'SHIPPED' && (
        <span style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', fontStyle: 'italic' }}>
          Menunggu Pembeli
        </span>
      )}
      {currentStatus === 'DELIVERED' && (
        <span style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#4338ca' }}>
          Selesai ✓
        </span>
      )}
      {(currentStatus === 'PENDING' || currentStatus === 'PAID') && (
        <button 
          style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #e5e7eb', color: '#ef4444' }}
          onClick={() => handleStatusChange('CANCELLED')}
          disabled={isPending}
        >
          Reject
        </button>
      )}
    </div>
  );
}
