'use client';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import styles from './Navbar.module.css';

// Map of route prefixes → display label for the breadcrumb
const ROUTE_LABELS: Record<string, string> = {
  '/student':              'Dashboard',
  '/student/modules':      'My Modules',
  '/student/labs':         'Virtual Labs',
  '/student/community':    'Peer Learning',
  '/student/achievements': 'Achievements',
  '/student/whiteboard':   'Whiteboard',
  '/student/settings':     'Settings',
  '/teacher':              'Teacher Hub',
  '/teacher/analytics':    'Global Analytics',
  '/teacher/settings':     'Platform Settings',
};

function getBreadcrumb(pathname: string): string {
  // Try exact match first, then prefix match (longest first)
  if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
  const match = Object.keys(ROUTE_LABELS)
    .filter(k => pathname.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0];
  return match ? ROUTE_LABELS[match] : '';
}

export default function Navbar({ 
  toggleSidebar
}: { 
  toggleSidebar: () => void
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userName = session?.user?.name || 'Guest User';
  const userRole = (session?.user as { role?: string })?.role || 'Visitor';
  const initial = userName.charAt(0).toUpperCase();
  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        {/* Hamburger - hidden on lg+ */}
        <button 
          className={styles.menuBtn} 
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="2" rx="1" fill="currentColor"/>
            <rect y="5" width="14" height="2" rx="1" fill="currentColor"/>
            <rect y="10" width="18" height="2" rx="1" fill="currentColor"/>
          </svg>
        </button>

        {/* Breadcrumb pill — shown on sm+ */}
        {breadcrumb && (
          <div className={styles.breadcrumb} aria-label={`Current section: ${breadcrumb}`}>
            <span className={styles.breadcrumbDot} />
            {breadcrumb}
          </div>
        )}
        
        {/* Search — hidden on mobile */}
        <div className={styles.search}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search modules, topics..." className={styles.searchInput} />
        </div>
      </div>
      
      <div className={styles.actions}>
        {/* Notification bell */}
        <button className={styles.bellBtn} aria-label="Notifications">
          <Bell size={18} strokeWidth={2} />
          <span className={styles.bellBadge} aria-hidden="true" />
        </button>

        {/* User chip */}
        <div className={styles.user}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{userName}</p>
            <p className={styles.userRole}>Verified Identity</p>
          </div>
        </div>
      </div>
    </header>
  );
}
