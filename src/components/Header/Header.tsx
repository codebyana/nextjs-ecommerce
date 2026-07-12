'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import SearchOverlay from '@/components/SearchOverlay/SearchOverlay';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import styles from './Header.module.css';

const Header = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Mobile Menu Toggle */}
          <button
            className={styles.menuBtn}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 8h16M4 16h16" />
            </svg>
            <span className={styles.menuText}>Menu</span>
          </button>

          <nav className={styles.navLeft}>
            <Link href="/shop" className="uppercase-spaced">Shop</Link>
            <Link href="/journal" className="uppercase-spaced">Journal</Link>
            <Link href="/about" className="uppercase-spaced">About Us</Link>
            {isAuthenticated && (
              <Link href="/orders" className="uppercase-spaced">My Orders</Link>
            )}
          </nav>

          <div className={styles.logo}>
            <Link href="/">DIJA STYLE</Link>
          </div>

          <nav className={styles.navRight}>
            <button
              className={styles.searchBtn}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className={styles.searchText}>Search</span>
            </button>
            {isAuthenticated && (
              <button
                className={styles.cartBtn}
                onClick={() => setIsCartOpen(true)}
                aria-label="Cart"
              >
                <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className={styles.cartText}>Cart ({totalItems})</span>
                <span className={styles.cartBadge}>{totalItems}</span>
              </button>
            )}

            <div className={styles.desktopAuth}>
              {isAuthenticated ? (
                <div className={styles.userMenu}>
                  <div className={styles.profile}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className={styles.userName}>{user?.firstName} {user?.lastName}</span>
                  </div>
                  <button onClick={logout} className="uppercase-spaced">Logout</button>
                </div>
              ) : (
                <Link href="/login" className="uppercase-spaced">Login</Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Header;
