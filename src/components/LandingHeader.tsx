'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/courses', label: 'Courses' },
  { path: '/contact', label: 'Contact' },
];

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-4 mx-auto z-50 pointer-events-none px-4 md:px-6">
      <header className={`max-w-[1240px] mx-auto py-3 md:py-4 px-4 md:px-10 rounded-2xl md:rounded-[28px] flex items-center justify-between transition-all duration-500 pointer-events-auto glass-panel glossy-border ${isScrolled ? 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] scale-[0.98]' : 'shadow-xl'}`}>
        <Link href="/" className="flex items-center gap-3 md:gap-4 no-underline group">
          <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/10 rounded-lg md:rounded-xl glossy-border group-hover:rotate-12 transition-transform duration-500">
            <Image src="/logosm.svg" alt="Logo" width={40} height={36} className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <span className="text-[1rem] md:text-[1.2rem] font-black gradient-text tracking-tighter whitespace-nowrap uppercase group-hover:opacity-80 transition-opacity">
            <span className="hidden sm:inline">ICT LEARNER NG</span>
            <span className="sm:hidden">ICT LEARNER</span>
          </span>
        </Link>
        <nav className="hidden lg:flex gap-10 nav-menu">
          {NAV_LINKS.map(l => (
            <Link key={l.path} href={l.path} className="no-underline text-text-muted font-black text-[0.85rem] uppercase tracking-widest hover:text-primary hover:scale-110 transition-all duration-300">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-4 md:gap-6 items-center">
          <Link href="/student" className="hidden md:inline-block font-black text-[0.9rem] text-foreground uppercase tracking-widest hover:text-primary transition-colors">
            Portal
          </Link>
          <Link href="/student" className="btn btn-primary px-5 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[0.7rem] md:text-[0.9rem] font-black uppercase tracking-widest shadow-xl hover:shadow-primary-glow/50">
            Launch
          </Link>
        </div>
      </header>
    </div>
  );
}
