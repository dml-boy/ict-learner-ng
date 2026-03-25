import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import LiveEditor from '@/components/LiveEditor';

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
        padding: '4rem 1rem', 
        marginBottom: '4rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div className="animate-float" style={{ 
          fontSize: '4rem', 
          marginBottom: '1.5rem',
          background: 'rgba(99, 102, 241, 0.1)',
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          boxShadow: '0 0 30px var(--primary-glow)'
        }}>
          🎓
        </div>
        <h1 className="gradient-text" style={{ fontSize: '4.5rem', marginBottom: '1rem', lineHeight: '1.1' }}>
          Welcome, {userName}
        </h1>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '1.25rem', 
          maxWidth: '600px',
          fontFamily: 'var(--font-alt)',
          fontWeight: 300
        }}>
          Construct your knowledge through immersive modules and hands-on ICT challenges.
        </p>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn-secondary" style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
          Sign Out
        </button>
      </section>

      {/* Progress Overview (Mock) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '4rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h5 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Courses</h5>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{modules.length}</div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h5 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Completed</h5>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>
            {progress.filter(p => p.status === 'completed').length}
          </div>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h5 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Ongoing</h5>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
            {modules.length - progress.filter(p => p.status === 'completed').length}
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: 'var(--primary)' }}>✦</span> Current Modules
      </h3>

      {/* Module List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
        {loading ? (
          <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            <p className="animate-pulse">Gathering your learning universe...</p>
          </div>
        ) : modules.length > 0 ? (
          modules.map((mod) => {
            const status = getModuleStatus(mod._id);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';

            return (
              <div 
                key={mod._id} 
                className="glass-card" 
                style={{ 
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.5 : 1,
                  borderBottom: isCompleted ? '4px solid var(--secondary)' : (isLocked ? 'none' : '4px solid var(--primary)')
                }} 
                onClick={() => !isLocked && router.push(`/student/learn/${mod._id}/intro`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div className="tag-nigeria" style={{ fontSize: '0.65rem' }}>
                    {typeof mod.topicId === 'object' ? mod.topicId.title : 'General ICT'}
                  </div>
                  <div style={{ fontSize: '1.2rem' }}>
                    {isCompleted ? '✅' : (isLocked ? '🔒' : '🔥')}
                  </div>
                </div>
                
                <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: isLocked ? 'inherit' : 'white' }}>
                  {mod.title}
                </h4>
                
                <p style={{ 
                  fontSize: '0.95rem', 
                  color: 'var(--text-muted)', 
                  marginBottom: '2rem', 
                  minHeight: '4rem',
                  fontFamily: 'var(--font-alt)'
                }}>
                  {mod.content.substring(0, 120)}{mod.content.length > 120 ? '...' : ''}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</span>
                    <span style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 700, 
                      color: isCompleted ? 'var(--secondary)' : (isLocked ? 'var(--text-muted)' : 'var(--primary)')
                    }}>
                      {isCompleted ? 'Mastered' : (isLocked ? 'Locked' : 'Available')}
                    </span>
                  </div>
                  <button 
                    disabled={isLocked}
                    className="btn-primary" 
                    style={{ 
                      fontSize: '0.85rem', 
                      padding: '0.6rem 1.2rem',
                    }}
                  >
                    {isCompleted ? 'Review' : (isLocked ? 'Explore' : 'Jump In')}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
            <p>No modules found in this sector. 🛰️</p>
          </div>
        )}
      </div>

      {/* Quick Lab Section */}
      <section className="glass-card" style={{ 
        marginTop: '6rem', 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
        border: '1px solid var(--primary-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem' }}>⚡</div>
          <div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Interactive Sandbox</h3>
            <p style={{ color: 'var(--text-muted)' }}>Apply your constructivist theories in real-time. No limits.</p>
          </div>
        </div>
        <LiveEditor />
      </section>
    </div>
  );
}
