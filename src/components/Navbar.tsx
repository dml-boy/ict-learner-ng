'use client';
import { useSession } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
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
          ☰
        </button>
        
        <div className={styles.search}>
          <div className={styles.searchIcon}>🔍</div>
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
