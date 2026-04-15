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
    <div className="sticky top-4 mx-auto z-50 pointer-events-none px-6">
      <header className={`max-w-[1240px] mx-auto py-4 px-10 rounded-[28px] flex items-center justify-between transition-all duration-500 pointer-events-auto glass-panel glossy-border ${isScrolled ? 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] scale-[0.98]' : 'shadow-xl'}`}>
        <Link href="/" className="flex items-center gap-4 no-underline group">
          <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl glossy-border group-hover:rotate-12 transition-transform duration-500">
            <Image src="/logosm.svg" alt="Logo" width={40} height={36} className="w-7 h-7" />
          </div>
          <span className="text-[1.2rem] font-black gradient-text tracking-tighter whitespace-nowrap uppercase group-hover:opacity-80 transition-opacity">ICT LEARNER NG</span>
        </Link>
        <nav className="hidden lg:flex gap-10 nav-menu">
          {NAV_LINKS.map(l => (
            <Link key={l.path} href={l.path} className="no-underline text-text-muted font-black text-[0.85rem] uppercase tracking-widest hover:text-primary hover:scale-110 transition-all duration-300">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-6 items-center">
          <Link href="/student" className="hidden md:inline-block font-black text-[0.9rem] text-foreground uppercase tracking-widest hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/student" className="btn btn-primary px-8 py-3 rounded-2xl text-[0.9rem] font-black uppercase tracking-widest shadow-xl hover:shadow-primary-glow/50">
            Sign Up
          </Link>
        </div>
      </header>
    </div>
  );
}
