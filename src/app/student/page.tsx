'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import LiveEditor from '@/components/LiveEditor';
import Image from 'next/image';
interface Module {
  _id: string;
  title: string;
  content: string;
  topicId: { _id: string; title: string } | string;
  type: 'lesson' | 'activity' | 'project';
  constructivistNote: string;
  createdAt: string;
}

export default function StudentDashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<{ moduleId: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id || 'guest';
  const userName = session?.user?.name || 'Learner';

  useEffect(() => {
    if (userId === 'guest') return;
    Promise.all([
      fetch('/api/modules').then((res) => res.json()),
      fetch(`/api/progress?userId=${userId}`).then((res) => res.json())
    ])
      .then(([modulesData, progressData]) => {
        if (modulesData.success) setModules(modulesData.data);
        if (progressData.success) setProgress(progressData.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const getModuleStatus = (moduleId: string) => {
    const prog = progress.find((p) => {
      const mid = p.moduleId as unknown;
      return typeof mid === 'string' ? mid === moduleId : (mid as { _id: string })._id === moduleId;
    });
    if (prog) return prog.status;
    
    // First module is always unlocked (in-progress)
    if (modules.length > 0 && modules[modules.length - 1]._id === moduleId) {
      return 'unlocked';
    }
    return 'locked';
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: '5rem 1rem', 
        marginBottom: '4rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'radial-gradient(circle at center, var(--primary-glow) 0%, transparent 70%)'
      }}>
        <div className="animate-float" style={{ 
          fontSize: '4rem', 
          marginBottom: '2rem',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          width: '120px',
          height: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          boxShadow: '0 20px 40px var(--primary-glow)',
          border: '1px solid var(--card-border)'
        }}>
          <Image src="/logosm.svg" alt="ICT Learner NG" width={60} height={56} />
        </div>
        <h1 className="gradient-text" style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: '1', fontWeight: 900 }}>
          Welcome, {userName}
        </h1>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '1.35rem', 
          maxWidth: '700px',
          fontFamily: 'var(--font-main)',
          fontWeight: 500,
          lineHeight: '1.6'
        }}>
          Step into your personalized constructivist learning environment. Forge your ICT expertise through active exploration and discovery.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
          <button onClick={() => router.push('/student/modules')} className="btn btn-primary">
            Explore Modules
          </button>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline">
            Sign Out
          </button>
        </div>
      </section>

      {/* Progress Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
        <div className="peak-card" style={{ textAlign: 'center' }}>
          <h5 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Modules Available</h5>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--foreground)' }}>{modules.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.5rem' }}>Global Curriculum</div>
        </div>
        <div className="peak-card" style={{ textAlign: 'center' }}>
          <h5 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Mastered</h5>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--secondary)' }}>
            {progress.filter(p => p.status === 'completed').length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600, marginTop: '0.5rem' }}>Achievement Unlocked</div>
        </div>
        <div className="peak-card" style={{ textAlign: 'center' }}>
          <h5 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>In Progress</h5>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-light)' }}>
            {modules.length - progress.filter(p => p.status === 'completed').length}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600, marginTop: '0.5rem' }}>Active Evolution</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--primary)' }}>✦</span> Learning Path
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Sequential modules designed for cognitive scaffolding.</p>
        </div>
        <div className="tag-nigeria" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>
          NIGERIA ICT CURRICULUM v2.0
        </div>
      </div>

      {/* Module List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
        {loading ? (
          <div className="peak-card" style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', animation: 'spin 1s linear infinite' }}></div>
              <p>Calibrating your learning universe...</p>
            </div>
          </div>
        ) : modules.length > 0 ? (
          modules.map((mod) => {
            const status = getModuleStatus(mod._id);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';

            return (
              <div 
                key={mod._id} 
                className="peak-card" 
                style={{ 
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.6 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2.5rem'
                }} 
                onClick={() => !isLocked && router.push(`/student/learn/${mod._id}/intro`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div className="tag-nigeria" style={{ fontSize: '0.7rem' }}>
                    {typeof mod.topicId === 'object' ? mod.topicId.title : 'ICT CORE'}
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    background: isLocked ? 'var(--background)' : 'var(--primary-glow)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isCompleted ? '✅' : (isLocked ? '🔒' : '🚀')}
                  </div>
                </div>
                
                <h4 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', color: isLocked ? 'var(--text-muted)' : 'var(--foreground)' }}>
                  {mod.title}
                </h4>
                
                <p style={{ 
                  fontSize: '1rem', 
                  color: 'var(--text-muted)', 
                  marginBottom: '2.5rem', 
                  minHeight: '4.5rem',
                  lineHeight: '1.6'
                }}>
                  {mod.content.substring(0, 140)}{mod.content.length > 140 ? '...' : ''}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
                    <span style={{ 
                      fontSize: '1rem', 
                      fontWeight: 800, 
                      color: isCompleted ? 'var(--secondary)' : (isLocked ? 'var(--text-muted)' : 'var(--primary)')
                    }}>
                      {isCompleted ? 'Mastered' : (isLocked ? 'Encrypted' : 'Available')}
                    </span>
                  </div>
                  <button 
                    disabled={isLocked}
                    className={isCompleted ? "btn btn-outline" : "btn btn-primary"} 
                    style={{ 
                      fontSize: '0.9rem', 
                      padding: '0.75rem 1.5rem',
                    }}
                  >
                    {isCompleted ? 'Review' : (isLocked ? 'Unlock' : 'Start Journey')}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="peak-card" style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            <p style={{ fontSize: '1.25rem' }}>No modules found in this sector. 🛰️</p>
            <button className="btn btn-outline" style={{ marginTop: '1.5rem' }}>Refresh Database</button>
          </div>
        )}
      </div>

      {/* Quick Lab Section */}
      <section className="peak-card" style={{ 
        marginTop: '8rem', 
        background: 'linear-gradient(135deg, hsla(158, 94%, 30%, 0.05) 0%, hsla(199, 89%, 48%, 0.05) 100%)',
        padding: '4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '3.5rem' }}>
          <div style={{ 
            fontSize: '4rem', 
            background: 'white', 
            width: '100px', 
            height: '100px', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}>⚡</div>
          <div>
            <h3 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Constructivist Sandbox</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Test your theories, build components, and experiment in a zero-risk lab environment.</p>
          </div>
        </div>
        <LiveEditor />
      </section>
    </div>
  );
}
