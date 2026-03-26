'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Providers from './Providers';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Public routes that don't need sidebar/navbar
  const isPublicRoute = pathname === '/' || 
                        pathname.startsWith('/login') || 
                        pathname.startsWith('/register') || 
                        pathname.startsWith('/verify-email');

  if (isPublicRoute) {
    return (
      <Providers>
        <main style={{ minHeight: '100vh' }}>
          {children}
        </main>
      </Providers>
    );
  }

  return (
    <Providers>
      <Sidebar />
      <div style={{ marginLeft: '280px', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
        <Navbar />
        <main style={{ 
          marginTop: '90px', 
          padding: '4rem', 
          flex: 1,
          animation: 'fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards'
        }}>
          {children}
        </main>
      </div>
    </Providers>
  );
}
