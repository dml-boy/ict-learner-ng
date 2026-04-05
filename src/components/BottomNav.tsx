'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { LayoutDashboard, BookOpen, FlaskConical, Trophy } from 'lucide-react';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { href: '/student', label: 'Home', icon: LayoutDashboard },
  { href: '/student/modules', label: 'Modules', icon: BookOpen },
  { href: '/student/labs', label: 'Labs', icon: FlaskConical },
  { href: '/student/achievements', label: 'Stats', icon: Trophy },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={`${styles.container} glass-morphism`}>
      <div className={styles.inner}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/student' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
              <div className={styles.iconWrapper}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <ViewTransition share="active-nav-indicator">
                    <div className={styles.indicator} />
                  </ViewTransition>
                )}
              </div>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
