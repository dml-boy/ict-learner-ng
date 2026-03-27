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
    <div className="sticky top-0 mx-auto z-50 pointer-events-none">
      <header className={`max-w-[1000px] mx-auto py-3 bg-white px-8 rounded-b-[20px] flex items-center justify-between transition-all duration-300 pointer-events-auto border-x border-b border-slate-100 ${isScrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.08)]' : 'shadow-[0_4px_15px_rgba(0,0,0,0.04)]'}`}>
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image src="/logosm.svg" alt="Logo" width={34} height={31} />
          <span className="text-[1.1rem] font-black text-[#044331] tracking-tight whitespace-nowrap uppercase">ICT LEARNER NG</span>
        </Link>
        <nav className="hidden md:flex gap-8 nav-menu">
          {NAV_LINKS.map(l => (
            <Link key={l.path} href={l.path} className="no-underline text-slate-700 font-semibold text-[0.9rem] hover:text-[#044331] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="hidden md:inline-block border-[2px] border-[#044331] text-[#044331] py-2 px-6 rounded-full font-bold text-[0.95rem] transition-all hover:bg-[#044331] hover:text-white">
            Login
          </Link>
          <Link href="/register/student" className="inline-block bg-[#044331] text-white py-2 px-6 rounded-full font-bold text-[0.95rem] transition-all shadow-[0_4px_10px_rgba(4,67,49,0.15)] hover:-translate-y-px hover:shadow-[0_6px_15px_rgba(4,67,49,0.2)] hover:opacity-90">
            Signup 
          </Link>
        </div>
      </header>
    </div>
  );
}
