import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h4 className={styles.title}>Newsletter</h4>
          <p className={styles.text}>Sign up for exclusive updates, new arrivals & more.</p>
          <form className={styles.form}>
            <input type="email" placeholder="EMAIL ADDRESS" className={styles.input} />
            <button type="submit" className={styles.submit}>Subscribe</button>
          </form>
        </div>

        <div className={styles.column}>
          <h4 className={styles.title}>About</h4>
          <ul className={styles.list}>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Journal</a></li>
            <li><a href="#">Sustainability</a></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.title}>Legal</h4>
          <ul className={styles.list}>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.title}>Customer Care</h4>
          <ul className={styles.list}>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.socials}>
          <a href="#" className={styles.socialLink} aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span>Instagram</span>
          </a>
          <a href="#" className={styles.socialLink} aria-label="Shopee">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Shopee</span>
          </a>
          <a href="#" className={styles.socialLink} aria-label="Tokopedia">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span>Tokopedia</span>
          </a>
        </div>
        <p className={styles.copyright}>© 2025 DIJA STYLE. ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
};

export default Footer;
