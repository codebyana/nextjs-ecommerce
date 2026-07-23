'use client';

import { use, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getOrderById } from '@/actions/order';
import styles from './page.module.css';
import Link from 'next/link';

export default function PrintOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = parseInt(resolvedParams.id, 10);
  const { user } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId, user.email);
        if (res.success && res.order) {
          setOrder(res.order);
        } else {
          setError(res.error || 'Gagal memuat data pesanan.');
        }
      } catch (err) {
        console.error(err);
        setError('Terjadi kesalahan saat mengambil data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId]);

  // Handle case where user is not logged in after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user && loading) {
        setLoading(false);
        setError('Silakan login terlebih dahulu untuk mengakses halaman ini.');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [user, loading]);

  useEffect(() => {
    if (order) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [order]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Memuat data kwitansi...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.errorContainer}>
        <h1>Akses Ditolak / Terjadi Kesalahan</h1>
        <p>{error || 'Pesanan tidak ditemukan.'}</p>
        <Link href="/orders" className={styles.backBtn}>Kembali ke Riwayat Pesanan</Link>
      </div>
    );
  }

  const totalQty = order.orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  return (
    <div className={styles.invoiceWrapper}>
      {/* Print Controls - Hidden during print */}
      <div className={styles.printActionHeader}>
        <Link href="/orders" className={styles.backLink}>
          ← Kembali ke Pesanan
        </Link>
        <button onClick={() => window.print()} className={styles.printButton}>
          Cetak Kwitansi (PDF)
        </button>
      </div>

      {/* Invoice Document */}
      <div className={styles.invoiceContainer}>
        {/* Header */}
        <div className={styles.invoiceHeader}>
          <div className={styles.brandSection}>
            <h1 className={styles.brandName}>DIJA<span>STYLE</span></h1>
            <p className={styles.brandTagline}>Koleksi Busana Premium & Modern</p>
          </div>
          <div className={styles.titleSection}>
            <h2 className={styles.invoiceTitle}>KWITANSI PEMBELIAN</h2>
            <div className={styles.metaGrid}>
              <div>No. Kwitansi:</div>
              <div><strong>#INV-{order.id}</strong></div>
              <div>Tanggal:</div>
              <div>{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div>Status:</div>
              <div>
                <span className={`${styles.statusLabel} ${styles[order.status.toLowerCase()]}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Info Section */}
        <div className={styles.infoSection}>
          <div className={styles.infoCol}>
            <h3>Diterbitkan Oleh:</h3>
            <p><strong>DIJA STYLE</strong></p>
            <p>Jl. Jend. Sudirman, Tj. Raya</p>
            <p>Kota Bandar Lampung, Lampung</p>
            <p>Email: support@dijastyle.com</p>
          </div>
          <div className={styles.infoCol}>
            <h3>Ditagihkan Kepada:</h3>
            <p><strong>{order.user.firstName} {order.user.lastName}</strong></p>
            <p>{order.user.email}</p>
            <div className={styles.shippingDetails}>
              <p><strong>Alamat Pengiriman:</strong></p>
              <p>{order.shippingAddress}</p>
              <p>{order.city}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th className={styles.colNum}>No.</th>
              <th className={styles.colDesc}>Nama Produk</th>
              <th className={styles.colSize}>Ukuran</th>
              <th className={styles.colQty}>Qty</th>
              <th className={styles.colPrice}>Harga Satuan</th>
              <th className={styles.colTotal}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item: any, idx: number) => (
              <tr key={item.id}>
                <td className={styles.colNum}>{idx + 1}</td>
                <td className={styles.colDesc}>
                  <strong>{item.product.title}</strong>
                </td>
                <td className={styles.colSize}>{item.size}</td>
                <td className={styles.colQty}>{item.quantity}</td>
                <td className={styles.colPrice}>{item.price.toLocaleString('id-ID')} IDR</td>
                <td className={styles.colTotal}>{(item.price * item.quantity).toLocaleString('id-ID')} IDR</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className={styles.summaryContainer}>
          <div className={styles.paymentInfo}>
            <h3>Metode Pembayaran</h3>
            <p>Transfer Bank (Konfirmasi Otomatis)</p>
            <div className={styles.thankYouNote}>
              <p>Terima kasih telah berbelanja di toko kami!</p>
              <p>Jika ada pertanyaan mengenai kwitansi ini, silakan hubungi Customer Service kami.</p>
            </div>
          </div>
          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span>Subtotal Items ({totalQty} Qty):</span>
              <span>{order.totalAmount.toLocaleString('id-ID')} IDR</span>
            </div>
            <div className={styles.totalRow}>
              <span>Biaya Pengiriman:</span>
              <span>0 IDR (Gratis Ongkir)</span>
            </div>
            <hr className={styles.subDivider} />
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total Pembayaran:</span>
              <span>{order.totalAmount.toLocaleString('id-ID')} IDR</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.invoiceFooter}>
          <p>Kwitansi ini sah dan diterbitkan secara komputerisasi oleh sistem DIJA STYLE.</p>
          <p>© {new Date().getFullYear()} DIJA STYLE. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
