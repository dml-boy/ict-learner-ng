'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PriorKnowledgeCheck from '@/components/PriorKnowledgeCheck';
import { Module, StudentProgress } from '@/types';

export default function IntroPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || 'guest';
  
  const [module, setModule] = useState<Module | null>(null);
  const [selectedContext, setSelectedContext] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [engageAnswer, setEngageAnswer] = useState('');
  const [personalizedContent, setPersonalizedContent] = useState<StudentProgress['personalizedContent'] | null>(null);
  const [reflection, setReflection] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdapting, setIsAdapting] = useState(false);

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (id && userId !== 'guest') {
      Promise.all([
        fetch(`/api/modules/${id}`).then(res => res.json()),
        fetch(`/api/progress?userId=${userId}`).then(res => res.json()),
      ]).then(([modData, progData]) => {
        if (modData.success) setModule(modData.data);
        if (progData.success) {
          const prog = progData.data.find((p: StudentProgress) => {
            const mId = typeof p.moduleId === 'object' ? (p.moduleId as Module)._id : p.moduleId;
            return mId === id;
          });
          if (prog?.selectedContext) setSelectedContext(prog.selectedContext);
          if (typeof prog?.currentStep === 'number') setCurrentStep(prog.currentStep);
          if (prog?.engageAnswer) setEngageAnswer(prog.engageAnswer);
          if (prog?.personalizedContent) setPersonalizedContent(prog.personalizedContent);
          if (prog?.reflection) setReflection(prog.reflection);
        }
      }).catch(err => {
        console.error('[Learn UI] Synchronicity failure:', err);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [id, userId]);

  const saveProgress = useCallback(async (step: number, ctx?: string, ref?: string, answer?: string, pContent?: any) => {
    setSaving(true);
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          moduleId: id,
          status: step === 4 ? 'completed' : 'in-progress',
          currentStep: step,
          selectedContext: ctx ?? selectedContext,
          reflection: ref ?? reflection,
          engageAnswer: answer ?? engageAnswer,
          personalizedContent: pContent ?? personalizedContent
        })
      });
    } finally {
      setSaving(false);
    }
  }, [id, selectedContext, reflection, engageAnswer, personalizedContent, userId]);

  const handleContextSelect = async (context: string) => {
    if (!module) return;
    setSelectedContext(context);
    await saveProgress(0, context);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 rounded-full border-4 border-primary-glow border-t-primary animate-spin" />
        <p className="text-text-muted font-black uppercase tracking-widest text-xs">Accessing Neural Archive...</p>
      </div>
    );
  }

  if (!module) return <div className="peak-card text-center py-20 max-w-md mx-auto mt-20">Signal Lost: Module not found.</div>;

  if (!selectedContext) {
    const options = (typeof module.topicId === 'object' && typeof (module.topicId as any).subjectId === 'object')
      ? (module.topicId as any).subjectId.allowedContexts
      : ['General ICT Student', 'Future Software Architect', 'Data Scientist', 'Nigerian Tech Entrepreneur'];
      
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <PriorKnowledgeCheck onSelect={handleContextSelect} options={options} />
      </div>
    );
  }

  const steps = [
    { title: 'Engage',    icon: '🎣', content: module.engage,    color: 'var(--primary)',   colorClass: 'text-primary',   bg: 'bg-primary/5' },
    { title: 'Explore',   icon: '🔍', content: personalizedContent?.explore || module.explore,   color: 'var(--secondary)', colorClass: 'text-secondary', bg: 'bg-secondary/5' },
    { title: 'Explain',   icon: '📖', content: personalizedContent?.explain || module.explain,   color: '#3b82f6',          colorClass: 'text-blue-500',  bg: 'bg-blue-500/5' },
    { title: 'Elaborate', icon: '🛠️', content: personalizedContent?.elaborate || module.elaborate?.[selectedContext] || Object.values(module.elaborate || {})[0] || 'Personalized scenario unavailable.', color: '#a855f7', colorClass: 'text-purple-500', bg: 'bg-purple-500/5' },
    { title: 'Evaluate',  icon: '🤔', content: personalizedContent?.evaluate || module.evaluate,  color: '#64748b',          colorClass: 'text-slate-500', bg: 'bg-slate-500/5' },
  ];

  const nextStep = async () => {
    if (currentStep === 0) {
      if (!engageAnswer.trim()) {
        alert('Please share your thoughts to personalize your learning journey.');
        return;
      }
      
      // If we already have personalized content, just move on
      if (personalizedContent) {
        setCurrentStep(1);
        await saveProgress(1);
        return;
      }

      setIsAdapting(true);
      try {
        const res = await fetch('/api/ai/adapt-module', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teacherContent: module.content,
            moduleTitle: module.title,
            studentContext: selectedContext,
            engageAnswer
          })
        });
        const data = await res.json();
        if (data.success) {
          const adapted = {
            ...data.data,
            engage: module.engage // keep original engage text
          };
          setPersonalizedContent(adapted);
          setCurrentStep(1);
          await saveProgress(1, undefined, undefined, engageAnswer, adapted);
        } else {
          throw new Error(data.error || 'Adaptation failed');
        }
      } catch (err) {
        console.error('Adaptation failed:', err);
        alert('Neural processing failed. Proceeding with baseline content.');
        setCurrentStep(1);
        await saveProgress(1);
      } finally {
        setIsAdapting(false);
      }
      return;
    }

    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      await saveProgress(next);
    } else {
      await saveProgress(4, undefined, reflection);
      router.push(`/student/learn/${id}/quiz`);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      {/* Neural Step Indicator */}
      <nav className="sticky top-20 z-50 bg-white/80 backdrop-blur-xl py-6 mb-12 border-b border-border/20 rounded-2xl shadow-sm">
        <div className="flex justify-between px-6 mb-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`flex-1 text-center text-[0.65rem] font-black uppercase tracking-widest transition-all duration-300 ${i <= currentStep ? s.colorClass : 'text-slate-300'} ${i === currentStep ? 'scale-110' : 'cursor-pointer hover:opacity-70'}`}
              onClick={() => i < currentStep && setCurrentStep(i)}
            >
              <div className="mb-1 text-lg">{s.icon}</div>
              {s.title}
            </div>
          ))}
        </div>
        <div className="flex gap-2 h-1.5 px-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-700 ${i <= currentStep ? s.bg.replace('/5', '') : 'bg-slate-100'} ${i === currentStep ? 'shadow-[0_0_15px_rgba(0,0,0,0.1)]' : ''}`}
            />
          ))}
        </div>
        {saving && <p className="absolute right-6 -bottom-5 text-[0.6rem] text-text-muted font-bold italic">Auto-Syncing Progress...</p>}
      </nav>

      {/* Content Crucible */}
      <div key={currentStep} className="peak-card min-h-[500px] flex flex-col justify-between p-10 md:p-14 animate-fade-in transition-all border-l-8 hover:shadow-2xl" 
           style={{ borderLeftColor: steps[currentStep].color }}>
        <div>
          <div className="flex items-center gap-6 mb-10">
            <span className="text-6xl drop-shadow-lg">{steps[currentStep].icon}</span>
            <div>
              <p className={`text-[0.7rem] font-black uppercase tracking-[0.2em] mb-1 ${steps[currentStep].colorClass}`}>
                {currentStep === 0 ? 'Diagnostic Capture' : currentStep === 2 ? 'Neural Adaptation' : `Stage ${currentStep + 1} of 5`}
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-foreground m-0">{steps[currentStep].title}</h2>
            </div>
          </div>

          <div className="text-lg md:text-xl leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
            {currentStep === 2 && personalizedContent && (
              <div className="mb-8 p-4 bg-primary-glow border-l-4 border-primary rounded-r-xl flex items-center gap-4 animate-float">
                <span className="text-2xl">🧠</span>
                <div>
                  <p className="text-[0.6rem] font-black text-primary uppercase tracking-widest">Cognitive Synchronization Active</p>
                  <p className="text-sm font-bold text-foreground opacity-70">This theoretical core has been curved to address your initial thought: <span className="italic">"{engageAnswer.substring(0, 40)}..."</span></p>
                </div>
              </div>
            )}
            {steps[currentStep].content}
          </div>

          {/* Engage — Input Area */}
          {currentStep === 0 && (
            <div className="mt-12 space-y-4">
              <label className="flex items-center gap-2 font-black text-primary text-sm uppercase tracking-widest mb-4">
                <span className="text-xl">✍️</span> Task Completion & Initial Thought
              </label>
              <textarea
                value={engageAnswer}
                onChange={(e) => setEngageAnswer(e.target.value)}
                placeholder="Share your discovery from the task above..."
                className="input min-h-[120px] p-6 text-lg border-2 focus:border-primary/50 bg-slate-50/50 italic leading-relaxed"
                disabled={!!personalizedContent}
              />
              {personalizedContent && (
                <p className="text-[0.65rem] text-emerald-600 font-bold ml-2">
                  ✓ Journey personalized. Proceed to Explore.
                </p>
              )}
            </div>
          )}

          {/* Elaborate — Identity Callout */}
          {currentStep === 3 && (
            <div className="mt-12 p-8 rounded-3xl bg-purple-500/5 border-2 border-purple-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700 text-6xl">🛠️</div>
              <p className="text-purple-600 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                Identity Application: {selectedContext}
              </p>
              <p className="text-slate-800 text-base leading-relaxed">
                Your teacher has specifically calibrated this scenario to help you project these ICT principles directly onto your world as a <span className="font-black text-purple-700">{selectedContext}</span>.
              </p>
            </div>
          )}

          {/* Evaluate — Metacognitive Reflection */}
          {currentStep === 4 && (
            <div className="mt-12 space-y-4">
              <label className="flex items-center gap-2 font-black text-slate-700 text-sm uppercase tracking-widest mb-4">
                <span className="text-xl">📓</span> Meta-Review & Reflection
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What did you discover in this lesson? How has your internal schema changed?"
                className="input min-h-[180px] p-6 text-lg border-2 focus:border-primary/50 bg-slate-50/50 italic leading-relaxed"
              />
              <div className="flex items-center gap-2 text-[0.65rem] text-text-muted font-bold ml-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 
                 Datalink Active: Insights are being broadcasted to your teacher&apos;s dash.
              </div>
            </div>
          )}
        </div>

        {/* Navigation Core */}
        <div className="flex justify-between items-center mt-16 pt-10 border-t border-border/20">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`btn btn-outline px-10 py-4 font-black transition-all ${currentStep === 0 ? 'opacity-0' : 'opacity-100'}`}
          >
            ← PREVIOUS SECTOR
          </button>

          <button 
            onClick={nextStep} 
            disabled={isAdapting}
            className={`btn btn-primary px-12 py-4 font-black text-lg shadow-xl shadow-primary/20 group relative overflow-hidden ${isAdapting ? 'opacity-70 cursor-wait' : ''}`}
            style={{ backgroundColor: steps[currentStep].color, borderColor: steps[currentStep].color }}
          >
            <span className="relative z-10">
              {isAdapting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  PERSONALIZING...
                </span>
              ) : currentStep === steps.length - 1
                ? 'UNLOCK FINAL VALIDATION →'
                : `NEXT: ${steps[currentStep + 1].title.toUpperCase()} →`}
            </span>
          </button>
        </div>
      </div>

      <footer className="mt-12 text-center pb-12">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-foreground/5 rounded-full border border-border/10">
           <span className="text-[0.65rem] font-black text-text-muted uppercase tracking-widest">Active Blueprint:</span>
           <span className="text-[0.7rem] font-black text-foreground">{module?.title}</span>
           <span className="w-1 h-1 rounded-full bg-border/40"></span>
           <span className="text-[0.65rem] font-black text-text-muted uppercase tracking-widest">Persona:</span>
           <span className="text-[0.75rem] font-black text-primary uppercase tracking-tighter">{selectedContext}</span>
        </div>
      </footer>
    </div>
  );
}
