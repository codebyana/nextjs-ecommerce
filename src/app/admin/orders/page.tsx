import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import OrderActions from '@/components/Admin/OrderActions';

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Menunggu Pembayaran',
  PAID: 'Lunas / Diproses',
  SHIPPED: 'Sedang Dikirim',
  DELIVERED: 'Selesai',
  CANCELLED: 'Dibatalkan'
};

export default async function ManageOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>Kelola Transaksi + Payment</h1>
        <p className={styles.subtitle}>Monitor orders and verify customer payments.</p>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment Proof</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: any) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user.firstName} {order.user.lastName}</td>
                <td>{`${order.totalAmount.toLocaleString('id-ID')} IDR`}</td>
                <td>
                  {order.paymentProof ? (
                    <a href={order.paymentProof} target="_blank" rel="noreferrer" className={styles.viewProofBtn}>
                      View Proof
                    </a>
                  ) : (
                    <span className={styles.noProof}>No Proof</span>
                  )}
                </td>
                <td>
                  <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                    {STATUS_MAP[order.status] || order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <OrderActions id={order.id} currentStatus={order.status} />
                  </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
