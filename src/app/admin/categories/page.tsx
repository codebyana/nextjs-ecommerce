import { prisma } from '@/lib/prisma';
import styles from '../products/page.module.css';
import AddCategoryButton from '@/components/Admin/AddCategoryButton';
import CategoryActions from '@/components/Admin/CategoryActions';

export default async function ManageCategories() {
  const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Kelola Kategori</h1>
          <p className={styles.subtitle}>Create, edit, and remove product categories.</p>
        </div>
        <AddCategoryButton />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat.id}>
                <td><strong>{cat.name}</strong></td>
                <td>{new Date(cat.createdAt).toLocaleString()}</td>
                <td>
                  <CategoryActions category={cat} />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>No categories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
