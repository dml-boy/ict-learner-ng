import Link from 'next/link';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1 className="gradient-text">ICT Learner NG</h1>
        <span className="tag-nigeria">Nigeria</span>
      </div>
      
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          <span className={styles.icon}>🏠</span> Home
        </Link>
        <Link href="/teacher" className={styles.navLink}>
          <span className={styles.icon}>👨‍🏫</span> Teacher Dashboard
        </Link>
        <Link href="/student" className={styles.navLink}>
          <span className={styles.icon}>🎓</span> Student Dashboard
        </Link>
        <Link href="/whiteboard" className={styles.navLink}>
          <span className={styles.icon}>🎨</span> Interactive Whiteboard
        </Link>
      </nav>
      
      <div className={styles.footer}>
        <p>© 2026 ICT Learner NG</p>
      </div>
    </aside>
  );
}
