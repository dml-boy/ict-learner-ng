'use client';

import LandingHeader from '@/components/LandingHeader';
import LandingFooter from '@/components/LandingFooter';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen text-[#044331] font-['Outfit','Inter',system-ui,sans-serif]">
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-24 px-6 max-w-[1140px] mx-auto text-center">
        <div className="reveal-up">
          <span className="bg-emerald-50 text-emerald-600 py-2 px-5 rounded-full text-sm font-bold mb-6 inline-block">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-[4rem] font-black mb-8 leading-tight">
            Let's Collaborate <br /> on ICT Excellence
          </h1>
          <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed">
            Have questions about our curriculum or want to partner with us to bring 5E mastery to your institution? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-[1.5fr,1fr] gap-16">
          <div className="bg-white p-12 rounded-[48px] shadow-2xl shadow-emerald-900/5 reveal-up overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-bl-[100px] -z-10"></div>
             <form className="flex flex-col gap-8">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="flex flex-col gap-3">
                   <label htmlFor="name" className="text-sm font-black uppercase tracking-widest opacity-60">Full Name</label>
                   <input 
                     type="text" 
                     id="name" 
                     placeholder="Chinyere Okoro" 
                     className="bg-slate-50 border-0 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                   />
                 </div>
                 <div className="flex flex-col gap-3">
                   <label htmlFor="email" className="text-sm font-black uppercase tracking-widest opacity-60">Email Address</label>
                   <input 
                     type="email" 
                     id="email" 
                     placeholder="chinyere@example.com" 
                     className="bg-slate-50 border-0 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                   />
                 </div>
               </div>
               <div className="flex flex-col gap-3">
                 <label htmlFor="subject" className="text-sm font-black uppercase tracking-widest opacity-60">Subject</label>
                 <select id="subject" className="bg-slate-50 border-0 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer">
                   <option>General Inquiry</option>
                   <option>Partnership Proposal</option>
                   <option>Technical Support</option>
                   <option>Institutional Deployment</option>
                 </select>
               </div>
               <div className="flex flex-col gap-3">
                 <label htmlFor="message" className="text-sm font-black uppercase tracking-widest opacity-60">Message</label>
                 <textarea 
                   id="message" 
                   rows={6} 
                   placeholder="How can we help you flourish?" 
                   className="bg-slate-50 border-0 p-6 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                 />
               </div>
               <button className="bg-[#044331] text-white py-4 px-12 rounded-full font-black text-lg transition-all shadow-[0_4px_10px_rgba(4,67,49,0.15)] hover:-translate-y-px hover:shadow-[0_6px_15px_rgba(4,67,49,0.3)] hover:opacity-95">
                 Send Message
               </button>
             </form>
          </div>

          <div className="flex flex-col gap-12 py-8 reveal-up" style={{ transitionDelay: '0.2s' }}>
            <div>
              <h4 className="text-2xl font-black mb-6">Our Location</h4>
              <p className="text-slate-500 leading-relaxed mb-4">
                Lagos Innovation Hub,<br />
                Yaba, Lagos State,<br />
                Nigeria.
              </p>
            </div>
            <div>
              <h4 className="text-2xl font-black mb-6">Direct Connect</h4>
              <div className="flex flex-col gap-4 text-slate-500">
                <p className="m-0 flex items-center gap-3"><span className="text-lg">📧</span> hello@ictlearner.ng</p>
                <p className="m-0 flex items-center gap-3"><span className="text-lg">📞</span> +234 (0) 800-ICT-LEARNER</p>
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-black mb-6">Social Pulse</h4>
              <div className="flex gap-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer">
                     #
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
