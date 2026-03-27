import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-[#044331] text-white pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-[1140px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 flex-wrap">
          <div className="col-span-1">
            <div className="text-[1.6rem] font-black mb-6 uppercase tracking-tight">ICT LEARNER NG</div>
            <p className="opacity-60 leading-[1.8] max-w-[300px]">
              Empowering the next generation of Nigerian tech leaders through active, project-based learning and peer collaboration.
            </p>
          </div>
          <div>
            <h5 className="font-black mb-8 uppercase tracking-[0.2em] text-xs">Quick Links</h5>
            <div className="flex flex-col gap-4">
              {['Home', 'About', 'Courses', 'Contact', 'Privacy Policy'].map(l => (
                <Link key={l} href="#" className="text-white no-underline opacity-60 hover:opacity-100 transition-opacity">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-black mb-8 uppercase tracking-[0.2em] text-xs">Connect</h5>
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
  );
}
