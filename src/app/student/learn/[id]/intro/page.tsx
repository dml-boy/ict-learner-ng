'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import PriorKnowledgeCheck from '@/components/PriorKnowledgeCheck';

interface Module {
  _id: string;
  title: string;
  type: string;
  engage: string;
  explore: string;
  explain: string;
  elaborate: Record<string, string>;
  evaluate: string;
  topicId: {
    _id: string;
    subjectId: {
      _id: string;
      allowedContexts: string[];
    }
  };
}



export default function IntroPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || 'guest';
  const [module, setModule] = useState<Module | null>(null);
  const [selectedContext, setSelectedContext] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (id && userId !== 'guest') {
      Promise.all([
        fetch(`/api/modules/${id}`).then(res => res.json()),
        fetch(`/api/progress?userId=${userId}`).then(res => res.json()),
      ]).then(([modData, progData]) => {
        if (modData.success) setModule(modData.data);
        if (progData.success) {
          const prog = progData.data.find((p: { moduleId: { _id: string } | string }) => {
            const mId = typeof p.moduleId === 'object' ? p.moduleId._id : p.moduleId;
            return mId === id;
          });
          if (prog?.selectedContext) setSelectedContext(prog.selectedContext);
          if (typeof prog?.currentStep === 'number') setCurrentStep(prog.currentStep);
          if (prog?.reflection) setReflection(prog.reflection);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, userId]);

  const saveProgress = useCallback(async (step: number, ctx?: string, ref?: string) => {
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
        })
      });
    } finally {
      setSaving(false);
    }
  }, [id, selectedContext, reflection, userId]);

  const handleContextSelect = async (context: string) => {
    setSelectedContext(context);
    await saveProgress(0, context);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
        <p style={{ color: 'var(--text-muted)' }}>Loading your 5E Journey...</p>
      </div>
    );
  }
  if (!module) return <div className="glass-card" style={{ textAlign: 'center' }}>Module not found.</div>;

  if (!selectedContext) {
    const options = (typeof module.topicId === 'object' && typeof module.topicId.subjectId === 'object')
      ? module.topicId.subjectId.allowedContexts
      : [];
    return (
      <div style={{ maxWidth: '800px', margin: '10rem auto' }}>
        <PriorKnowledgeCheck onSelect={handleContextSelect} options={options} />
      </div>
    );
  }

  const steps = [
    { title: 'Engage',    icon: '🎯', content: module.engage,    color: 'var(--primary)' },
    { title: 'Explore',   icon: '🛠️', content: module.explore,   color: 'var(--secondary)' },
    { title: 'Explain',   icon: '📖', content: module.explain,   color: 'var(--accent)' },
    { title: 'Elaborate', icon: '🚀', content: (module.elaborate && module.elaborate[selectedContext]) || "Apply what you've learnt to your world!", color: 'var(--primary-light)' },
    { title: 'Evaluate',  icon: '🤔', content: module.evaluate,  color: '#cbd5e1' },
  ];

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      await saveProgress(next);
    } else {
      // Save final reflection before navigating
      await saveProgress(4, undefined, reflection);
      router.push(`/student/learn/${id}/quiz`);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1rem' }}>
      {/* 5E Step Indicator */}
      <nav style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {steps.map((s, i) => (
            <div
              key={s.title}
              style={{
                flex: 1,
                textAlign: 'center',
                color: i <= currentStep ? s.color : 'rgba(255,255,255,0.2)',
                fontWeight: i === currentStep ? 700 : 400,
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: i < currentStep ? 'pointer' : 'default',
              }}
              onClick={() => i < currentStep && setCurrentStep(i)}
            >
              {s.title}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', height: '4px' }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: i <= currentStep ? s.color : 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                transition: 'all 0.4s ease',
                boxShadow: i === currentStep ? `0 0 10px ${s.color}` : 'none',
              }}
            />
          ))}
        </div>
        {saving && <p style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Saving...</p>}
      </nav>

      {/* Content Card */}
      <div key={currentStep} className="glass-card animate-slide-up" style={{ minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '2.5rem' }}>{steps[currentStep].icon}</span>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>{steps[currentStep].title}</h2>
          </div>

          <div style={{ fontSize: '1.15rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.95)' }}>
            {steps[currentStep].content}
          </div>

          {/* Elaborate — personalization callout */}
          {currentStep === 3 && (
            <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', borderLeft: `4px solid ${steps[3].color}` }}>
              <p style={{ fontWeight: 600, color: steps[3].color, marginBottom: '0.25rem' }}>Your lens: {selectedContext}</p>
              <p style={{ fontSize: '0.95rem', fontStyle: 'italic' }}>See how this concept maps to your world.</p>
            </div>
          )}

          {/* Evaluate — reflection input */}
          {currentStep === 4 && (
            <div style={{ marginTop: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: steps[4].color }}>
                📝 Your Reflection (saved automatically)
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What did you discover in this lesson? How will you apply it?"
                rows={5}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '1rem',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  resize: 'vertical',
                }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="btn btn-outline"
            style={{ opacity: currentStep === 0 ? 0 : 1 }}
          >
            ← Previous
          </button>

          <button onClick={nextStep} className="btn btn-primary" style={{ background: steps[currentStep].color, borderColor: steps[currentStep].color }}>
            {currentStep === steps.length - 1
              ? 'Finish & Start Quiz →'
              : `Next: ${steps[currentStep + 1].title} →`}
          </button>
        </div>
      </div>

      <footer style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong>{module.title}</strong> · Stage {currentStep + 1} of 5 · Context: {selectedContext}
        </p>
      </footer>
    </div>
  );
}
