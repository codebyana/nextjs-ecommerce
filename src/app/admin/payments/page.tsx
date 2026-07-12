import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import PaymentForm from '@/app/admin/payments/PaymentForm';
import PaymentActions from '@/components/Admin/PaymentActions';

export default async function ManagePayments() {
  // Trigger Next.js hot reload for prisma client
  const payments = await prisma.bankDetail.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Kelola Payment</h1>
          <p className={styles.subtitle}>Manage bank accounts for manual transfer.</p>
        </div>
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.formSection}>
          <PaymentForm />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Bank Name</th>
                <th>Account Name</th>
                <th>Account Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: any) => (
                <tr key={payment.id}>
                  <td><strong>{payment.bankName}</strong></td>
                  <td>{payment.accountName}</td>
                  <td>{payment.accountNumber}</td>
                  <td>
                    <span className={`${styles.badge} ${payment.isActive ? styles.active : styles.inactive}`}>
                      {payment.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <PaymentActions payment={payment} />
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    No payment methods found. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
