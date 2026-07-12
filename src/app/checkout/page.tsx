'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';
import { INDONESIA_DATA } from '@/data/indonesia';
import { createOrder, uploadPaymentProof } from '@/actions/checkout';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location States
  const [selectedProvinceName, setSelectedProvinceName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  
  // Shipping States
  const [selectedMethod, setSelectedMethod] = useState('reg');

  // Payment States
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentMode, setPaymentMode] = useState('manual');

  useEffect(() => {
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPayments(data);
      });
  }, []);

  const provinces = INDONESIA_DATA;
  const availableCities = useMemo(() => {
    const prov = provinces.find(p => p.province === selectedProvinceName);
    return prov ? prov.cities : [];
  }, [selectedProvinceName]);

  const selectedCity = useMemo(() => {
    return availableCities.find(c => c.name === selectedCityName);
  }, [availableCities, selectedCityName]);

  const shippingFee = useMemo(() => {
    return selectedMethod === 'exp' ? 50000 : 20000;
  }, [selectedMethod]);

  const finalTotal = totalPrice + shippingFee;

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMode === 'otomatis') {
      alert('Fitur pembayaran otomatis belum tersedia saat ini. Silakan gunakan Transfer Manual.');
      return;
    }
    if (!file) {
      alert('Mohon unggah bukti transfer terlebih dahulu.');
      return;
    }
    if (!user) {
      alert('Silakan login terlebih dahulu untuk membuat pesanan.');
      return;
    }
    if (cart.length === 0) {
      alert('Keranjang belanja Anda kosong.');
      return;
    }
    if (!selectedProvinceName || !selectedCityName) {
      alert('Mohon lengkapi alamat pengiriman.');
      return;
    }

    setIsSubmitting(true);

    // Upload the file first
    const fileData = new FormData();
    fileData.append('file', file);
    const uploadRes = await uploadPaymentProof(fileData);
    if (!uploadRes.success || !uploadRes.url) {
      alert('Gagal mengunggah bukti transfer: ' + (uploadRes.message || 'Error tidak diketahui'));
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      userEmail: user.email,
      totalAmount: finalTotal,
      shippingAddress: `${selectedCityName}, ${selectedProvinceName}`, // Just a simple format for now
      city: selectedCityName,
      paymentProof: uploadRes.url,
      items: cart.map(item => ({
        productId: parseInt(item.id),
        quantity: item.quantity,
        price: parseInt(item.price.replace(/\D/g, '')),
        size: item.size || 'M'
      }))
    };

    const res = await createOrder(orderData);

    setIsSubmitting(false);

    if (res.success) {
      clearCart();
      setIsSuccess(true);
    } else {
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    }
  };

  if (isSuccess) {
    return (
      <>
        <Header />
        <main className={styles.successMain}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className={styles.successTitle}>Pesanan Berhasil</h1>
            <p className={styles.successMessage}>
              Terima kasih atas pesanan Anda. Kami akan segera memverifikasi bukti pembayaran Anda. 
              Konfirmasi akan dikirimkan melalui email segera.
            </p>
            <Link href="/" className={styles.backHomeBtn}>Kembali ke Home</Link>
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
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>Checkout</h1>
          </header>

          <div className={styles.layout}>
            <div className={styles.formColumn}>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>1. Informasi Pengiriman</h2>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Nama Depan</label>
                    <input type="text" placeholder="John" required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Nama Belakang</label>
                    <input type="text" placeholder="Doe" required />
                  </div>
                  <div className={styles.inputGroupFull}>
                    <label>Alamat Lengkap</label>
                    <input type="text" placeholder="Nama Jalan, No. Rumah, RT/RW, Kec, Kel" required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Provinsi</label>
                    <select 
                      value={selectedProvinceName} 
                      onChange={(e) => {
                        setSelectedProvinceName(e.target.value);
                        setSelectedCityName('');
                      }}
                      className={styles.select}
                    >
                      <option value="">Pilih Provinsi</option>
                      {provinces.map(p => (
                        <option key={p.province} value={p.province}>{p.province}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Kota / Kabupaten</label>
                    <select 
                      value={selectedCityName} 
                      onChange={(e) => setSelectedCityName(e.target.value)}
                      className={styles.select}
                      disabled={!selectedProvinceName}
                    >
                      <option value="">Pilih Kota</option>
                      {availableCities.map(city => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Kode Pos</label>
                    <input type="text" placeholder="12345" required />
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>2. Metode Pengiriman</h2>
                <div className={styles.shippingGrid}>
                  <label className={`${styles.shippingOption} ${selectedMethod === 'reg' ? styles.activeOption : ''}`}>
                    <input type="radio" checked={selectedMethod === 'reg'} onChange={() => setSelectedMethod('reg')} className={styles.radioInput} />
                    <div className={styles.shippingMeta}>
                      <span className={styles.methodName}>Regular Shipping (3-5 Hari)</span>
                      <span className={styles.methodPrice}>{formatIDR(20000)}</span>
                    </div>
                  </label>
                  <label className={`${styles.shippingOption} ${selectedMethod === 'exp' ? styles.activeOption : ''}`}>
                    <input type="radio" checked={selectedMethod === 'exp'} onChange={() => setSelectedMethod('exp')} className={styles.radioInput} />
                    <div className={styles.shippingMeta}>
                      <span className={styles.methodName}>Express Shipping (1-2 Hari)</span>
                      <span className={styles.methodPrice}>{formatIDR(50000)}</span>
                    </div>
                  </label>
                </div>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>3. Pembayaran</h2>
                
                <div className={styles.shippingGrid} style={{ marginBottom: '1.5rem' }}>
                  <label className={`${styles.shippingOption} ${paymentMode === 'manual' ? styles.activeOption : ''}`}>
                    <input type="radio" checked={paymentMode === 'manual'} onChange={() => setPaymentMode('manual')} className={styles.radioInput} />
                    <div className={styles.shippingMeta}>
                      <span className={styles.methodName}>Transfer Manual</span>
                      <span className={styles.methodPrice}>Verifikasi 1x24 Jam</span>
                    </div>
                  </label>
                  <label className={`${styles.shippingOption} ${paymentMode === 'otomatis' ? styles.activeOption : ''}`}>
                    <input type="radio" checked={paymentMode === 'otomatis'} onChange={() => setPaymentMode('otomatis')} className={styles.radioInput} />
                    <div className={styles.shippingMeta}>
                      <span className={styles.methodName}>Pembayaran Otomatis</span>
                      <span className={styles.methodPrice}>Virtual Account, E-Wallet</span>
                    </div>
                  </label>
                </div>

                {paymentMode === 'manual' ? (
                  <div className={styles.paymentInfo}>
                    {payments.length > 0 ? payments.map(payment => (
                      <div key={payment.id} className={styles.bankDetails}>
                        <p>Bank {payment.bankName}: <strong>{payment.accountNumber}</strong></p>
                        <p>Atas Nama: <strong>{payment.accountName}</strong></p>
                      </div>
                    )) : (
                      <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Loading payment methods...</p>
                    )}
                    <div className={styles.uploadSection}>
                      <label className={styles.uploadLabel}>
                        {file ? 'Ganti Bukti Transfer' : 'Unggah Bukti Transfer'}
                        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                      </label>
                      {file && <p className={styles.fileName}>File: {file.name}</p>}
                    </div>
                  </div>
                ) : (
                  <div className={styles.paymentInfo} style={{ backgroundColor: '#fff8f1', border: '1px solid #ffedd5', color: '#c2410c' }}>
                    <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Fitur Belum Tersedia ⚠️</p>
                    <p style={{ fontSize: '0.9rem' }}>Mohon maaf, sistem pembayaran otomatis (Payment Gateway) saat ini masih dalam tahap pengembangan. Silakan gunakan metode Transfer Manual untuk melanjutkan pesanan Anda.</p>
                  </div>
                )}
              </section>

              <button 
                className={styles.submitBtn} 
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Memproses...' : 'Buat Pesanan'}
              </button>
            </div>

            <div className={styles.summaryColumn}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Ringkasan Pesanan</h2>
                <div className={styles.totals}>
                  <div className={styles.totalRow}>
                    <span>Subtotal</span>
                    <span>{formatIDR(totalPrice)}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Ongkos Kirim</span>
                    <span>{selectedCity ? formatIDR(shippingFee) : '-'}</span>
                  </div>
                  <div className={styles.totalRowLarge}>
                    <span>Total Bayar</span>
                    <span>{formatIDR(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
