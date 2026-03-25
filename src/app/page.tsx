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

const testimonials = [
  {
    text: "Building real apps instead of just watching videos changed how I see ICT. I'm now building a project for my community!",
    author: "Chinyere O., SSS3 Student",
    image: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    text: "The 5E model makes complex networking concepts so easy to grasp. I love the 'Explore' stage!",
    author: "Abubakar M., ICT Club Leader",
    image: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    text: "I used to struggle with coding, but ICT Learner NG's project-first approach gave me the confidence I needed.",
    author: "Tunde A., SS2 Student",
    image: "https://randomuser.me/api/portraits/men/22.jpg"
  }
];

const fiveE = [
  { title: 'Engage', desc: 'We start with curiosity. Real-world Nigerian problems that demand digital solutions.', icon: '💡' },
  { title: 'Explore', desc: 'Hands-on first. Students dive into code and tools before the theory kicks in.', icon: '🔍' },
  { title: 'Explain', desc: 'Sense-making together. Peer-led discussions to clarify challenging ICT concepts.', icon: '🗣️' },
  { title: 'Elaborate', desc: 'Stretch the knowledge. Application of skills to new, complex project scenarios.', icon: '🚀' },
  { title: 'Evaluate', desc: 'Continuous mastery. Self and peer reflection backed by verifiable skill badges.', icon: '✅' },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen text-[#044331] font-['Outfit','Inter',system-ui,sans-serif]">
      
      {/* Header (Shorter Floating Bar with Round Bottom) */}
      <div className="sticky top-0 z-50 pointer-events-none">
        <header className={`max-w-[1000px] mx-auto bg-white py-1.5 px-8 rounded-b-[20px] flex items-center justify-between transition-all duration-300 pointer-events-auto border-x border-b border-slate-100 ${isScrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.08)]' : 'shadow-[0_4px_15px_rgba(0,0,0,0.04)]'}`}>
          <Link href="/" className="flex items-center no-underline">
            <Image src="/logosm.svg" alt="Logo" width={30} height={28} />
            <span className="text-[1.1rem] font-black text-[#044331] ml-2 tracking-tight whitespace-nowrap">ICT LEARNER NG</span>
          </Link>
          <nav className="hidden md:flex gap-8 nav-menu">
            {NAV_LINKS.map(l => (
              <Link key={l.path} href={l.path} className="no-underline text-slate-700 font-semibold text-[0.9rem] hover:text-[#044331] transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex gap-3 items-center">
            <Link href="/login" className="hidden md:block btn-outline-pill border-[1.5px] border-[#044331] text-[#044331] py-[0.45rem] px-[1.4rem] rounded-full font-bold text-[0.85rem] transition-all hover:bg-[#044331] hover:text-white">
              Login
            </Link>
            <Link href="/register/student" className="btn-fill-pill bg-[#044331] text-white py-2 px-[1.4rem] rounded-full font-bold text-[0.85rem] transition-all shadow-[0_4px_10px_rgba(4,67,49,0.15)] hover:-translate-y-px hover:shadow-[0_6px_15px_rgba(4,67,49,0.2)] hover:opacity-90">
              Signup
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-6 max-w-[1140px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-12 items-center">
          <div className="hero-text">
            <h1 className="text-[#044331] text-5xl md:text-[3.2rem] font-black leading-[1.1] mb-6">
              Learn, Share, Grow <br className="hidden md:block" /> together
            </h1>
            <p className="text-slate-500 text-[1.1rem] leading-relaxed mb-10 max-w-[540px]">
              ICT Learner NG is a project-powered platform where you share <br className="hidden lg:block"/>
              micro-courses, ask questions, and earn badges for learning together. <br className="hidden lg:block"/>
              Tailored for Nigerian students, by educators who care.
            </p>
            <Link href="/register/student" className="btn-fill-pill inline-block bg-[#044331] text-white py-3 px-9 rounded-full font-bold text-base transition-all shadow-[0_4px_10px_rgba(4,67,49,0.15)] hover:-translate-y-px hover:shadow-[0_6px_15px_rgba(4,67,49,0.2)] hover:opacity-90">
              Get Started
            </Link>
          </div>
          <div className="hero-image">
            <Image 
              src="/hero.jpg" 
              alt="Students Building Together" 
              width={600} 
              height={400} 
              className="w-full rounded-[24px] shadow-[0_20px_50px_rgba(4,67,49,0.12)]"
              priority
            />
          </div>
        </div>
      </section>

      {/* Main Product: The 5E Advantage */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-20">
            <span className="bg-emerald-50 text-emerald-600 py-2 px-5 rounded-full text-sm font-bold mb-6 inline-block">
              Our Pedagogical Core
            </span>
            <h2 className="text-4xl md:text-[2.8rem] font-black mb-4">The 5E Learning Advantage</h2>
            <p className="text-slate-500 text-[1.1rem] max-w-[600px] mx-auto">
              We don&apos;t just teach ICT; we help you construct knowledge through our specialized 5E constructivist model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {fiveE.map((step, i) => (
              <div key={step.title} className="bg-white p-8 md:px-6 py-10 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100 text-center transition-transform hover:-translate-y-2">
                <div className="text-[2.5rem] mb-6">{step.icon}</div>
                <h3 className="text-xl font-black mb-4">{i + 1}. {step.title}</h3>
                <p className="text-[0.95rem] text-slate-500 leading-relaxed m-0">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <h2 className="text-center text-[2.5rem] font-black mb-6">Platform Features</h2>
          <p className="text-center text-slate-500 mb-20 text-[1.1rem]">Built to facilitate collaborative, project-based mastery.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-12 rounded-[32px] border border-slate-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="h-[100px] bg-slate-100 rounded-2xl"></div>
                <div className="h-[100px] bg-emerald-50 rounded-2xl"></div>
                <div className="h-[100px] bg-amber-50 rounded-2xl"></div>
                <div className="h-[100px] bg-red-50 rounded-2xl"></div>
              </div>
              <h4 className="text-[1.4rem] font-black mb-3">Micro - Courses</h4>
              <p className="text-slate-500 leading-relaxed">Short, peer-to-peer created lessons for fast and practical knowledge sharing.</p>
            </div>

            <div className="bg-white p-12 rounded-[32px] border border-slate-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] relative">
              <div className="italic text-slate-800 mb-8 text-[1.1rem] leading-[1.7]">
                &quot;{testimonials[index].text}&quot;
              </div>
              <div className="flex items-center gap-4 border-b border-slate-100 pb-8 mb-8">
                <Image src={testimonials[index].image} alt="" width={45} height={45} className="rounded-full" />
                <div>
                   <div className="text-base font-black">{testimonials[index].author}</div>
                   <div className="text-[0.8rem] text-slate-500">Verified Student</div>
                </div>
              </div>
              <h4 className="text-[1.4rem] font-black mb-3">Q & A Threads</h4>
              <p className="text-slate-500 leading-relaxed">Get your technical hurdles resolved quickly by fellow students and mentors.</p>
            </div>

            <div className="bg-white p-12 rounded-[32px] border border-slate-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
              <div className="flex justify-center gap-4 my-8 mb-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-[70px] h-[70px] rounded-full flex items-center justify-center text-white text-2xl shadow-lg border-[2px] border-white/50 
                    ${i === 1 ? 'bg-amber-400 border-amber-300' : i === 2 ? 'bg-slate-300 border-slate-200' : 'bg-amber-700 border-amber-600'}`}>
                    ★
                  </div>
                ))}
              </div>
              <h4 className="text-[1.4rem] font-black mb-3">Badges & Awards</h4>
              <p className="text-slate-500 leading-relaxed">Every project completed and question answered earns you verifiable badges of expertise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#044331] text-white pt-24 pb-12 px-6">
        <div className="max-w-[1140px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 flex-wrap">
            <div className="col-span-1">
              <div className="text-[1.6rem] font-black mb-6">ICT LEARNER NG</div>
              <p className="opacity-60 leading-[1.8] max-w-[300px]">
                Empowering the next generation of Nigerian tech leaders through active, project-based learning and peer collaboration.
              </p>
            </div>
            <div>
              <h5 className="font-black mb-8">Quick Links</h5>
              <div className="flex flex-col gap-4">
                {['Home', 'About', 'Courses', 'Contact', 'Privacy Policy'].map(l => (
                  <Link key={l} href="#" className="text-white no-underline opacity-60 hover:opacity-100 transition-opacity">{l}</Link>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-black mb-8">Connect</h5>
              <div className="flex flex-col gap-4">
                <p className="opacity-60 m-0">hello@ictlearner.ng</p>
                <p className="opacity-60 m-0">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/10 text-center opacity-40 text-sm">
            © 2026 ICT Learner NG. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
