'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import SubjectsTab from './components/SubjectsTab';
import TopicsTab from './components/TopicsTab';
import ModulesTab from './components/ModulesTab';
import { Subject, Topic, Module } from '@/types';

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const teacherId = (session?.user as { id?: string })?.id;
  const teacherName = session?.user?.name || 'Teacher';

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeTab, setActiveTab] = useState<'subjects' | 'topics' | 'modules'>('subjects');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!teacherId) return;
    try {
      const [resSub, resTop, resMod] = await Promise.all([
        fetch(`/api/subjects?teacherId=${teacherId}`),
        fetch(`/api/topics?teacherId=${teacherId}`),
        fetch(`/api/modules?teacherId=${teacherId}`)
      ]);
      const [subData, topData, modData] = await Promise.all([resSub.json(), resTop.json(), resMod.json()]);
      
      if (subData.success) setSubjects(subData.data);
      if (topData.success) setTopics(topData.data);
      if (modData.success) setModules(modData.data);
    } catch (err) {
      console.error('Failed to fetch teacher content:', err);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <div className="w-12 h-12 border-4 border-primary-glow border-t-primary rounded-full animate-spin" />
        <p className="text-text-muted font-bold text-sm">Synchronizing your academic sector...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-32 px-6 sm:px-10">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-10 mb-16 md:mb-24 px-2">
        <div className="flex gap-6 items-center">
          <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white/10 dark:bg-black/10 backdrop-blur-2xl rounded-2xl shadow-xl border border-primary-glow animate-float glossy-border">
            <Image src="/logosm.svg" alt="ICT Learner NG" width={50} height={45} priority />
          </div>
          <div>
            <h2 className="gradient-text fluid-text-h1 mb-1 tracking-tighter">Teacher Hub</h2>
            <p className="text-text-muted font-bold text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] opacity-80">Architecting the next generation of ICT excellence.</p>
          </div>
        </div>
        <div className="flex items-center gap-6 sm:gap-10 lg:pb-3 ml-auto lg:ml-0 bg-foreground/5 p-4 rounded-2xl backdrop-blur-md border border-white/5">
          <div className="hidden xs:block text-left sm:text-right">
            <p className="text-[0.7rem] text-text-muted uppercase tracking-[0.3em] font-black mb-1 opacity-60">Authenticated Architect</p>
            <p className="font-black text-xl text-foreground tracking-tight">{teacherName}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline border-primary/20 px-8 py-3 text-sm font-black hover:bg-primary/10">
            Sign Out
          </button>
        </div>
      </div>

      <div className="stat-grid mb-20 px-2 lg:px-4">
        <div className="peak-card glossy-border p-6 sm:p-10 text-center group">
          <div className="text-4xl sm:text-6xl font-black text-foreground mb-3 group-hover:scale-110 transition-transform tracking-tighter">{subjects.length}</div>
          <div className="text-[0.75rem] sm:text-[0.9rem] font-black text-text-muted uppercase tracking-[0.3em] opacity-60">Academic Sectors</div>
        </div>
        <div className="peak-card glossy-border p-6 sm:p-10 text-center group">
          <div className="text-4xl sm:text-6xl font-black text-primary mb-3 group-hover:scale-110 transition-transform tracking-tighter">{topics.length}</div>
          <div className="text-[0.75rem] sm:text-[0.9rem] font-black text-text-muted uppercase tracking-[0.3em] opacity-60">Topic Clusters</div>
        </div>
        <div className="peak-card glossy-border p-6 sm:p-10 text-center group">
          <div className="text-4xl sm:text-6xl font-black text-secondary mb-3 group-hover:scale-110 transition-transform tracking-tighter">{modules.length}</div>
          <div className="text-[0.75rem] sm:text-[0.9rem] font-black text-text-muted uppercase tracking-[0.3em] opacity-60">5E Blueprints</div>
        </div>
      </div>

      <div className="tabs-container mb-16 p-2 bg-foreground/5 backdrop-blur-xl glossy-border">
        <button 
          className={`tab-btn px-8 py-4 text-sm uppercase tracking-widest ${activeTab === 'subjects' ? 'tab-btn-active scale-[1.02]' : 'opacity-60'}`} 
          onClick={() => setActiveTab('subjects')}
        >
          📂 Sectors
        </button>
        <button 
          className={`tab-btn px-8 py-4 text-sm uppercase tracking-widest ${activeTab === 'topics' ? 'tab-btn-active scale-[1.02]' : 'opacity-60'}`} 
          onClick={() => setActiveTab('topics')}
        >
          📚 Clusters
        </button>
        <button 
          className={`tab-btn px-8 py-4 text-sm uppercase tracking-widest ${activeTab === 'modules' ? 'tab-btn-active scale-[1.02]' : 'opacity-60'}`} 
          onClick={() => setActiveTab('modules')}
        >
          ✨ Blueprints
        </button>
      </div>

      <div className="px-2 lg:px-4 animate-fade-in">
        {activeTab === 'subjects' && (
          <div className="peak-card glossy-border p-0 overflow-hidden bg-transparent border-none shadow-none">
            <SubjectsTab subjects={subjects} setSubjects={setSubjects} />
          </div>
        )}
        {activeTab === 'topics' && (
          <div className="peak-card glossy-border p-0 overflow-hidden bg-transparent border-none shadow-none">
            <TopicsTab topics={topics} setTopics={setTopics} subjects={subjects} />
          </div>
        )}
        {activeTab === 'modules' && (
          <div className="peak-card glossy-border p-0 overflow-hidden bg-transparent border-none shadow-none">
            <ModulesTab modules={modules} setModules={setModules} topics={topics} subjects={subjects} />
          </div>
        )}
      </div>
    </div>
  );
}
