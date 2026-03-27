'use client';

import LandingHeader from '@/components/LandingHeader';
import LandingFooter from '@/components/LandingFooter';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-[#044331] font-['Outfit','Inter',system-ui,sans-serif]">
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-24 px-6 max-w-[1140px] mx-auto text-center">
        <div className="reveal-up">
          <span className="bg-emerald-50 text-emerald-600 py-2 px-5 rounded-full text-sm font-bold mb-6 inline-block">
            Our Mission
          </span>
          <h1 className="text-5xl md:text-[4rem] font-black mb-8 leading-tight">
            Democratizing ICT <br /> Excellence in Nigeria
          </h1>
          <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
            ICT Learner NG is more than a platform; it's a movement to transition Nigerian education from rote memorization to active, project-based mastery using the 5E instructional model.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="reveal-up">
            <h2 className="text-4xl font-black mb-8">The 5E Philosophy</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Our approach is rooted in **Constructivism**. We believe that learners build their own knowledge by actively exploring and explaining their discoveries.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              Each module on our platform follows the Engage-Explore-Explain-Elaborate-Evaluate cycle, ensuring that students don't just "watch" but "build."
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl mb-4">🌍</div>
                <h4 className="font-bold mb-2">Local Context</h4>
                <p className="text-sm text-slate-500">Tailored for the Nigerian curriculum and industry needs.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-3xl mb-4">🤝</div>
                <h4 className="font-bold mb-2">Peer Learning</h4>
                <p className="text-sm text-slate-500">Collaborative threads and project-sharing at the core.</p>
              </div>
            </div>
          </div>
          <div className="relative reveal-up" style={{ transitionDelay: '0.2s' }}>
             <div className="absolute -inset-4 bg-emerald-200/20 rounded-[40px] blur-3xl -z-10"></div>
             <Image 
               src="/5e/explain.png" 
               alt="Collaboration" 
               width={600} 
               height={450} 
               className="rounded-[40px] shadow-2xl border-8 border-white"
             />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="max-w-[1140px] mx-auto text-center">
           <h2 className="text-4xl font-black mb-20 reveal-up">Our Core Values</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {[
               { title: "Transparency", icon: "💎", desc: "No gatekeeping. Knowledge should be accessible to every student from Lagos to Maiduguri." },
               { title: "Innovation", icon: "⚡", desc: "Using AI and state-of-the-art tooling to simplify complex technical hurdles." },
               { title: "Community", icon: "🏟️", desc: "Building a supportive ecosystem of Nigerian tech enthusiasts and mentors." }
             ].map((v, i) => (
               <div key={v.title} className="reveal-up" style={{ transitionDelay: `${i * 0.15}s` }}>
                 <div className="text-5xl mb-8">{v.icon}</div>
                 <h4 className="text-2xl font-black mb-4">{v.title}</h4>
                 <p className="text-slate-500 leading-relaxed">{v.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
