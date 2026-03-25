import Link from 'next/link';
import styles from './Sidebar.module.css';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Image src="/logosm.svg" alt="ICT Learner NG" width={30} height={28} />
        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#044331', whiteSpace: 'nowrap' }}>ICT LEARNER NG</span>
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
