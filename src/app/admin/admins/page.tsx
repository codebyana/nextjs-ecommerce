import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import { CreateAdminButton, DeleteAdminButton } from './AdminActions';

export default async function ManageAdmins() {
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Kelola Admin (Create Admin)</h1>
          <p className={styles.subtitle}>Assign administrative roles to users.</p>
        </div>
        <CreateAdminButton />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin: any) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td><strong>{admin.firstName} {admin.lastName}</strong></td>
                <td>{admin.email}</td>
                <td><span className={styles.badge}>{admin.role}</span></td>
                <td>
                  <DeleteAdminButton id={admin.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
