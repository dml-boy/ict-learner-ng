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
      <div style={{ marginLeft: '280px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ marginTop: '80px', padding: '2rem', flex: 1 }}>
          {children}
        </main>
      </div>
    </Providers>
  );
}
