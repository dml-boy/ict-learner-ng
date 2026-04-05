'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import SubjectsTab from './components/SubjectsTab';
import TopicsTab from './components/TopicsTab';
import ModulesTab from './components/ModulesTab';
import { Subject, Topic, Module } from '@/types';
import { Zap, Plus, FolderPlus, BellRing } from 'lucide-react';
import { ViewTransition } from 'react';
import { Skeleton } from 'boneyard-js/react';

interface ActivityLog {
  _id?: string;
  time: string;
  user: string;
  event: string;
  moduleTitle: string;
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const teacherId = (session?.user as { id?: string })?.id;
  const teacherName = session?.user?.name || 'Teacher';

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<'subjects' | 'topics' | 'modules'>('subjects');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!teacherId) return;
    try {
      const [resSub, resTop, resMod, resAnalytics] = await Promise.all([
        fetch(`/api/subjects?teacherId=${teacherId}`),
        fetch(`/api/topics?teacherId=${teacherId}`),
        fetch(`/api/modules?teacherId=${teacherId}`),
        fetch(`/api/analytics`)
      ]);
      const [subData, topData, modData, analyticsData] = await Promise.all([
        resSub.json(), resTop.json(), resMod.json(), resAnalytics.json()
      ]);
      
      if (subData.success) setSubjects(subData.data);
      if (topData.success) setTopics(topData.data);
      if (modData.success) setModules(modData.data);
      if (analyticsData.success) setRecentActivity(analyticsData.data.recentActivity || []);
    } catch (err) {
      console.error('Failed to fetch teacher content:', err);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Skeleton name="teacher-dashboard" loading={loading}>
      <div className="animate-fade-in pb-32 px-4 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 mb-12 animate-fade-in-down">
          <div className="flex gap-5 items-center">
            <div className="shrink-0 w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-card-border animate-float">
              <Image src="/logosm.svg" alt="ICT Learner NG" width={40} height={35} priority />
            </div>
            <div>
              <h2 className="text-4xl font-black text-primary mb-1 tracking-tighter">Teacher Hub</h2>
              <p className="text-text-muted font-bold text-sm opacity-60">Architecting the next generation of ICT excellence.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-white p-3 rounded-2xl border border-card-border shadow-sm ml-auto lg:ml-0">
            <div className="hidden sm:block text-right">
              <p className="text-[0.6rem] text-text-muted uppercase tracking-[0.2em] font-black mb-0.5 opacity-50">Authenticated Architect</p>
              <p className="font-black text-lg text-foreground tracking-tight">{teacherName}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline border-primary/20 px-6 py-2.5 text-[0.75rem] font-black">
              Sign Out
            </button>
          </div>
        </div>

        <div className="main-content-layout">
          {/* Main Management Sector */}
          <div className="flex flex-col gap-10">
            {/* Stat Overview */}
            <div className="stat-grid animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="peak-card p-8 bg-white border-none shadow-sm text-center group">
                <div className="text-5xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform tracking-tighter">{subjects.length}</div>
                <div className="text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] opacity-50">Sectors</div>
              </div>
              <div className="peak-card p-8 bg-white border-none shadow-sm text-center group">
                <div className="text-5xl font-black text-primary mb-2 group-hover:scale-110 transition-transform tracking-tighter">{topics.length}</div>
                <div className="text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] opacity-50">Clusters</div>
              </div>
              <div className="peak-card p-8 bg-white border-none shadow-sm text-center group">
                <div className="text-5xl font-black text-secondary mb-2 group-hover:scale-110 transition-transform tracking-tighter">{modules.length}</div>
                <div className="text-[0.65rem] font-black text-text-muted uppercase tracking-[0.2em] opacity-50">Blueprints</div>
              </div>
            </div>

            {/* Tab Management */}
            <div className="flex flex-col gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="tabs-container p-1.5 glass-morphism rounded-2xl flex gap-2 relative">
                <button 
                  className={`tab-btn flex-1 px-6 py-3.5 text-[0.7rem] uppercase tracking-widest font-black rounded-xl transition-all relative z-10 ${activeTab === 'subjects' ? 'text-primary' : 'text-text-muted hover:bg-white/10'}`}
                  onClick={() => setActiveTab('subjects')}
                >
                  📂 Sectors
                  {activeTab === 'subjects' && (
                    <ViewTransition share="active-tab-pill">
                      <div className="absolute inset-0 bg-white rounded-xl shadow-sm z-[-1]" />
                    </ViewTransition>
                  )}
                </button>
                <button 
                  className={`tab-btn flex-1 px-6 py-3.5 text-[0.7rem] uppercase tracking-widest font-black rounded-xl transition-all relative z-10 ${activeTab === 'topics' ? 'text-primary' : 'text-text-muted hover:bg-white/10'}`}
                  onClick={() => setActiveTab('topics')}
                >
                  📚 Clusters
                  {activeTab === 'topics' && (
                    <ViewTransition share="active-tab-pill">
                      <div className="absolute inset-0 bg-white rounded-xl shadow-sm z-[-1]" />
                    </ViewTransition>
                  )}
                </button>
                <button 
                  className={`tab-btn flex-1 px-6 py-3.5 text-[0.7rem] uppercase tracking-widest font-black rounded-xl transition-all relative z-10 ${activeTab === 'modules' ? 'text-primary' : 'text-text-muted hover:bg-white/10'}`}
                  onClick={() => setActiveTab('modules')}
                >
                  ✨ Blueprints
                  {activeTab === 'modules' && (
                    <ViewTransition share="active-tab-pill">
                      <div className="absolute inset-0 bg-white rounded-xl shadow-sm z-[-1]" />
                    </ViewTransition>
                  )}
                </button>
              </div>

              <div className="animate-fade-in">
                {activeTab === 'subjects' && <SubjectsTab subjects={subjects} setSubjects={setSubjects} />}
                {activeTab === 'topics' && <TopicsTab topics={topics} setTopics={setTopics} subjects={subjects} />}
                {activeTab === 'modules' && <ModulesTab modules={modules} setModules={setModules} topics={topics} subjects={subjects} />}
              </div>
            </div>
          </div>

          {/* Management Insights Column */}
          <aside className="insights-panel animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
            <div className="peak-card p-8 bg-card-bg border-none shadow-none mb-8">
              <h4 className="text-lg font-black mb-6 flex items-center gap-3 text-primary">
                <Zap size={24} className="text-secondary" /> Quick Actions
              </h4>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setActiveTab('modules')} 
                  className="btn btn-primary w-full py-4 text-[0.75rem] font-black uppercase tracking-widest gap-4 shadow-lg shadow-primary/20 flex items-center justify-center"
                >
                  <Plus size={20} /> Create New Module
                </button>
                <button 
                  onClick={() => setActiveTab('subjects')}
                  className="btn btn-outline hover:bg-white bg-white w-full py-4 text-[0.75rem] font-black uppercase tracking-widest gap-4 border-primary/10 flex items-center justify-center"
                >
                  <FolderPlus size={18} className="text-primary" /> Design New Sector
                </button>
              </div>
            </div>

            <div className="peak-card p-8 bg-white border border-card-border shadow-sm mb-8">
              <h4 className="text-lg font-black mb-6 flex items-center gap-3 text-secondary">
                <BellRing size={22} className="text-amber-500" /> Global Activity
              </h4>
              <div className="flex flex-col gap-6">
                {recentActivity.length === 0 ? (
                  <p className="text-xs font-bold text-text-muted italic">No recent student activity detected on your modules.</p>
                ) : (
                  recentActivity.map((log: ActivityLog, i: number) => {
                    const date = new Date(log.time);
                    const timeAgo = Math.round((new Date().getTime() - date.getTime()) / 60000);
                    const timeDisplay = timeAgo < 60 ? `${timeAgo}m ago` : timeAgo < 1440 ? `${Math.floor(timeAgo/60)}h ago` : `${Math.floor(timeAgo/1440)}d ago`;
                    return (
                      <div key={log._id || i} className="flex gap-4 items-start group">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-sm shadow-sm transition-transform group-hover:scale-110 shrink-0">
                          {log.user[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {log.user} <span className="font-medium text-text-muted text-[0.75rem] block mt-0.5">{log.event}: {log.moduleTitle}</span>
                          </p>
                          <p className="text-[0.65rem] text-text-muted font-black opacity-50 uppercase tracking-wider mt-1">{timeDisplay}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="peak-card p-8 bg-primary text-white border-none shadow-xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:scale-110 transition-transform">🧠</div>
              <h4 className="text-lg font-black mb-4 relative z-10 text-white">AI Constructor Matrix</h4>
              <p className="text-sm font-medium opacity-90 mb-8 relative z-10 leading-relaxed text-white">
                &quot;Analysis indicates your students are highly engaged with Binary Logic. Generating advanced follow-up activities is recommended to capitalize on current cognitive momentum.&quot;
              </p>
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/10 relative z-10 uppercase tracking-widest text-[0.65rem] font-bold">
                 <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                 Neural Network Active
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Skeleton>
  );
}
