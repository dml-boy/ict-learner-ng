'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '/student', label: 'Dashboard', icon: '📊' },
  { href: '/student/modules', label: 'My Modules', icon: '📚' },
  { href: '/student/labs', label: 'Virtual Labs', icon: '🧪' },
  { href: '/student/community', label: 'Peer Learning', icon: '👥' },
  { href: '/student/achievements', label: 'Achievements', icon: '🏆' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Image src="/logosm.svg" alt="ICT Learner NG" width={32} height={32} />
        </div>
        <div className={styles.logoText}>
          <span className={styles.brandName}>ICT LEARNER</span>
          <span className={styles.brandSub}>NIGERIA</span>
        </div>
      </div>
      
      <nav className={styles.nav}>
        <div className={styles.navGroup}>
          <span className={styles.navLabel}>Main Menu</span>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
                {isActive && <div className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </div>

        <div className={styles.navGroup} style={{ marginTop: '2rem' }}>
          <span className={styles.navLabel}>Resources</span>
          <Link href="/student/whiteboard" className={styles.navLink}>
            <span className={styles.icon}>🎨</span>
            <span className={styles.label}>Whiteboard</span>
          </Link>
          <Link href="/student/settings" className={styles.navLink}>
            <span className={styles.icon}>⚙️</span>
            <span className={styles.label}>Settings</span>
          </Link>
        </div>
      </nav>
      
      <div className={styles.footer}>
        <div className={styles.helpCard}>
          <span style={{ fontSize: '1.2rem' }}>💡</span>
          <p>Need help with a module?</p>
          <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginTop: '0.5rem', width: '100%' }}>
            Ask AI Tutor
          </button>
        </div>
        <p className={styles.copyright}>© 2026 ICT Learner NG</p>
      </div>
    </aside>
  );
}
