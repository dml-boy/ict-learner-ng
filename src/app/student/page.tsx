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
      <section className="relative flex flex-col items-center justify-center text-center py-24 mb-16 px-4 bg-[radial-gradient(circle_at_center,var(--primary-glow)_0%,transparent_70%)] overflow-hidden">
        <div className="animate-float mb-8 w-28 h-28 flex items-center justify-center bg-white/80 backdrop-blur-xl rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] shadow-[0_20px_40px_var(--primary-glow)] border border-card-border overflow-hidden">
          <Image src="/logosm.svg" alt="ICT Learner NG" width={70} height={65} priority />
        </div>
        <h1 className="gradient-text text-5xl md:text-7xl mb-6 font-black leading-tight tracking-tight">
          Welcome, {userName}
        </h1>
        <p className="text-text-muted text-lg md:text-xl max-w-2xl font-medium leading-relaxed mb-10">
          Step into your personalized constructivist learning environment. Forge your ICT expertise through active exploration and discovery.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => router.push('/student/modules')} className="btn btn-primary px-10 py-4 shadow-[0_10px_20px_var(--primary-glow)] group">
            Browse Courses <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline px-10 py-4">
            Sign Out
          </button>
        </div>
      </section>

      {/* Progress Overview */}
      <div className="stat-grid mb-20 px-4">
        <div className="peak-card text-center group translate-y-0 hover:-translate-y-2 transition-all duration-300">
          <h5 className="text-[0.75rem] text-text-muted uppercase tracking-widest font-black mb-3">Courses Available</h5>
          <div className="text-5xl font-black text-foreground mb-2">{modules.length}</div>
          <div className="text-[0.65rem] text-primary font-bold uppercase tracking-wider bg-primary/10 py-1 px-3 rounded-full inline-block">Global Curriculum</div>
        </div>
        <div className="peak-card text-center group translate-y-0 hover:-translate-y-2 transition-all duration-300">
          <h5 className="text-[0.75rem] text-text-muted uppercase tracking-widest font-black mb-3">Mastered</h5>
          <div className="text-5xl font-black text-secondary mb-2">
            {progress.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-[0.65rem] text-secondary font-bold uppercase tracking-wider bg-secondary/10 py-1 px-3 rounded-full inline-block">Achievement Unlocked</div>
        </div>
        <div className="peak-card text-center group translate-y-0 hover:-translate-y-2 transition-all duration-300">
          <h5 className="text-[0.75rem] text-text-muted uppercase tracking-widest font-black mb-3">In Progress</h5>
          <div className="text-5xl font-black text-primary-light mb-2">
            {modules.length - progress.filter(p => p.status === 'completed').length}
          </div>
          <div className="text-[0.65rem] text-primary-light font-bold uppercase tracking-wider bg-primary-light/10 py-1 px-3 rounded-full inline-block">Active Evolution</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 px-6 gap-6">
        <div>
          <h3 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
            <span className="text-primary animate-pulse">✦</span> My Course Catalog
          </h3>
          <p className="text-text-muted text-base md:text-lg">Constructivist courses scaffolded for your cognitive growth.</p>
        </div>
        <div className="tag-nigeria px-6 py-2.5 text-[0.75rem] font-black border-2">
          NIGERIA ICT CURRICULUM v2.5
        </div>
      </div>

      {/* Module List */}
      <div className="dashboard-grid px-6">
        {loading ? (
          <div className="peak-card text-center text-text-muted col-span-full py-20 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 rounded-full border-4 border-primary-glow border-t-primary animate-spin"></div>
            <p className="font-extrabold tracking-widest uppercase text-xs">Calibrating your learning universe...</p>
          </div>
        ) : modules.length > 0 ? (
          modules.map((mod) => {
            const status = getModuleStatus(mod._id);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in-progress';

            return (
              <div 
                key={mod._id} 
                className="peak-card flex flex-col p-8 group translate-y-0 hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer border-t-2 border-transparent hover:border-primary-glow"
                onClick={() => router.push(`/student/learn/${mod._id}/intro`)}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="tag-nigeria text-[0.65rem] font-black uppercase tracking-tighter bg-foreground/5 text-foreground border-transparent">
                    {typeof mod.topicId === 'object' ? mod.topicId.title : 'ICT CORE INFRA'}
                  </div>
                  <div className={`text-xl w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm transition-all duration-300 ${isCompleted ? 'bg-secondary/10 shadow-secondary/20' : 'bg-primary-glow shadow-primary-glow/20'}`}>
                    {isCompleted ? '🛡️' : isInProgress ? '⚡' : '🔮'}
                  </div>
                </div>
                
                <h4 className="text-2xl font-black mb-4 text-foreground group-hover:text-primary transition-colors leading-tight">
                  {mod.title}
                </h4>
                
                <p className="text-sm text-text-muted mb-8 italic leading-relaxed flex-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  &quot;{mod.content.substring(0, 140)}{mod.content.length > 140 ? '...' : ''}&quot;
                </p>
                
                <div className="flex justify-between items-center mt-auto pt-6 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-[0.6rem] text-text-muted uppercase font-black tracking-widest mb-1">Sector Status</span>
                    <span className={`text-[0.9rem] font-extrabold ${isCompleted ? 'text-secondary' : isInProgress ? 'text-primary' : 'text-text-muted opacity-50'}`}>
                      {isCompleted ? 'MASTERY ACHIEVED' : isInProgress ? 'ACTIVE UPLINK' : 'READY FOR INIT'}
                    </span>
                  </div>
                  <button 
                    className={`btn text-[0.8rem] px-5 py-2.5 border-2 ${isCompleted ? 'btn-outline border-secondary/20 text-secondary' : 'btn-primary shadow-lg border-transparent'}`}
                    onClick={e => { e.stopPropagation(); router.push(`/student/learn/${mod._id}/intro`); }}
                  >
                    {isCompleted ? 'Review Core' : isInProgress ? 'Resume Lab' : 'Initialize'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="peak-card text-center text-text-muted col-span-full py-20">
            <p className="text-xl font-black mb-6 tracking-tight">No courses broadcasted from the central server yet. 🛰️</p>
            <button className="btn btn-outline" onClick={() => window.location.reload()}>Refresh Uplink</button>
          </div>
        )}
      </div>

      {/* Quick Lab Section */}
      <section className="peak-card mx-6 mt-32 p-8 md:p-16 bg-gradient-to-br from-secondary/5 via-primary/5 to-transparent border-primary/10 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-all duration-700"></div>
        <div className="flex flex-col md:flex-row items-center gap-10 mb-12 relative z-10">
          <div className="text-5xl bg-white w-24 h-24 flex items-center justify-center rounded-3xl shadow-xl shadow-secondary/10 group-hover:scale-110 transition-transform duration-500">🧪</div>
          <div className="text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black mb-3">The Constructivist Sandbox</h3>
            <p className="text-text-muted text-lg max-w-xl">Test your theories, build reactive components, and experiment in a high-fidelity, zero-risk neural lab environment.</p>
          </div>
        </div>
        <div className="relative z-10 shadow-2xl rounded-2xl overflow-hidden border border-white/10 ring-8 ring-black/5">
          <LiveEditor />
        </div>
      </section>
    </div>
  );
}
