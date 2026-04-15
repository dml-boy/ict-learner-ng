'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LandingHeader from '@/components/LandingHeader';
import LandingFooter from '@/components/LandingFooter';

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

const FIVE_E_DATA = [
  { title: 'Engage', desc: 'Nigerian digital citizenship begins with a spark. We use real-world scenarios—like analyzing local cyber-safety trends—to hook curiosity and connect to prior digital experiences.', icon: '💡', image: '/5e/engage.png', detail: 'Critical Thinking & Hooking' },
  { title: 'Explore', desc: 'Hands-on discovery before definitions. Students investigate block-based coding puzzles or hardware simulations, building mental bridges through active play.', icon: '🔍', image: '/5e/explore.png', detail: 'Inquiry & Discovery Labs' },
  { title: 'Explain', desc: 'Bridging discovery to formal theory. We introduce mental models, algorithms, and logic gates only after students have encountered their need in practice.', icon: '📖', image: '/5e/explain.png', detail: 'Concept Formalization' },
  { title: 'Elaborate', desc: 'Applying skills to new domains. Students translate their technical knowledge into community projects, such as public service awareness apps or local utility tools.', icon: '🚀', image: '/5e/elaborate.png', detail: 'Knowledge Transfer' },
  { title: 'Evaluate', desc: 'Mastery check through reflection. Verifiable skill badges and constructivist portfolios provide a transparent record of a student’s technical growth.', icon: '✅', image: '/5e/evaluate.png', detail: 'Assessment & Feedback' },
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen text-[#044331] font-['Outfit','Inter',system-ui,sans-serif]">
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-24 px-6 max-w-[1140px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-12 items-center">
          <div className="hero-text reveal-up">
            <h1 className="text-[#044331] text-5xl md:text-[3.2rem] font-black leading-[1.1] mb-6">
              Learn, Share, Grow <br className="hidden md:block" /> together
            </h1>
            <p className="text-slate-500 text-[1.1rem] leading-relaxed mb-10 max-w-[540px]">
              ICT Learner NG is a project-powered platform where you share <br className="hidden lg:block"/>
              micro-courses, ask questions, and earn badges for learning together. <br className="hidden lg:block"/>
              Tailored for Nigerian students, by educators who care.
            </p>
            <Link href="/student" className="btn-fill-pill inline-block bg-[#044331] text-white py-3 px-9 rounded-full font-bold text-base transition-all shadow-[0_4px_10px_rgba(4,67,49,0.15)] hover:-translate-y-px hover:shadow-[0_6px_15px_rgba(4,67,49,0.2)] hover:opacity-90 tracking-wide">
              Get Started
            </Link>
          </div>
          <div className="hero-image reveal-up" style={{ transitionDelay: '0.2s' }}>
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

      {/* Main Product: The 5E Journey */}
      <section className="py-32 px-6 bg-slate-50 overflow-hidden">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-32 reveal-up">
            <span className="bg-emerald-50 text-emerald-600 py-2 px-5 rounded-full text-sm font-bold mb-6 inline-block">
              Institutional Framework
            </span>
            <h2 className="text-4xl md:text-[3.2rem] font-black mb-4">The 5E Learning Journey</h2>
            <p className="text-slate-500 text-[1.2rem] max-w-[700px] mx-auto">
              Our pedagogical core is built on the constructivist principle that learners construct knowledge by actively engaging with ideas and the real world.
            </p>
          </div>

          <div className="flex flex-col gap-32">
            {FIVE_E_DATA.map((step, i) => (
              <div 
                key={step.title} 
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center reveal-up`}
              >
                <div className="flex-1 w-full relative">
                  <div className="absolute -inset-4 bg-emerald-100/30 rounded-[32px] blur-2xl -z-10 group-hover:bg-emerald-200/40 transition-all"></div>
                  <Image 
                    src={step.image} 
                    alt={step.title} 
                    width={550} 
                    height={380} 
                    className="w-full h-auto rounded-[32px] shadow-2xl border border-white hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute -bottom-6 -right-6 md:right-12 bg-[#044331] text-white p-6 rounded-2xl shadow-xl hidden lg:block">
                     <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{step.detail}</div>
                     <div className="text-lg font-black">{step.icon} Phase 0{i+1}</div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="text-[5rem] font-black text-emerald-50 leading-none mb-4">0{i + 1}</div>
                  <h3 className="text-3xl font-black mb-6 text-[#044331]">
                    {step.title}
                  </h3>
                  <div className="h-1 w-20 bg-emerald-500 mb-8 rounded-full"></div>
                  <p className="text-[1.15rem] text-slate-600 leading-[1.8] mb-8">
                    {step.desc}
                  </p>
                  <Link href="/student" className="text-[#044331] font-bold no-underline flex items-center gap-2 group">
                    Start learning with {step.title} 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scientific Foundation */}
      <section className="py-24 px-6 reveal-up">
        <div className="max-w-[1140px] mx-auto bg-gradient-to-br from-[#044331] to-[#065f46] rounded-[48px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <div className="absolute -top-12 -right-12 w-64 h-64 border-[40px] border-white rounded-full"></div>
            <div className="absolute top-1/2 -right-24 w-48 h-48 border-[20px] border-emerald-400 rounded-full"></div>
          </div>
          
          <div className="max-w-2xl relative z-10">
            <span className="text-emerald-300 font-black uppercase tracking-[0.2em] text-xs mb-4 block">The Pedagogical Core</span>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Founded on the Science of Constructivism</h2>
            <p className="text-emerald-50/80 text-lg leading-relaxed mb-10">
              Unlike traditional rote learning, our platform is engineered around **Constructivist Theory**. We believe students learn ICT best when they build their own &quot;Mental Models&quot; through discovery, scaffolding, and reflection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">🧠</span> Active Schema
                </h4>
                <p className="text-sm opacity-70">Learners connect new ICT concepts to their existing real-world knowledge in the Nigerian context.</p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">🧱</span> Scaffolding
                </h4>
                <p className="text-sm opacity-70">Guided exploration ensures students are challenged without being overwhelmed, fostering &quot;Flow State&quot; mastery.</p>
              </div>
            </div>
            <Link href="/about" className="inline-flex items-center gap-3 bg-white text-[#044331] px-8 py-4 rounded-full font-black hover:bg-emerald-50 transition-colors">
              Explore Research Papers <span className="text-xl">📄</span>
            </Link>
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

      <LandingFooter />
    </div>
  );
}
