'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './Sidebar.module.css';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  BookOpen, 
  FlaskConical, 
  Users, 
  Trophy, 
  Presentation, 
  Settings, 
  BarChart3 
} from 'lucide-react';

const STUDENT_NAV_ITEMS = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/modules', label: 'My Modules', icon: BookOpen },
  { href: '/student/labs', label: 'Virtual Labs', icon: FlaskConical },
  { href: '/student/community', label: 'Peer Learning', icon: Users },
  { href: '/student/achievements', label: 'Achievements', icon: Trophy },
];

const TEACHER_NAV_ITEMS = [
  { href: '/teacher', label: 'Teacher Hub', icon: LayoutDashboard },
  { href: '/teacher/analytics', label: 'Global Analytics', icon: BarChart3 },
  { href: '/teacher/settings', label: 'Platform Settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }: { 
  isOpen: boolean, 
  setIsOpen: (open: boolean) => void 
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role || 'student';
  const isTeacher = userRole === 'teacher';
  const navItemsToUse = isTeacher ? TEACHER_NAV_ITEMS : STUDENT_NAV_ITEMS;

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button 
        className={styles.closeBtn} 
        onClick={() => setIsOpen(false)}
        aria-label="Close Menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Image src="/logosm.svg" alt="ICT Learner NG" width={36} height={36} priority style={{ filter: 'brightness(0) invert(1)' }} />
        </div>
        <div className={styles.logoText}>
          <span className={styles.brandName}>ICT LEARNER</span>
          <span className={styles.brandSub}>NIGERIA</span>
        </div>
      </div>
      
      <nav className={styles.nav}>
        <div className={styles.navGroup}>
          <span className={styles.navLabel}>Main Menu</span>
          {navItemsToUse.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <div className={styles.icon}><IconComponent size={20} strokeWidth={isActive ? 3 : 2} /></div>
                <span className={styles.label}>{item.label}</span>
                {isActive && <div className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </div>

        {!isTeacher && (
          <div className={styles.navGroup} style={{ marginTop: '2rem' }}>
            <span className={styles.navLabel}>Resources</span>
            <Link href="/student/whiteboard" className={`${styles.navLink} ${pathname === '/student/whiteboard' ? styles.active : ''}`}>
              <div className={styles.icon}><Presentation size={20} strokeWidth={pathname === '/student/whiteboard' ? 3 : 2} /></div>
              <span className={styles.label}>Whiteboard</span>
            </Link>
            <Link href="/student/settings" className={`${styles.navLink} ${pathname === '/student/settings' ? styles.active : ''}`}>
              <div className={styles.icon}><Settings size={20} strokeWidth={pathname === '/student/settings' ? 3 : 2} /></div>
              <span className={styles.label}>Settings</span>
            </Link>
          </div>
        )}
      </nav>
      
      <div className={styles.footer}>
        <p className={styles.copyright}>© 2026 ICT Learner NG</p>
      </div>
    </aside>
  );
}
