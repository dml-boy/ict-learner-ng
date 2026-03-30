'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Module, Question, StudentProgress } from '@/types';

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || 'guest';
  
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (id) {
      fetch(`/api/modules/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setModule(data.data);
            setAnswers(new Array(data.data.questions?.length || 0).fill(-1));
          }
        })
        .catch(err => console.error('[Quiz Logic] Neural disconnect:', err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAnswerChange = (qIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    if (!module) return 0;
    let correctCount = 0;
    module.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    return Math.round((correctCount / module.questions.length) * 100);
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);

    // Save progress regardless of score, but set status to completed only if passed
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        moduleId: id,
        status: finalScore >= 70 ? 'completed' : 'in-progress',
        score: finalScore,
      }),
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-12 h-12 rounded-full border-4 border-primary-glow border-t-primary animate-spin" />
        <p className="text-text-muted font-black uppercase tracking-widest text-xs">Calibrating Assessment Neural-Links...</p>
      </div>
    );
  }

  if (!module) return <div className="peak-card text-center py-20 max-w-md mx-auto mt-20">Signal Lost: Assessment unavailable.</div>;
  
  if (!module.questions || module.questions.length === 0) {
    return (
      <div className="peak-card text-center py-20 max-w-md mx-auto mt-20">
        <h3 className="text-2xl font-black mb-4">No validation metrics found.</h3>
        <p className="text-text-muted mb-8 italic">Your teacher hasn&apos;t defined any confirmative questions for this sector yet.</p>
        <button onClick={() => router.push('/student')} className="btn btn-primary px-8 py-3">Back to Hub</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      {/* Navigation & Progress Hub */}
      <nav className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-border/10 shadow-sm">
        <button onClick={() => router.push(`/student/learn/${id}/intro`)} className="text-text-muted font-black text-[0.7rem] uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-all group">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Return to Synthesis View
        </button>
        <div className="flex items-center gap-4 flex-1 max-w-sm w-full">
           <div className="text-[0.6rem] font-black text-text-muted uppercase tracking-tighter whitespace-nowrap">Validation Flux:</div>
           <div className="h-2 bg-slate-100 flex-1 rounded-full overflow-hidden">
             <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_var(--primary-glow)]" style={{ width: submitted ? '100%' : '85%' }}></div>
           </div>
           <span className="text-[0.7rem] font-black text-primary uppercase">{submitted ? 'FINALIZED' : 'STEP 3/3'}</span>
        </div>
      </nav>

      <header className="mb-14 text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
           <span className="gradient-text">Confirmative Validation</span>
        </h2>
        <p className="text-text-muted text-lg max-w-2xl italic opacity-80 leading-relaxed font-medium">
           Finalize your constructivist journey by documenting your mastery of the theoretical and experimental principles.
        </p>
      </header>

      <div className="flex flex-col gap-8 mb-16">
        {module.questions.map((q, qIndex) => (
          <div 
            key={qIndex} 
            className={`peak-card p-8 md:p-10 transition-all duration-500 border-l-8 ${submitted && answers[qIndex] === q.correctAnswer ? 'border-emerald-500 bg-emerald-500/5' : (submitted ? 'border-red-500 bg-red-500/5' : 'border-border/20 hover:border-primary/30')}`}
          >
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center font-black text-primary text-xl flex-shrink-0">
                {qIndex + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-xl md:text-2xl font-black mb-8 leading-tight text-slate-800">{q.question}</h4>
                <div className="grid grid-cols-1 gap-4">
                  {q.options.map((opt, optIndex) => (
                    <label 
                      key={optIndex} 
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${answers[qIndex] === optIndex ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-white border-slate-100 hover:border-slate-300'} ${submitted ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answers[qIndex] === optIndex ? 'border-primary bg-primary' : 'border-slate-300 bg-white'}`}>
                        {answers[qIndex] === optIndex && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      </div>
                      <input 
                        type="radio" 
                        className="hidden"
                        name={`q-${qIndex}`} 
                        disabled={submitted}
                        checked={answers[qIndex] === optIndex} 
                        onChange={() => handleAnswerChange(qIndex, optIndex)} 
                      />
                      <span className="text-base font-bold text-slate-700 leading-snug">{opt}</span>
                    </label>
                  ))}
                </div>

                {submitted && (
                  <div className={`mt-8 p-6 rounded-2xl border flex flex-col gap-3 animate-fade-in ${answers[qIndex] === q.correctAnswer ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className={`text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 ${answers[qIndex] === q.correctAnswer ? 'text-emerald-600' : 'text-red-600'}`}>
                      {answers[qIndex] === q.correctAnswer ? (
                        <><span>✔️</span> NEURAL SYNC ESTABLISHED</>
                      ) : (
                        <><span>❌</span> PARITY ERROR DETECTED</>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      <span className="font-black opacity-60 uppercase mr-2 non-italic">Architecture Note:</span> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <div className="flex flex-col items-center gap-6 mt-16">
          <p className="text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.3em] opacity-60">Complete all validation points to finalize</p>
          <button 
            onClick={handleSubmit} 
            disabled={answers.includes(-1)}
            className="btn btn-primary px-16 py-5 text-xl font-black shadow-2xl shadow-primary/30 group disabled:opacity-30 disabled:grayscale transition-all hover:scale-105"
          >
            TRANSMIT REFLECTIONS <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      ) : (
        <div className="peak-card mt-20 mb-32 p-12 md:p-20 text-center border-4 border-primary-glow/50 bg-[radial-gradient(circle_at_top,var(--primary-glow)_0%,transparent_100%)] animate-float animate-fade-in">
          <div className="text-[0.7rem] font-black text-primary uppercase tracking-[0.4em] mb-4">Neural Validation Coefficient</div>
          <div className="text-8xl md:text-9xl font-black text-foreground mb-10 drop-shadow-2xl">
             {score}<span className="text-4xl text-primary opacity-50">%</span>
          </div>
          
          {score >= 70 ? (
            <div className="animate-fade-in">
              <h3 className="text-2xl md:text-3xl font-black text-emerald-600 mb-6 uppercase tracking-tight">Mastery Confirmed 🛡️</h3>
              <p className="text-text-muted text-lg font-medium max-w-xl mx-auto mb-12 leading-relaxed italic opacity-80">
                Parity check complete. You have successfully constructed this theoretical pillar within your ICT schema.
              </p>
              <button 
                onClick={() => router.push('/student')} 
                className="btn btn-primary px-16 py-5 text-xl font-black shadow-2xl shadow-primary/40 rounded-full border-b-8 border-primary-dark transition-all active:translate-y-2 active:border-b-0"
              >
                RETURN TO HUB COMMAND →
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h3 className="text-2xl md:text-3xl font-black text-red-600 mb-6 uppercase tracking-tight">Sync Incomplete 📡</h3>
              <p className="text-text-muted text-lg font-medium max-w-xl mx-auto mb-12 leading-relaxed italic opacity-80">
                Neural parity at {score}% is below the required 70% threshold. Revisit the discovery stages to solidify your understanding.
              </p>
              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-primary px-12 py-4 font-black shadow-xl shadow-primary/20 bg-amber-600 border-amber-800"
                >
                  RE-INITIALIZE TEST
                </button>
                <button 
                  onClick={() => router.push(`/student/learn/${id}/intro`)} 
                  className="btn btn-outline px-12 py-4 font-black text-slate-800 border-2" 
                >
                  REVISIT DISCOVERY SECTOR
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
