'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset link
    setIsSubmitted(true);
  };

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
              <Link href="/login" className={styles.breadcrumbLink}>
                <span className="uppercase-spaced">Login</span>
              </Link>
              <span className={styles.separator}>{">"}</span>
              <span className="uppercase-spaced">Reset Password</span>
            </div>
            <h1 className={styles.pageTitle}>Reset Password</h1>
          </header>

          <div className={styles.formWrapper}>
            {!isSubmitted ? (
              <>
                <p className={styles.instruction}>
                  Enter your email address below. We'll send you a link to reset your password.
                </p>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.input} 
                      required 
                      placeholder="name@example.com"
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn}>Send Reset Link</button>
                </form>
              </>
            ) : (
              <div className={styles.successState}>
                <div className={styles.successIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h2 className={styles.successTitle}>Email Sent</h2>
                <p className={styles.successMessage}>
                  If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                </p>
                <Link href="/login" className={styles.backBtn}>Back to Login</Link>
              </div>
            )}

            <div className={styles.footerLinks}>
              <p>Remember your password?</p>
              <Link href="/login" className={styles.link}>Back to Login</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
