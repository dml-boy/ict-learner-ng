'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

import { Subject, Topic, Module, StudentProgress } from '@/types';

const TYPE_ICONS: Record<string, string> = { lesson: '📖', activity: '🔬', project: '🚀' };
const TYPE_COLORS: Record<string, string> = { lesson: 'text-emerald-500 bg-emerald-500/10', activity: 'text-blue-500 bg-blue-500/10', project: 'text-amber-500 bg-amber-500/10' };

export default function StudentModules() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || 'guest';

  useEffect(() => {
    Promise.all([
      fetch('/api/subjects').then(r => r.json()),
      fetch('/api/topics').then(r => r.json()),
      fetch('/api/modules').then(r => r.json()),
      userId !== 'guest' ? fetch(`/api/progress?userId=${userId}`).then(r => r.json()) : Promise.resolve({ success: true, data: [] }),
    ]).then(([subjectsData, topicsData, modulesData, progressData]) => {
      if (subjectsData.success) setSubjects(subjectsData.data);
      if (topicsData.success) setTopics(topicsData.data);
      if (modulesData.success) setModules(modulesData.data);
      if (progressData.success) setProgress(progressData.data);
    }).catch(err => {
      console.error('[Modules Catalog] Uplink desync:', err);
    }).finally(() => setLoading(false));
  }, [userId]);

  const getModuleStatus = (moduleId: string) => {
    if (!progress) return 'available';
    const prog = progress.find(p => {
      if (!p || !p.moduleId) return false;
      const mid = typeof p.moduleId === 'object' ? (p.moduleId as Module)?._id : p.moduleId;
      return mid === moduleId;
    });
    return prog?.status || 'available';
  };

  const getTopicsForSubject = (subjectId: string) =>
    (topics || []).filter(t => {
      if (!t || !t.subjectId) return false;
      const sid = typeof t.subjectId === 'object' ? (t.subjectId as any)?._id : t.subjectId;
      return sid === subjectId;
    });

  const getModulesForTopic = (topicId: string) =>
    (modules || []).filter(m => {
      if (!m || !m.topicId) return false;
      const tid = typeof m.topicId === 'object' ? (m.topicId as any)?._id : m.topicId;
      return tid === topicId;
    });

  const filteredSubjects = activeSubject === 'all' ? subjects : subjects.filter(s => s._id === activeSubject);

  const totalCompleted = (progress || []).filter(p => p?.status === 'completed').length;
  const totalInProgress = (progress || []).filter(p => p?.status === 'in-progress').length;

  return (
    <div className="animate-fade-in pb-24">
      {/* Header */}
      <div className="mb-14 px-4 md:px-0">
        <Link href="/student" className="inline-flex items-center gap-2 text-text-muted font-bold hover:text-primary transition-colors text-sm mb-8 group">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
        </Link>
        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight">
          <span className="gradient-text">Neural Course Catalog</span>
        </h1>
        <p className="text-text-muted text-lg md:text-xl max-w-xl leading-relaxed italic opacity-80">
          Every subject, topic, and high-fidelity module synthesized by your teacher — fully accessible, ready for decryption.
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-14 px-2">
        {[
          { label: 'Sectors', value: subjects.length, color: 'text-foreground', glow: 'bg-foreground/5' },
          { label: 'Clusters', value: topics.length, color: 'text-secondary', glow: 'bg-secondary/5' },
          { label: 'Blueprints', value: modules.length, color: 'text-primary', glow: 'bg-primary/5' },
          { label: 'Mastered', value: totalCompleted, color: 'text-emerald-500', glow: 'bg-emerald-500/5' },
          { label: 'Active', value: totalInProgress, color: 'text-amber-500', glow: 'bg-amber-500/5' },
        ].map(s => (
          <div key={s.label} className={`peak-card py-6 px-2 text-center group translate-y-0 hover:-translate-y-1 transition-all ${s.glow}`}>
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-[0.65rem] text-text-muted font-black uppercase tracking-widest leading-none">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Matrix */}
      {subjects.length > 0 && (
        <div className="tabs-container mb-14 flex-wrap justify-start border-b border-border/20 pb-4">
          <button className={`tab-btn whitespace-nowrap px-6 py-2 rounded-full font-bold transition-all ${activeSubject === 'all' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-foreground hover:bg-foreground/5'}`} onClick={() => setActiveSubject('all')}>
            All Sectors
          </button>
          {subjects.map(s => (
            <button key={s._id} className={`tab-btn whitespace-nowrap px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${activeSubject === s._id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-foreground hover:bg-foreground/5'}`} onClick={() => setActiveSubject(s._id)}>
              <span className="w-6 h-6 flex items-center justify-center relative overflow-hidden rounded-md">
                {s.icon?.startsWith('http') ? (
                  <Image src={s.icon} alt={s.title} fill className="object-cover" />
                ) : (
                  <span className="text-lg">{s.icon}</span>
                )}
              </span> 
              {s.title}
            </button>
          ))}
        </div>
      )}

      {/* Content Stream */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-60">
          <div className="w-12 h-12 rounded-full border-4 border-primary-glow border-t-primary animate-spin" />
          <p className="font-extrabold uppercase tracking-widest text-[0.65rem]">Synchronizing Neural Network...</p>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="peak-card text-center py-24 flex flex-col items-center opacity-50">
          <div className="text-6xl mb-6 grayscale animate-pulse leading-none">🛰️</div>
          <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">No signals detected</h3>
          <p className="text-text-muted max-w-xs">Your teacher hasn&apos;t broadcasted any sectors yet. Check back at the next uplink.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-16 px-2">
          {filteredSubjects.map(subject => {
            const subjectTopics = getTopicsForSubject(subject?._id);
            const subjectModules = subjectTopics.flatMap(t => getModulesForTopic(t?._id));
            const completedCount = subjectModules.filter(m => m?._id && getModuleStatus(m._id) === 'completed').length;

            return (
              <div key={subject?._id} className="animate-fade-in">
                {/* Sector Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 pb-8 border-b-2 transition-all group" style={{ borderBottomColor: `${subject?.color}20` }}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center rounded-2xl md:rounded-3xl text-3xl md:text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-500 relative overflow-hidden shrink-0" style={{ background: `${subject?.color}10`, color: subject?.color }}>
                    {subject?.icon?.startsWith('http') ? (
                      <Image src={subject.icon} alt={subject.title || 'Subject'} fill className="object-cover" />
                    ) : (
                      subject?.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">{subject?.title}</h2>
                      <div className="px-4 py-1.5 rounded-full text-[0.65rem] font-black uppercase tracking-widest border-2 shadow-sm w-fit" style={{ backgroundColor: `${subject?.color}05`, color: subject?.color, borderColor: `${subject?.color}20` }}>
                        SYNC: {completedCount}/{subjectModules.length} STAGES
                      </div>
                    </div>
                    <p className="text-text-muted text-sm md:text-base lg:text-lg italic opacity-80">&quot;{subject?.description}&quot;</p>
                  </div>
                </div>

                {subjectTopics.length === 0 ? (
                  <p className="text-text-muted text-sm italic ml-24 py-10">No topic clusters detected within this sector.</p>
                ) : (
                  <div className="flex flex-col gap-14 ml-4 md:ml-12 border-l-2 border-border/20 pl-6 md:pl-12">
                    {subjectTopics.map(topic => {
                      const topicModules = getModulesForTopic(topic?._id);
                      return (
                        <div key={topic?._id}>
                          {/* Cluster Label */}
                          <div className="flex items-center gap-4 mb-8 group/topic">
                            <div className="w-1.5 h-8 md:h-10 rounded-full transition-all group-hover/topic:scale-y-125" style={{ background: subject?.color }} />
                            <div>
                              <h3 className="text-xl md:text-2xl font-black text-foreground/90 group-hover/topic:text-primary transition-colors">{topic?.title}</h3>
                              {topic?.description && <p className="text-xs md:text-sm text-text-muted italic opacity-70 mt-1">{topic.description}</p>}
                            </div>
                          </div>

                          {topicModules.length === 0 ? (
                            <p className="text-text-muted text-[0.75rem] py-4 italic">No active blueprints in this cluster.</p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                              {topicModules.map(mod => {
                                const status = mod?._id ? getModuleStatus(mod._id) : 'available';
                                const isCompleted = status === 'completed';
                                const isInProgress = status === 'in-progress';
                                const typeClass = TYPE_COLORS[mod?.type || 'lesson'] || 'text-primary bg-primary/10';

                                return (
                                  <div
                                    key={mod?._id}
                                    className={`peak-card flex flex-col p-7 border-t-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer group/card ${isCompleted ? 'border-emerald-500/50 grayscale-[0.3]' : 'hover:shadow-2xl'}`}
                                    style={{ borderTopColor: isCompleted ? '#10b981' : subject?.color }}
                                    onClick={() => router.push(`/student/learn/${mod?._id}/intro`)}
                                  >
                                    <div className="flex justify-between items-start mb-6">
                                      <div className="flex flex-col gap-2">
                                        <div className={`px-3 py-1 rounded-full text-[0.65rem] font-black uppercase tracking-widest w-fit ${typeClass}`}>
                                          {TYPE_ICONS[mod?.type || 'lesson']} {mod?.type || 'lesson'}
                                        </div>
                                        {mod?.createdBy && (
                                          <div className="text-[0.6rem] text-text-muted font-bold uppercase tracking-tighter opacity-50 group-hover/card:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-1">
                                            <span>🤵</span> ARCHITECT: {mod.createdBy.name || 'ANONYMOUS'}
                                          </div>
                                        )}
                                      </div>
                                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg shadow-sm transition-transform group-hover/card:rotate-12 ${isCompleted ? 'bg-emerald-50' : 'bg-gray-50 opacity-50 group-hover/card:opacity-100'}`}>
                                        {isCompleted ? '🛡️' : isInProgress ? '⚡' : '🔮'}
                                      </div>
                                    </div>

                                    <h4 className="text-lg md:text-xl font-black mb-3 leading-tight group-hover/card:text-primary transition-colors">{mod.title}</h4>
                                    <p className="text-xs md:text-sm text-text-muted leading-relaxed flex-1 italic opacity-80 mb-8 line-clamp-3">
                                      &quot;{mod.content.substring(0, 100)}{mod.content.length > 100 ? '…' : ''}&quot;
                                    </p>

                                    <div className="mt-auto space-y-4 pt-4 border-t border-border/20">
                                       <div className="flex justify-between items-center text-[0.65rem]">
                                          <span className="font-black text-text-muted opacity-50 uppercase">INIT STATUS</span>
                                          <span className={`font-black uppercase tracking-widest ${isCompleted ? 'text-emerald-500' : isInProgress ? 'text-amber-500' : 'text-text-muted'}`}>
                                            {isCompleted ? 'MASTERY SYNCED' : isInProgress ? 'UPLINK ACTIVE' : 'AWAITING INIT'}
                                          </span>
                                       </div>
                                       <button
                                          className={`btn w-full py-3 text-[0.75rem] font-black tracking-widest transition-all ${isCompleted ? 'btn-outline border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white' : 'btn-primary shadow-lg shadow-primary/20 hover:shadow-primary/40'}`}
                                          onClick={e => { e.stopPropagation(); router.push(`/student/learn/${mod._id}/intro`); }}
                                       >
                                          {isCompleted ? 'CORE REVISIT' : isInProgress ? 'RESUME UPLINK' : 'INITIALIZE MODULE'}
                                       </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
