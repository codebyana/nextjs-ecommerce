'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>Close</button>
        </header>

        <nav className={styles.nav}>
          <Link href="/shop" className={styles.link} onClick={onClose}>Shop</Link>
          <Link href="/journal" className={styles.link} onClick={onClose}>Journal</Link>
          <Link href="/about" className={styles.link} onClick={onClose}>About Us</Link>
          <Link href="/brand" className={styles.link} onClick={onClose}>The Brand</Link>
        </nav>

        <div className={styles.footer}>
          {isAuthenticated ? (
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.firstName} {user?.lastName}</p>
              <button onClick={() => { logout(); onClose(); }} className={styles.authLink}>Logout</button>
            </div>
          ) : (
            <Link href="/login" className={styles.authLink} onClick={onClose}>Login / Register</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
