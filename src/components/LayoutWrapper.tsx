'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Providers from './Providers';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const prevPathname = useRef(pathname);

  // Only close sidebar when pathname actually CHANGES (not on initial render)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setSidebarOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    // Prevent body scroll when sidebar is open on mobile
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

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
    const timeoutId = setTimeout(observerTarget, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [pathname]);
  
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
        <main className="min-h-screen bg-background overflow-x-hidden">
          {children}
        </main>
      </Providers>
    );
  }

  return (
    <Providers>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Mobile/Tablet Backdrop — sits ABOVE content but BELOW sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] lg:hidden"
          style={{ backdropFilter: 'blur(2px)' }}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      <div className="min-h-screen flex flex-col bg-background lg:ml-[280px] overflow-x-hidden">
        <Navbar 
          toggleSidebar={() => setSidebarOpen(prev => !prev)} 
        />
        <main className="flex-1 mt-[70px] lg:mt-[90px] p-4 sm:p-8 lg:p-10 animate-fade-in relative">
          {children}
        </main>
      </div>
    </Providers>
  );
}
