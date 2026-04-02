'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import LiveEditor from '@/components/LiveEditor';
import Image from 'next/image';
import { Module, StudentProgress } from '@/types';

export default function StudentDashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || 'guest';
  const userName = session?.user?.name || 'Learner';

  useEffect(() => {
    if (userId === 'guest') return;
    setLoading(true);
    Promise.all([
      fetch('/api/modules').then((res) => res.json()),
      fetch(`/api/progress?userId=${userId}`).then((res) => res.json())
    ])
      .then(([modulesData, progressData]) => {
        if (modulesData.success) setModules(modulesData.data);
        if (progressData.success) setProgress(progressData.data);
      })
      .catch((err) => {
        console.error('[Student Dashboard] Neural uplink failure:', err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const getModuleStatus = (moduleId: string) => {
    const prog = progress.find((p) => {
      const mid = p.moduleId;
      return typeof mid === 'string' ? mid === moduleId : (mid as Module)?._id === moduleId;
    });
    return prog?.status || 'available';
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-16 md:py-32 mb-16 px-6 bg-[radial-gradient(circle_at_center,var(--primary-glow)_0%,transparent_70%)] overflow-hidden">
        <div className="animate-float mb-10 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-white/10 dark:bg-black/10 backdrop-blur-2xl rounded-[35%_65%_65%_35%_/_35%_35%_65%_65%] shadow-[0_25px_50px_var(--primary-glow)] border border-card-border overflow-hidden glossy-border">
          <Image src="/logosm.svg" alt="ICT Learner NG" width={80} height={70} className="w-12 h-12 md:w-20 md:h-20" priority />
        </div>
        <h1 className="gradient-text fluid-text-h1 mb-8 font-black leading-tight tracking-tight px-4 max-w-4xl mx-auto">
          Welcome, {userName}
        </h1>
        <p className="text-text-muted text-[clamp(1.1rem,2vw+0.5rem,1.35rem)] max-w-2xl font-semibold leading-relaxed mb-12">
          Step into your personalized constructivist learning environment. Forge your ICT expertise through active exploration and discovery.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={() => router.push('/student/modules')} className="btn btn-primary px-12 py-4.5 shadow-[0_15px_30px_var(--primary-glow)] group text-lg">
            Browse Courses <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
          </button>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline px-12 py-4.5 text-lg">
            Sign Out
          </button>
        </div>
      </section>

      {/* Progress Overview */}
      <div className="stat-grid mb-24 px-6 md:px-10">
        <div className="peak-card glossy-border text-center group">
          <h5 className="text-[0.8rem] text-text-muted uppercase tracking-[0.2em] font-black mb-4">Courses Available</h5>
          <div className="text-6xl font-black text-foreground mb-3 group-hover:scale-110 transition-transform">{modules.length}</div>
          <div className="text-[0.7rem] text-primary font-extrabold uppercase tracking-widest bg-primary/10 py-1.5 px-4 rounded-full inline-block">Global Curriculum</div>
        </div>
        <div className="peak-card glossy-border text-center group">
          <h5 className="text-[0.8rem] text-text-muted uppercase tracking-[0.2em] font-black mb-4">Mastered</h5>
          <div className="text-6xl font-black text-secondary mb-3 group-hover:scale-110 transition-transform">
            {progress.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-[0.7rem] text-secondary font-extrabold uppercase tracking-widest bg-secondary/10 py-1.5 px-4 rounded-full inline-block">Achievement Unlocked</div>
        </div>
        <div className="peak-card glossy-border text-center group">
          <h5 className="text-[0.8rem] text-text-muted uppercase tracking-[0.2em] font-black mb-4">In Progress</h5>
          <div className="text-6xl font-black text-primary-light mb-3 group-hover:scale-110 transition-transform">
            {modules.length - progress.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-[0.7rem] text-primary-light font-extrabold uppercase tracking-widest bg-primary-light/10 py-1.5 px-4 rounded-full inline-block">Active Evolution</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 px-8 lg:px-12 gap-8">
        <div className="text-center md:text-left">
          <h3 className="fluid-text-h2 font-black mb-3 flex items-center justify-center md:justify-start gap-4">
            <span className="text-primary animate-pulse">✦</span> My Course Catalog
          </h3>
          <p className="text-text-muted text-[clamp(1.1rem,1.5vw+0.5rem,1.25rem)] font-medium">Constructivist courses scaffolded for your cognitive growth.</p>
        </div>
        <div className="tag-nigeria px-8 py-3.5 text-[0.8rem] font-black border-2 border-primary/20 bg-primary/5">
          NIGERIA ICT CURRICULUM v2.5
        </div>
      </div>

      {/* Module List */}
      <div className="dashboard-grid px-8 lg:px-12 gap-8 cursor-default">
        {loading ? (
          <div className="peak-card glossy-border text-center text-text-muted col-span-full py-24 flex flex-col items-center justify-center gap-8">
            <div className="w-16 h-16 rounded-full border-[6px] border-primary-glow border-t-primary animate-spin"></div>
            <p className="font-black tracking-[0.3em] uppercase text-xs animate-pulse">Calibrating your learning universe...</p>
          </div>
        ) : modules.length > 0 ? (
          modules.map((mod) => {
            const status = getModuleStatus(mod._id);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in-progress';

            return (
              <div 
                key={mod._id} 
                className="peak-card glossy-border flex flex-col p-10 group cursor-pointer border-t-[3px] border-transparent hover:border-primary transition-all duration-500"
                onClick={() => router.push(`/student/learn/${mod._id}/intro`)}
              >
                <div className="flex justify-between items-start mb-10 translate-y-0 group-hover:-translate-y-1 transition-transform">
                  <div className="tag-nigeria text-[0.7rem] font-black uppercase tracking-widest bg-foreground/5 text-foreground border-transparent px-4 py-1.5">
                    {typeof mod.topicId === 'object' ? mod.topicId.title : 'ICT CORE INFRA'}
                  </div>
                  <div className={`text-2xl w-14 h-14 flex items-center justify-center rounded-2xl shadow-inner transition-all duration-500 ${isCompleted ? 'bg-secondary/15 rotate-[360deg]' : 'bg-primary-glow'}`}>
                    {isCompleted ? '🛡️' : isInProgress ? '⚡' : '🔮'}
                  </div>
                </div>
                
                <h4 className="text-2xl font-black mb-5 text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">
                  {mod.title}
                </h4>
                
                <p className="text-[0.95rem] text-text-muted mb-10 italic leading-relaxed flex-1 opacity-75 group-hover:opacity-100 transition-opacity line-clamp-3">
                  &quot;{mod.content.substring(0, 140)}{mod.content.length > 140 ? '...' : ''}&quot;
                </p>
                
                <div className="flex justify-between items-center mt-auto pt-8 border-t border-white/10 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] text-text-muted uppercase font-black tracking-[0.2em] mb-1.5 opacity-60">Sector Status</span>
                    <span className={`text-[0.95rem] font-black tracking-tight ${isCompleted ? 'text-secondary' : isInProgress ? 'text-primary' : 'text-text-muted opacity-50'}`}>
                      {isCompleted ? 'MASTERY ACHIEVED' : isInProgress ? 'ACTIVE UPLINK' : 'READY FOR INIT'}
                    </span>
                  </div>
                  <button 
                    className={`btn text-[0.85rem] px-6 py-3 font-black border-2 transition-all duration-300 ${isCompleted ? 'border-secondary/30 text-secondary hover:bg-secondary/10' : 'btn-primary border-transparent shadow-xl hover:shadow-primary-glow/50'}`}
                    onClick={e => { e.stopPropagation(); router.push(`/student/learn/${mod._id}/intro`); }}
                  >
                    {isCompleted ? 'Review Core' : isInProgress ? 'Resume Lab' : 'Initialize'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="peak-card glossy-border text-center text-text-muted col-span-full py-24">
            <p className="text-2xl font-black mb-8 tracking-tight">No courses broadcasted from the central server yet. 🛰️</p>
            <button className="btn btn-outline px-10" onClick={() => window.location.reload()}>Refresh Uplink</button>
          </div>
        )}
      </div>

      {/* Quick Lab Section */}
      <section className="peak-card glossy-border mx-6 md:mx-12 mt-24 md:mt-40 p-8 md:p-20 bg-gradient-to-br from-secondary/5 via-primary/5 to-transparent border-primary/15 relative overflow-hidden group">
        <div className="absolute -right-32 -top-32 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] group-hover:bg-secondary/20 transition-all duration-1000"></div>
        <div className="absolute -left-32 -bottom-32 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-1000"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14 mb-16 relative z-10">
          <div className="text-5xl md:text-6xl bg-white dark:bg-zinc-900 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-[2.5rem] shadow-2xl shadow-secondary/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shrink-0 glossy-border">🧪</div>
          <div className="text-center md:text-left transition-all duration-500 group-hover:translate-x-2">
            <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">The Constructivist Sandbox</h3>
            <p className="text-text-muted text-lg md:text-xl max-w-2xl font-medium leading-relaxed">Test your theories, build reactive components, and experiment in a high-fidelity environment designed for technical mastery.</p>
          </div>
        </div>
        
        <div className="relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.3)] rounded-[2rem] overflow-hidden border border-white/20 ring-[12px] ring-black/5 dark:ring-white/5 transition-transform duration-700 hover:scale-[1.01]">
          <div className="hidden lg:block">
            <LiveEditor />
          </div>
          <div className="lg:hidden p-16 md:p-24 text-center bg-background/60 backdrop-blur-3xl">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
              <span className="text-2xl animate-pulse">💻</span>
            </div>
            <p className="text-[0.7rem] font-black uppercase tracking-[0.4em] text-primary mb-6 animate-pulse">Neural Environment Constraint</p>
            <h4 className="text-2xl md:text-3xl font-black mb-6 tracking-tight">Desktop Interface Required</h4>
            <p className="text-base md:text-lg text-text-muted italic mb-10 max-w-md mx-auto leading-relaxed font-medium">The Constructivist Sandbox requires a multi-dimensional desktop terminal for complex code articulation and real-time synthesis.</p>
            <div className="tag-nigeria inline-block px-8 py-3 border-2 border-primary/30">Switch to Desktop terminal</div>
          </div>
        </div>
      </section>
    </div>
  );
}
