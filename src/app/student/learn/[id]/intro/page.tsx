'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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



export default function IntroPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
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
    { title: 'Explain',   icon: '📖', content: module.explain,   color: '#0891b2' }, // Cyan 600
    { title: 'Elaborate', icon: '🚀', content: (module.elaborate && module.elaborate[selectedContext]) || "Apply what you've learnt to your world!", color: 'var(--accent)' },
    { title: 'Evaluate',  icon: '🤔', content: module.evaluate,  color: '#64748b' },
  ];

  const nextStep = async () => {
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
    <div className="animate-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 0' }}>
      {/* 5E Step Indicator */}
      <nav style={{ 
        marginBottom: '3rem', 
        position: 'sticky', 
        top: '90px', 
        zIndex: 50, 
        background: 'rgba(253, 253, 253, 0.8)', 
        backdropFilter: 'blur(8px)', 
        padding: '1rem 0', 
        borderRadius: 'var(--radius-md)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 1rem' }}>
          {steps.map((s, i) => (
            <div
              key={s.title}
              style={{
                flex: 1,
                textAlign: 'center',
                color: i <= currentStep ? s.color : '#cbd5e1',
                fontWeight: i === currentStep ? 800 : 500,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: i < currentStep ? 'pointer' : 'default',
                transition: 'all 0.3s ease'
              }}
              onClick={() => i < currentStep && setCurrentStep(i)}
            >
              {s.title}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', height: '6px', padding: '0 1rem' }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: i <= currentStep ? s.color : '#f1f5f9',
                borderRadius: '10px',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: i === currentStep ? `0 0 12px ${s.color}66` : 'none',
              }}
            />
          ))}
        </div>
        {saving && <p style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', paddingRight: '1rem' }}>Saving progress...</p>}
      </nav>

      {/* Content Card */}
      <div key={currentStep} className="glass-card animate-in" style={{ minHeight: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #e2e8f0' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>{steps[currentStep].icon}</span>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: steps[currentStep].color, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.25rem' }}>Stage {currentStep + 1} of 5</p>
              <h2 style={{ fontSize: '2.25rem', margin: 0, color: '#0f172a' }}>{steps[currentStep].title}</h2>
            </div>
          </div>

          <div style={{ fontSize: '1.2rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: '#334155' }}>
            {steps[currentStep].content}
          </div>

          {/* Elaborate — personalization callout */}
          {currentStep === 3 && (
            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#f0f9ff', borderRadius: 'var(--radius-md)', border: '1px solid #bae6fd', borderLeft: `6px solid ${steps[3].color}` }}>
              <p style={{ fontWeight: 700, color: '#0369a1', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Personalized Insight: {selectedContext}</p>
              <p style={{ fontSize: '1rem', color: '#0c4a6e', lineHeight: '1.6' }}>We&apos;ve contextualized this stage to help you apply ICT concepts directly to your world.</p>
            </div>
          )}

          {/* Evaluate — reflection input */}
          {currentStep === 4 && (
            <div style={{ marginTop: '2.5rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 700, color: '#475569', fontSize: '1.1rem' }}>
                📝 Your Constructivist Reflection
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What did you discover in this lesson? How has your understanding changed?"
                rows={6}
                style={{
                  width: '100%',
                  background: '#f8fafc',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#1e293b',
                  padding: '1.25rem',
                  fontSize: '1.05rem',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
              />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>Your thoughts are automatically saved as you type.</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', borderTop: '2px solid #f1f5f9', paddingTop: '2rem' }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="btn btn-outline"
            style={{ 
              opacity: currentStep === 0 ? 0 : 1,
              padding: '0.875rem 2rem',
              borderRadius: '10px'
            }}
          >
            ← Previous Stage
          </button>

          <button 
            onClick={nextStep} 
            className="btn btn-primary" 
            style={{ 
              background: steps[currentStep].color, 
              borderColor: steps[currentStep].color,
              padding: '0.875rem 2.5rem',
              borderRadius: '10px',
              fontSize: '1.05rem'
            }}
          >
            {currentStep === steps.length - 1
              ? 'Complete & Start Quiz →'
              : `Next: ${steps[currentStep + 1].title} →`}
          </button>
        </div>
      </div>

      <footer style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Module: <span style={{ color: '#0f172a', fontWeight: 700 }}>{module ? module.title : ''}</span> · Perspective: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedContext}</span>
        </p>
      </footer>
    </div>
  );
}
