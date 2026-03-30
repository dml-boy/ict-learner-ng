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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '50px', height: '50px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Synchronizing your academic sector...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-24">
      <div className="flex justify-between items-end mb-16 px-4">
        <div className="flex gap-6 items-center">
          <div className="m-0 w-16 h-16 flex items-center justify-center bg-white rounded-2xl shadow-lg border border-primary-glow animate-float">
            <Image src="/logosm.svg" alt="ICT Learner NG" width={50} height={45} priority />
          </div>
          <div>
            <h2 className="gradient-text text-5xl mb-1">Teacher Hub</h2>
            <p className="text-text-muted font-semibold text-lg">Architecting the next generation of ICT excellence.</p>
          </div>
        </div>
        <div className="flex items-center gap-8 pb-2">
          <div className="text-right">
            <p className="text-[0.7rem] text-text-muted uppercase tracking-widest font-extrabold mb-1">Authenticated Architect</p>
            <p className="font-black text-xl text-foreground">{teacherName}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline px-6 py-2.5">
            Sign Out
          </button>
        </div>
      </div>

      <div className="stat-grid mb-14">
        <div className="peak-card text-center group">
          <div className="text-5xl font-black text-foreground mb-2 group-hover:scale-110 transition-transform">{subjects.length}</div>
          <div className="text-[0.85rem] font-bold text-text-muted uppercase tracking-widest">Sectors (Subjects)</div>
        </div>
        <div className="peak-card text-center group">
          <div className="text-5xl font-black text-primary mb-2 group-hover:scale-110 transition-transform">{topics.length}</div>
          <div className="text-[0.85rem] font-bold text-text-muted uppercase tracking-widest">Clusters (Topics)</div>
        </div>
        <div className="peak-card text-center group">
          <div className="text-5xl font-black text-secondary mb-2 group-hover:scale-110 transition-transform">{modules.length}</div>
          <div className="text-[0.85rem] font-bold text-text-muted uppercase tracking-widest">5E Blueprints</div>
        </div>
      </div>

      <div className="tabs-container mb-14">
        <button className={`tab-btn ${activeTab === 'subjects' ? 'tab-btn-active' : ''}`} onClick={() => setActiveTab('subjects')}>
          📂 Subjects
        </button>
        <button className={`tab-btn ${activeTab === 'topics' ? 'tab-btn-active' : ''}`} onClick={() => setActiveTab('topics')}>
          📚 Topics
        </button>
        <button className={`tab-btn ${activeTab === 'modules' ? 'tab-btn-active' : ''}`} onClick={() => setActiveTab('modules')}>
          ✨ 5E Modules
        </button>
      </div>

      <div className="px-1">
        {activeTab === 'subjects' && <SubjectsTab subjects={subjects} setSubjects={setSubjects} />}
        {activeTab === 'topics' && <TopicsTab topics={topics} setTopics={setTopics} subjects={subjects} />}
        {activeTab === 'modules' && <ModulesTab modules={modules} setModules={setModules} topics={topics} subjects={subjects} />}
      </div>
    </div>
  );
}
