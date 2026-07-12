'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import styles from './layout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div>
            <Link href="/" className={styles.logo}>DIJA STYLE</Link>
            <span className={styles.badge}>ADMIN PANEL</span>
          </div>
          <button 
            className={styles.hamburgerBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={`${styles.menuContainer} ${isMobileMenuOpen ? styles.menuOpen : ''}`}>
          <nav className={styles.nav}>
            <Link href="/admin" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
            <Link href="/admin/products" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Kelola Product</Link>
            <Link href="/admin/categories" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Kelola Kategori</Link>
            <Link href="/admin/orders" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Kelola Transaksi</Link>
            <Link href="/admin/users" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Kelola User</Link>
            <Link href="/admin/admins" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Kelola Admin</Link>
            <Link href="/admin/payments" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>Kelola Payment</Link>
          </nav>

          <div className={styles.sidebarFooter}>
            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
          </div>
        </div>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
