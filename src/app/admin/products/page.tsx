import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import { safeParseJson } from '@/lib/utils';

import ProductActions from '@/components/Admin/ProductActions';
import AddProductButton from '@/components/Admin/AddProductButton';

export default async function ManageProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Kelola Product</h1>
          <p className={styles.subtitle}>Add, edit, and remove products from your store.</p>
        </div>
        <AddProductButton />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => {
              const images = safeParseJson(product.images);
              const sizes = safeParseJson(product.sizes);
              
              return (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productThumb}>
                      <Image 
                        src={images[0] || '/images/placeholder.png'} 
                        alt={product.title} 
                        width={40} 
                        height={50} 
                        className={styles.image}
                      />
                    </div>
                  </td>
                  <td><strong>{product.title}</strong></td>
                  <td>{product.category}</td>
                  <td>{`${(product.price).toLocaleString('id-ID')} IDR`}</td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: product.stock === 0 ? '#fef2f2' : product.stock <= 5 ? '#fffbeb' : '#f0fdf4',
                      color: product.stock === 0 ? '#dc2626' : product.stock <= 5 ? '#d97706' : '#15803d',
                      border: `1px solid ${product.stock === 0 ? '#fecaca' : product.stock <= 5 ? '#fde68a' : '#bbf7d0'}`,
                    }}>
                      <span style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        backgroundColor: product.stock === 0 ? '#dc2626' : product.stock <= 5 ? '#d97706' : '#15803d',
                        display: 'inline-block'
                      }} />
                      {product.stock === 0 ? 'Habis' : `${product.stock} unit`}
                    </span>
                  </td>
                  <td>
                    <ProductActions product={product} />
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
