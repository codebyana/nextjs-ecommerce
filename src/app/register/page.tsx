'use client';

import Link from 'next/link';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "../login/page.module.css"; // Reuse login styles

export default function RegisterPage() {
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
              <span className="uppercase-spaced">Register</span>
            </div>
            <h1 className={styles.pageTitle}>Create Account</h1>
          </header>

          <div className={styles.formWrapper}>
            <form className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="firstName" className={styles.label}>First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  className={styles.input} 
                  required 
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  className={styles.input} 
                  required 
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className={styles.input} 
                  required 
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  className={styles.input} 
                  required 
                />
              </div>

              <button type="submit" className={styles.submitBtn}>Create Account</button>
            </form>

            <div className={styles.footerLinks}>
              <p>Already have an account?</p>
              <Link href="/login" className={styles.link}>Back to Login</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
