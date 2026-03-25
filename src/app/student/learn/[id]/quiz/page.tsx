'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Module {
  _id: string;
  title: string;
  questions: Question[];
}

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (id) {
      fetch(`/api/modules/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setModule(data.data);
            setAnswers(new Array(data.data.questions?.length || 0).fill(-1));
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
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

    if (finalScore >= 70) {
      // Complete module and unlock next
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default_student',
          moduleId: id,
          status: 'completed',
          score: finalScore,
        }),
      });
    }
  };

  if (loading) return <div className="glass-card" style={{ textAlign: 'center' }}>Loading activity...</div>;
  if (!module) return <div className="glass-card" style={{ textAlign: 'center' }}>Module not found.</div>;
  if (!module.questions || module.questions.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center' }}>
        <h3>No activity for this module.</h3>
        <button onClick={() => router.push('/student')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1rem' }}>
      {/* Navigation & Progress */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <button onClick={() => router.push(`/student/learn/${id}/intro`)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          ← Back to Intro
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '300px', marginLeft: '2rem' }}>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', flex: 1, borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: submitted ? '100%' : '66%', height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{submitted ? 'FINAL STEP' : 'STEP 2/3'}</span>
        </div>
      </nav>

      <header style={{ marginBottom: '4rem' }}>
        <h2 className="gradient-text" style={{ fontSize: '3rem', lineHeight: '1.2' }}>Confirmation Activity</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Reflect on your knowledge to proceed to the next module.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {module.questions.map((q, qIndex) => (
          <div 
            key={qIndex} 
            className="glass-card" 
            style={{ 
              borderLeft: submitted && answers[qIndex] === q.correctAnswer ? '4px solid var(--secondary)' : (submitted ? '4px solid var(--accent)' : '1px solid var(--glass-border)') 
            }}
          >
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 800,
                color: 'var(--primary)',
                flexShrink: 0
              }}>
                {qIndex + 1}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.5' }}>{q.question}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {q.options.map((opt, optIndex) => (
                    <label 
                      key={optIndex} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        padding: '1.25rem', 
                        borderRadius: 'var(--radius-sm)', 
                        background: answers[qIndex] === optIndex ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                        border: answers[qIndex] === optIndex ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                        cursor: submitted ? 'default' : 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <input 
                        type="radio" 
                        name={`q-${qIndex}`} 
                        disabled={submitted}
                        checked={answers[qIndex] === optIndex} 
                        onChange={() => handleAnswerChange(qIndex, optIndex)} 
                        style={{ accentColor: 'var(--primary)', width: '1.2rem', height: '1.2rem' }}
                      />
                      <span style={{ fontSize: '1rem', fontFamily: 'var(--font-alt)' }}>{opt}</span>
                    </label>
                  ))}
                </div>

                {submitted && (
                  <div style={{ 
                    marginTop: '2rem', 
                    padding: '1.5rem', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <p style={{ color: answers[qIndex] === q.correctAnswer ? 'var(--secondary)' : 'var(--accent)', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {answers[qIndex] === q.correctAnswer ? '<span>✔️</span> CORRECT' : '<span>❌</span> THINK AGAIN'}
                    </p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', fontStyle: 'italic' }}>
                      <strong style={{ color: 'white', fontStyle: 'normal' }}>Pedagogical Note:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <button 
            onClick={handleSubmit} 
            disabled={answers.includes(-1)}
            className="btn btn-primary" 
            style={{ padding: '1.25rem 4rem', fontSize: '1.1rem' }}
          >
            Submit My Reflections
          </button>
        </div>
      ) : (
        <div className="glass-card animate-float" style={{ textAlign: 'center', marginTop: '6rem', border: '1px solid var(--primary-glow)' }}>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Activity Result 🛰️</h3>
          <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary)', margin: '1rem 0' }}>{score}%</div>
          
          {score >= 70 ? (
            <div className="animate-fade-in">
              <p style={{ color: 'var(--secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
                Mastery achieved! You&apos;ve successfully constructed this knowledge block.
              </p>
              <button 
                onClick={() => router.push('/student')} 
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', boxShadow: '0 4px 12px var(--primary-glow)' }}
              >
                Return to Hub →
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <p style={{ color: 'var(--accent)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
                You&apos;re still identifying patterns. Review the introduction to solidify your understanding.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-primary" 
                  style={{ background: 'var(--accent)', borderColor: 'var(--accent)', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)' }}
                >
                  Retry Activity
                </button>
                <button 
                  onClick={() => router.push(`/student/learn/${id}/intro`)} 
                  className="btn btn-outline" 
                >
                  Review Intro
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
