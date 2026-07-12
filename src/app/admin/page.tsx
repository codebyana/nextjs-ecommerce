import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import DashboardCharts from '@/components/Admin/DashboardCharts';
import SoldReportTable from '@/components/Admin/SoldReportTable';

export default async function AdminDashboard() {
  // Fetch real data from DB
  const [products, userCount, orders] = await Promise.all([
    prisma.product.findMany({
      select: { title: true, interestCount: true }
    }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
  ]);

  const productCount = products.length;

  // Format data for chart
  const productInterest = products.map(p => ({
    title: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title,
    views: p.interestCount
  }));

  // Fetch sold products count
  const soldItems = await prisma.orderItem.findMany({
    where: {
      order: {
        status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }
      }
    },
    include: {
      product: true,
      order: {
        select: {
          createdAt: true
        }
      }
    }
  });

  const serializedSoldItems = soldItems.map(item => ({
    id: item.id,
    quantity: item.quantity,
    price: item.price,
    productId: item.productId,
    product: item.product ? {
      title: item.product.title
    } : null,
    order: {
      createdAt: item.order.createdAt.toISOString()
    }
  }));

  const totalRevenue = await prisma.order.aggregate({
    where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
    _sum: { totalAmount: true }
  });

  const stats = [
    { label: 'Total Revenue', value: `${(totalRevenue._sum.totalAmount || 0).toLocaleString('id-ID')} IDR` },
    { label: 'Orders', value: orders.length.toString() },
    { label: 'Products', value: productCount.toString() },
    { label: 'Active Users', value: userCount.toString() },
  ];

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Overview</h1>
        <p className={styles.subtitle}>Welcome back, Admin. Here is what's happening today.</p>
      </header>

      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>

      <DashboardCharts productInterest={productInterest} />

      <div className={styles.twoColumnLayout}>
        <SoldReportTable initialItems={serializedSoldItems} />

        <div className={styles.recentActivity}>
          <h2 className={styles.sectionTitle}>Recent Orders</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user.firstName} {order.user.lastName}</td>
                    <td>
                      <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{`${order.totalAmount.toLocaleString('id-ID')} IDR`}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
