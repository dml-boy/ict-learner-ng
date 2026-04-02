'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Providers from './Providers';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on pathname change (mobile navigation)
  useEffect(() => {
    if (sidebarOpen) {
      // Use setTimeout to avoid synchronous setState during effect to prevent cascading renders
      const timer = setTimeout(() => setSidebarOpen(false), 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, sidebarOpen]);

  useEffect(() => {
    // Global Scroll Reveal Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.1 });

    const observerTarget = () => {
      document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
    };

    observerTarget();
    
    // Re-run on pathname change to catch new elements
    const timeoutId = setTimeout(observerTarget, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [pathname]);
  
  // Public routes that don't need sidebar/navbar
  const isPublicRoute = pathname === '/' || 
                        pathname.startsWith('/about') || 
                        pathname.startsWith('/contact') || 
                        pathname.startsWith('/courses') || 
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
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen flex flex-col bg-background transition-all duration-300 lg:ml-[280px]">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 mt-[70px] lg:mt-[90px] p-4 sm:p-8 lg:p-16 animate-fade-in">
          {children}
        </main>
      </div>
    </Providers>
  );
}
