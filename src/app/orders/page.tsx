'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";
import { updateOrderStatus, submitTestimonial } from '@/actions/testimonial';

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Menunggu Pembayaran',
  PAID: 'Sedang Diproses',
  SHIPPED: 'Sedang Dikirim',
  DELIVERED: 'Selesai',
  CANCELLED: 'Dibatalkan'
};

// We'll fetch orders via an API route or server action
async function getUserOrders(email: string) {
  const response = await fetch(`/api/orders?email=${email}&_t=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) return [];
  return response.json();
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingOrderId, setReviewingOrderId] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [confirmOrderId, setConfirmOrderId] = useState<number | null>(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchOrders = () => {
    if (user?.email) {
      getUserOrders(user.email).then(data => {
        setOrders(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleReceiveOrder = (orderId: number) => {
    setConfirmOrderId(orderId);
  };

  const handleConfirmReceive = async () => {
    if (!confirmOrderId) return;
    setIsUpdatingOrder(true);
    await updateOrderStatus(confirmOrderId, 'DELIVERED');
    setIsUpdatingOrder(false);
    setConfirmOrderId(null);
    fetchOrders();
  };

  const handleSubmitReview = async (orderId: number) => {
    if (!reviewText.trim()) return;
    setSubmittingReview(true);
    const res = await submitTestimonial(orderId, user!.email, reviewText, 5);
    setSubmittingReview(false);
    
    if (res.success) {
      setReviewingOrderId(null);
      setReviewText('');
      fetchOrders();
      setShowSuccessModal(true);
    } else {
      alert('Gagal mengirim testimoni.');
    }
  };

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const toggleExpandOrder = (orderId: number) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  if (!user) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
            <h1 className={styles.pageTitle}>Order History</h1>
            <p>Please login to view your order history.</p>
            <Link href="/login" className={styles.loginBtn}>Login Now</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <header className={styles.pageHeader}>
            <div className={styles.topBreadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>
                <span className="uppercase-spaced">Home</span>
              </Link>
              <span className={styles.separator}>{">"}</span>
              <span className="uppercase-spaced">My Orders</span>
            </div>
            <h1 className={styles.pageTitle}>Order History</h1>
            <p className={styles.subtitle}>Track your orders and view transaction details.</p>
          </header>

          {isLoading ? (
            <div className={styles.loading}>Loading your orders...</div>
          ) : orders.length > 0 ? (
            <div className={styles.orderList}>
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const totalQty = order.orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

                return (
                  <div key={order.id} className={`${styles.orderCard} ${isExpanded ? styles.cardExpanded : ''}`}>
                    {/* Collapsed Header / Row */}
                    <div 
                      className={styles.orderHeader} 
                      onClick={() => toggleExpandOrder(order.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.headerLeft}>
                        <span className={styles.orderId}>Order #{order.id}</span>
                        <span className={styles.orderDate}>
                          {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className={styles.headerRight}>
                        <span className={styles.orderSummaryText}>
                          {totalQty} Item • <strong>{order.totalAmount.toLocaleString('id-ID')} IDR</strong>
                        </span>
                        <div className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                          {STATUS_MAP[order.status] || order.status}
                        </div>
                        <span className={`${styles.arrowIcon} ${isExpanded ? styles.arrowUp : ''}`}>
                          ▼
                        </span>
                      </div>
                    </div>
                    
                    {/* Expandable Details Container */}
                    <div className={`${styles.detailsCollapse} ${isExpanded ? styles.showDetails : ''}`}>
                      <div className={styles.orderItems}>
                        <h4 className={styles.sectionTitle}>Rincian Produk</h4>
                        {order.orderItems.map((item: any) => (
                          <div key={item.id} className={styles.item}>
                            <div className={styles.itemDetails}>
                              <span className={styles.itemName}>{item.product.title}</span>
                              <span className={styles.itemMeta}>Size: {item.size} | Qty: {item.quantity} x {item.price.toLocaleString('id-ID')} IDR</span>
                            </div>
                            <span className={styles.itemPrice}>{`${(item.price * item.quantity).toLocaleString('id-ID')} IDR`}</span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.orderFooter}>
                        <div className={styles.totalRow}>
                          <span>Total Pembayaran</span>
                          <span className={styles.totalPrice}>{`${order.totalAmount.toLocaleString('id-ID')} IDR`}</span>
                        </div>
                        
                        <div className={styles.orderActions}>
                          {order.status !== 'CANCELLED' && order.status !== 'PENDING' && (
                            <Link 
                              href={`/orders/${order.id}/print`} 
                              target="_blank" 
                              className={styles.printBtn}
                            >
                              Cetak Kwitansi
                            </Link>
                          )}

                          {order.status === 'SHIPPED' && (
                            <button 
                              onClick={() => handleReceiveOrder(order.id)}
                              className={styles.receiveBtn}
                            >
                              Pesanan Diterima
                            </button>
                          )}

                          {order.status === 'DELIVERED' && !order.testimonial && reviewingOrderId !== order.id && (
                            <button 
                              onClick={() => setReviewingOrderId(order.id)}
                              className={styles.reviewBtn}
                            >
                              Tulis Testimoni
                            </button>
                          )}
                        </div>

                        {reviewingOrderId === order.id && (
                          <div className={styles.reviewForm}>
                            <p className={styles.reviewPrompt}>Bagaimana pendapat Anda tentang produk kami?</p>
                            <textarea 
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder="Contoh: Kualitas kain sangat bagus, pas di badan, jahitan rapi..."
                              className={styles.reviewInput}
                            />
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => { setReviewingOrderId(null); setReviewText(''); }}
                                className={styles.reviewCancelBtn}
                              >
                                Batal
                              </button>
                              <button 
                                onClick={() => handleSubmitReview(order.id)}
                                disabled={submittingReview || !reviewText.trim()}
                                className={styles.reviewSubmitBtn}
                              >
                                {submittingReview ? 'Mengirim...' : 'Kirim Testimoni'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>You haven't placed any orders yet.</p>
              <Link href="/shop" className={styles.shopBtn}>Start Shopping</Link>
            </div>
          )}
        </div>
      </main>
      {confirmOrderId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className={styles.modalTitle}>Konfirmasi Penerimaan</h3>
            <p className={styles.modalMessage}>Apakah Anda yakin sudah menerima pesanan ini dengan baik? Tindakan ini tidak dapat dibatalkan.</p>
            <div className={styles.modalActions}>
              <button 
                onClick={() => setConfirmOrderId(null)} 
                className={styles.cancelBtn}
                disabled={isUpdatingOrder}
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmReceive} 
                className={styles.confirmBtn}
                disabled={isUpdatingOrder}
              >
                {isUpdatingOrder ? 'Memproses...' : 'Ya, Sudah Diterima'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon} style={{ animation: 'bounceSuccess 1s ease-in-out' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className={styles.modalTitle}>Testimoni Terkirim!</h3>
            <p className={styles.modalMessage}>Terima kasih atas ulasan Anda. Testimoni Anda sangat berharga bagi peningkatan kualitas toko kami.</p>
            <button 
              onClick={() => setShowSuccessModal(false)} 
              className={styles.successDoneBtn}
            >
              Sama-sama
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
