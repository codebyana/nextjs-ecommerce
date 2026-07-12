'use client';

import React, { useState, useEffect } from 'react';
import styles from './Testimonials.module.css';

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    quote: "Kualitas bajunya sangat memuaskan, potongannya rapi dan bahannya nyaman banget dipakai seharian. Pasti bakal order lagi!",
    author: "Nabila A.",
    role: "Verified Buyer",
    initial: "N"
  },
  {
    id: 2,
    quote: "Desainnya elegan dan modern. Pengiriman juga sangat cepat, package-nya aman. Sangat merekomendasikan Dija Style untuk belanja outfit.",
    author: "Bima S.",
    role: "Verified Buyer",
    initial: "B"
  },
  {
    id: 3,
    quote: "Pelayanan customer service luar biasa responsif. Saya sempat ragu pilih ukuran, tapi dibantu dengan ramah sampai akhirnya ukurannya pas banget di badan saya.",
    author: "Rina M.",
    role: "Verified Buyer",
    initial: "R"
  }
];

const Testimonials = ({ data }: { data?: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsVisible, setItemsVisible] = useState(3);
  const displayData = data && data.length > 0 ? data : DEFAULT_TESTIMONIALS;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setItemsVisible(1);
      else if (window.innerWidth <= 992) setItemsVisible(2);
      else setItemsVisible(3);
    };
    
    handleResize(); // initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (displayData.length <= itemsVisible) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (displayData.length - itemsVisible + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [displayData.length, itemsVisible]);

  const maxIndex = Math.max(0, displayData.length - itemsVisible);

  return (
    <section className={styles.testimonialsSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>What They Say</h2>
          <p className={styles.subtitle}>Ulasan dari pelanggan setia kami.</p>
        </div>
        
        <div className={styles.sliderContainer}>
          <div 
            className={styles.sliderTrack} 
            style={{ transform: `translateX(calc(-${currentIndex} * var(--slide-width)))` }}
          >
            {displayData.map((item) => (
              <div key={item.id} className={styles.slide}>
                <div className={styles.card}>
                  <div>
                    <div className={styles.stars}>★★★★★</div>
                    <p className={styles.quote}>{item.quote}</p>
                  </div>
                  
                  <div className={styles.author}>
                    <div className={styles.avatar}>{item.initial}</div>
                    <div className={styles.authorInfo}>
                      <span className={styles.authorName}>{item.author}</span>
                      <span className={styles.authorRole}>{item.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayData.length > itemsVisible && (
            <div className={styles.dots}>
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button 
                  key={idx} 
                  className={`${styles.dot} ${currentIndex === idx ? styles.activeDot : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
