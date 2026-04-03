'use client';
import { useSession } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar({ 
  toggleSidebar
}: { 
  toggleSidebar: () => void
}) {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Guest User';
  const userRole = (session?.user as { role?: string })?.role || 'Visitor';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
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
        
        <div className={styles.search}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search modules, topics..." className={styles.searchInput} />
        </div>
      </div>
      
      <div className={styles.actions}>
        <div className={styles.user}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{userName}</p>
            <p className={styles.userRole}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)} Account</p>
          </div>
        </div>
      </div>
    </header>
  );
}
