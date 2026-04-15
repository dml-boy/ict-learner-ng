'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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
  BarChart3,
  LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/student',              label: 'Dashboard',    icon: LayoutDashboard, exact: true },
  { href: '/student/modules',      label: 'My Modules',   icon: BookOpen },
  { href: '/teacher',              label: 'Synthesize AI', icon: FlaskConical },
  { href: '/teacher/analytics',    label: 'Global Analytics', icon: BarChart3 },
  { href: '/student/community',    label: 'Peer Learning',icon: Users },
  { href: '/student/achievements', label: 'Achievements', icon: Trophy },
];

const RESOURCE_ITEMS = [
  { href: '/student/whiteboard', label: 'Whiteboard', icon: Presentation },
  { href: '/student/settings',   label: 'Settings',   icon: Settings },
];

function isNavActive(href: string, pathname: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

export default function Sidebar({ isOpen, setIsOpen }: { 
  isOpen: boolean, 
  setIsOpen: (open: boolean) => void 
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Neural Learner';
  const initial = userName.charAt(0).toUpperCase();

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
        {/* Main nav group */}
        <div className={styles.navGroup}>
          <span className={styles.navLabel}>Main Menu</span>
          {NAV_ITEMS.map((item, i) => {
            const active = isNavActive(item.href, pathname, item.exact);
            const IconComponent = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`${styles.navLink} ${active ? styles.active : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={styles.iconWrap}>
                  <IconComponent size={18} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span className={styles.label}>{item.label}</span>
                {active && <div className={styles.activeBar} />}
              </Link>
            );
          })}
        </div>

        {/* Resources group */}
        <div className={styles.navGroup}>
          <span className={styles.navLabel}>Resources</span>
          {RESOURCE_ITEMS.map((item, i) => {
            const active = isNavActive(item.href, pathname);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.active : ''}`}
                style={{ animationDelay: `${(NAV_ITEMS.length + i) * 0.05}s` }}
              >
                <div className={styles.iconWrap}>
                  <IconComponent size={18} strokeWidth={active ? 2.5 : 1.8} />
                </div>
                <span className={styles.label}>{item.label}</span>
                {active && <div className={styles.activeBar} />}
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Footer: user chip */}
      <div className={styles.footer}>
        <div className={styles.userChip}>
          <div className={styles.chipAvatar}>{initial}</div>
          <div className={styles.chipInfo}>
            <span className={styles.chipName}>{userName}</span>
            <span className={styles.chipRole}>Verified Identity</span>
          </div>
        </div>
        <p className={styles.copyright}>© 2026 ICT Learner NG</p>
      </div>
    </aside>
  );
}
    </aside>
  );
}
