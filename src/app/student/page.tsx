'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import LiveEditor from '@/components/LiveEditor';
import { Module, StudentProgress, LeaderboardEntry } from '@/types';
import { Skeleton } from 'boneyard-js/react';

export default function StudentDashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([] as LeaderboardEntry[]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || 'guest';
  const userName = session?.user?.name || 'Learner';

  useEffect(() => {
    let isMounted = true;
    
    if (userId === 'guest') {
      // Defer to avoid synchronous setState warning in effect
      Promise.resolve().then(() => {
        if (isMounted) setLoading(false);
      });
      return;
    }
    
    Promise.all([
      fetch('/api/modules').then((res) => res.json()),
      fetch(`/api/progress?userId=${userId}`).then((res) => res.json()),
      fetch('/api/leaderboard').then((res) => res.json())
    ])
      .then(([modulesData, progressData, leaderboardData]) => {
        if (!isMounted) return;
        if (modulesData.success) setModules(modulesData.data);
        if (progressData.success) setProgress(progressData.data);
        if (leaderboardData.success) setLeaderboard(leaderboardData.data);
      })
      .catch((err) => {
        console.error('[Student Dashboard] Neural uplink failure:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [userId]);

  const getModuleStatus = (moduleId: string) => {
    const prog = progress.find((p) => {
      const mid = p.moduleId;
      return typeof mid === 'string' ? mid === moduleId : (mid as Module)?._id === moduleId;
    });
    return prog?.status || 'available';
  };

  const stats = [
    { label: 'Available', value: modules.length, icon: '📂' },
    { label: 'Mastered', value: progress.filter((p: StudentProgress) => p.status === 'completed').length, icon: '🛡️' },
    { label: 'In Orbit', value: modules.length - progress.filter((p: StudentProgress) => p.status === 'completed').length, icon: '🚀' },
  ];

  return (
    <Skeleton name="student-dashboard" loading={loading}>
      <div className="animate-fade-in px-4 sm:px-8 lg:px-12 pb-32">
      {/* Standardized Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 mb-12 animate-fade-in-down">
        <div className="flex gap-5 items-center">
          <div className="shrink-0 w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-card-border animate-float">
            <Image src="/logosm.svg" alt="ICT Learner NG" width={40} height={35} priority />
          </div>
          <div>
            <h2 className="text-4xl font-black text-primary mb-1 tracking-tighter">Welcome back, <span className="text-foreground">{userName}</span></h2>
            <p className="text-text-muted font-bold text-sm opacity-60">Forge your ICT expertise through discovery.</p>
          </div>
        </div>
        
        {/* Sync Status - Glass Morphic Panel */}
        <div className="flex items-center gap-6 glass-morphism p-3 px-6 rounded-2xl ml-auto lg:ml-0">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 bg-secondary rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="text-right sm:text-left">
            <p className="text-[0.6rem] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5 opacity-50">Neural Uplink</p>
            <p className="font-black text-sm text-primary tracking-tight">Stable & Synchronized</p>
          </div>
        </div>
      </div>

      <div className="main-content-layout">
        <div className="flex flex-col gap-12">
          {/* Progress Overview Grid - Synchronized Typography */}
          <div className="stat-grid animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="peak-card p-8 bg-white border-none shadow-sm text-center group">
                <div className="text-5xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform tracking-tighter tabular-nums">
                  {stat.value}
                </div>
                <div className="text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] opacity-50 flex items-center justify-center gap-2">
                  <span className="text-lg opacity-100 group-hover:rotate-12 transition-transform">{stat.icon}</span> {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-2xl font-black text-primary flex items-center gap-4">
                <span className="w-10 h-1 bg-primary rounded-full"></span>
                Course Catalog
              </h3>
              <p className="text-text-muted font-medium ml-14">Scaffolded modules for cognitive growth.</p>
            </div>
          </div>

          {/* Module List Grid */}
          <div className="dashboard-grid animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {modules.map((mod: Module) => {
              const status = getModuleStatus(mod._id);
              const isCompleted = status === 'completed';
              const isInProgress = status === 'in-progress';

              return (
                <div 
                  key={mod._id} 
                  className="peak-card flex flex-col p-10 group cursor-pointer hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 glossy-border"
                  onClick={() => router.push(`/student/learn/${mod._id}/intro`)}
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="tag-nigeria text-[0.7rem] font-black uppercase tracking-widest">
                      {typeof mod.topicId === 'object' ? mod.topicId.title.substring(0, 15) : 'CORE ICT'}
                    </div>
                    <div className={`text-2xl w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-700 ${isCompleted ? 'bg-secondary/10 rotate-[360deg]' : 'bg-primary-glow group-hover:bg-primary/20'}`}>
                      {isCompleted ? '🛡️' : isInProgress ? '⚡' : '🔮'}
                    </div>
                  </div>
                  <h4 className="text-2xl font-black mb-4 text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">
                    {mod.title}
                  </h4>
                  <p className="text-sm text-text-muted mb-10 italic leading-relaxed flex-1 opacity-80 line-clamp-2">
                     &quot;{mod.content.substring(0, 100)}...&quot;
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-8 border-t border-primary/5">
                    <div className="flex flex-col">
                      <span className={`text-[0.65rem] font-black tracking-[0.2em] uppercase ${isCompleted ? 'text-secondary' : isInProgress ? 'text-primary' : 'text-text-muted opacity-40'}`}>
                        {isCompleted ? 'MASTERY' : isInProgress ? 'UPLINK' : 'READY'}
                      </span>
                      <span className="text-[0.6rem] font-bold text-text-muted/40 mt-1 uppercase">Phase 1.0</span>
                    </div>
                    <button className="btn btn-primary text-[0.75rem] px-6 py-3 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
                      {isCompleted ? 'Review' : 'Start'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights Column */}
        <aside className="insights-panel animate-fade-in-right" style={{ animationDelay: '0.4s' }}>
          <div className="peak-card p-8 bg-card-bg border-none shadow-none mb-8">
            <h4 className="text-lg font-black mb-6 flex items-center gap-3 text-primary">
              <span className="text-2xl">👥</span> Top Learners
            </h4>
            <div className="flex flex-col gap-6">
              {leaderboard.length === 0 ? (
                <p className="text-text-muted text-sm italic font-medium">No activity detected yet. Be the first to initiate an uplink!</p>
              ) : (
                leaderboard.slice(0, 3).map((learner: LeaderboardEntry, i: number) => (
                  <div key={i} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-primary text-sm shadow-sm transition-transform group-hover:scale-110 shrink-0">
                      {learner.name ? learner.name[0] : 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {learner.name || 'Anonymous Learner'} 
                        <span className="font-medium text-text-muted text-xs block mt-0.5">
                          mastered {learner.totalCompleted} modules
                        </span>
                      </p>
                      <p className="text-[0.7rem] text-text-muted font-black opacity-50 uppercase tracking-wider mt-1">
                        {learner.completionRate > 0 ? `${Math.round(learner.completionRate)}% Sync Rate` : 'Initializing'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/student/achievements" className="btn btn-outline w-full mt-8 text-[0.7rem] py-3 border-primary/10 hover:bg-primary hover:text-white hover:border-primary transition-all">🏆 View Full Leaderboard</Link>
          </div>
        </aside>
      </div>

      {/* Constructivist Sandbox — Tablet + Desktop */}
      <section className="peak-card mx-0 mt-20 p-8 md:p-16 bg-white border-none shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="text-6xl bg-card-bg w-24 h-24 flex items-center justify-center rounded-[2rem] shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">🧪</div>
          <div>
            <h3 className="text-2xl md:text-4xl font-black mb-3 tracking-tighter text-primary">The Constructivist Sandbox</h3>
            <p className="text-text-muted text-base md:text-lg max-w-2xl font-medium leading-relaxed">Experiment live — write HTML, CSS & JS and see results instantly.</p>
          </div>
        </div>
        {/* Show on tablet (md) and desktop — hidden only on mobile */}
        <div className="hidden md:block rounded-3xl overflow-hidden border border-card-border shadow-lg">
          <LiveEditor />
        </div>
        <div className="md:hidden p-12 text-center bg-background rounded-2xl border border-card-border">
          <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-primary mb-4 animate-pulse">Tablet / Desktop Required</p>
          <h4 className="text-xl font-black mb-3">Open on a larger screen</h4>
          <p className="text-text-muted text-sm font-medium">The live code editor needs at least a tablet-size screen to function properly.</p>
        </div>
      </section>
    </div>
    </Skeleton>
  );
}
