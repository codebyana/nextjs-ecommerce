'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

import { loginAction } from '@/actions/auth';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await loginAction(email, password);
      
      if (result.success && result.user) {
        login(result.user.email, result.user.firstName, result.user.lastName, result.user.role as 'USER' | 'ADMIN');
        
        if (result.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push(redirectPath);
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              <span className="uppercase-spaced">Login</span>
            </div>
            <h1 className={styles.pageTitle}>Login</h1>
          </header>

          <div className={styles.formWrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div className={styles.errorMessage}>{error}</div>}
              
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
                  disabled={isLoading}
                />
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <Link href="/forgot-password" className={styles.forgotLink}>Forgot Password?</Link>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input} 
                  required 
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className={styles.footerLinks}>
              <p>Don't have an account?</p>
              <Link href="/register" className={styles.link}>Create Account</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

