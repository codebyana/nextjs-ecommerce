'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, totalPrice } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsCartOpen(false)}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className="uppercase-spaced">Shopping Bag</h2>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>Close</button>
        </header>

        <div className={styles.content}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Your bag is currently empty.</p>
              <Link 
                href="/shop"
                className={styles.shopBtn}
                onClick={() => setIsCartOpen(false)}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <ul className={styles.itemList}>
              {cart.map((item, index) => (
                <li key={`${item.id}-${item.size}-${index}`} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill 
                      sizes="80px"
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <p className={styles.itemPrice}>
                        {item.price.includes('$') 
                          ? `${(parseFloat(item.price.replace('$', '')) * 10000).toLocaleString('id-ID')} IDR` 
                          : item.price}
                      </p>
                    </div>
                    {item.size && <p className={styles.itemSize}>Size: {item.size}</p>}
                    <p className={styles.itemQty}>Quantity: {item.quantity}</p>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.id, item.size)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <footer className={styles.footer}>
            <div className={styles.summary}>
              <span className="uppercase-spaced">Total</span>
              <span className={styles.totalAmount}>{`${totalPrice.toLocaleString('id-ID')} IDR`}</span>
            </div>
            <p className={styles.disclaimer}>Shipping & taxes calculated at checkout</p>
            <Link 
              href="/checkout" 
              className={styles.checkoutBtn}
              onClick={() => setIsCartOpen(false)}
            >
              Checkout
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
