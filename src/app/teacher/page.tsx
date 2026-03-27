'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

interface Subject {
  _id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  allowedContexts: string[];
  createdAt: string;
}

interface Topic {
  _id: string;
  title: string;
  description: string;
  category: string;
  subjectId: string | Subject;
  createdAt: string;
}

interface Module {
  _id: string;
  title: string;
  content: string;
  topicId: { _id: string; title: string } | string;
  type: 'lesson' | 'activity' | 'project';
  constructivistNote: string;
  // 5E Framework
  engage: string;
  explore: string;
  explain: string;
  elaborate: Record<string, string>;
  evaluate: string;
  createdAt: string;
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const teacherName = session?.user?.name || 'Teacher';
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeTab, setActiveTab] = useState<'subjects' | 'topics' | 'modules'>('subjects');

  // Subject form
  const [subTitle, setSubTitle] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subIcon, setSubIcon] = useState('📚');
  const [subColor, setSubColor] = useState('#3b82f6');
  const [subContexts, setSubContexts] = useState<string[]>([]);
  const [currentSubContext, setCurrentSubContext] = useState('');

  // Topic form
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [topicCategory, setTopicCategory] = useState('General ICT');
  const [topicSubId, setTopicSubId] = useState('');

  // Module form
  const [modTitle, setModTitle] = useState('');
  const [modContent, setModContent] = useState('');
  const [modTopicId, setModTopicId] = useState('');
  const [modType, setModType] = useState<'lesson' | 'activity' | 'project'>('lesson');
  const [modNote, setModNote] = useState('');
  
  // 5E Framework State
  const [modEngage, setModEngage] = useState('');
  const [modExplore, setModExplore] = useState('');
  const [modExplain, setModExplain] = useState('');
  const [modElaborate, setModElaborate] = useState<Record<string, string>>({});
  const [modEvaluate, setModEvaluate] = useState('');
  
  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiInput, setAiInput] = useState('');

  // Derived state: Get contexts for current topic's subject
  const currentModuleContexts = useMemo(() => {
    if (!modTopicId) return [];
    const topic = topics.find(t => t._id === modTopicId);
    if (!topic) return [];
    const subject = subjects.find(s => s._id === (typeof topic.subjectId === 'string' ? topic.subjectId : topic.subjectId?._id));
    return subject?.allowedContexts || [];
  }, [modTopicId, topics, subjects]);

  const fetchSubjects = useCallback(async () => {
    const res = await fetch('/api/subjects');
    const data = await res.json();
    if (data.success) setSubjects(data.data);
  }, []);

  const fetchTopics = useCallback(async () => {
    const res = await fetch('/api/topics');
    const data = await res.json();
    if (data.success) setTopics(data.data);
  }, []);

  const fetchModules = useCallback(async () => {
    const res = await fetch('/api/modules');
    const data = await res.json();
    if (data.success) setModules(data.data);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchSubjects(), fetchTopics(), fetchModules()]);
    };
    loadData();
  }, [fetchSubjects, fetchTopics, fetchModules]);

  const addSubContext = () => {
    if (currentSubContext && !subContexts.includes(currentSubContext)) {
      setSubContexts([...subContexts, currentSubContext]);
      setCurrentSubContext('');
    }
  };

  const removeSubContext = (ctx: string) => {
    setSubContexts(subContexts.filter((c) => c !== ctx));
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: subTitle, description: subDesc, icon: subIcon, color: subColor, allowedContexts: subContexts }),
    });
    const data = await res.json();
    if (data.success) {
      setSubjects([data.data, ...subjects]);
      setSubTitle('');
      setSubDesc('');
      setSubContexts([]);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    const res = await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setSubjects(subjects.filter((s) => s._id !== id));
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: topicTitle, description: topicDesc, category: topicCategory, subjectId: topicSubId }),
    });
    const data = await res.json();
    if (data.success) {
      setTopics([data.data, ...topics]);
      setTopicTitle('');
      setTopicDesc('');
      setTopicSubId('');
    }
  };

  const handleDeleteTopic = async (id: string) => {
    const res = await fetch(`/api/topics/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setTopics(topics.filter((t) => t._id !== id));
    }
  };

  const handleAIGenerate = async () => {
    if (!aiInput) return alert('Please enter a topic or upload a syllabus first.');
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: aiInput, 
          contextOptions: currentModuleContexts 
        }),
      });
      const result = await res.json();
      if (result.success) {
        const { data } = result;
        setModEngage(data.engage);
        setModExplore(data.explore);
        setModExplain(data.explain);
        setModElaborate(data.elaborate);
        setModEvaluate(data.evaluate);
        alert('✨ 5E Module successfully constructed by AI!');
      }
    } catch (err) {
      console.error(err);
      alert('AI Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: modTitle,
        content: modContent,
        topicId: modTopicId,
        type: modType,
        constructivistNote: modNote,
        engage: modEngage,
        explore: modExplore,
        explain: modExplain,
        elaborate: modElaborate,
        evaluate: modEvaluate,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setModules([data.data, ...modules]);
      // Reset form
      setModTitle('');
      setModContent('');
      setModTopicId('');
      setModNote('');
      setModEngage('');
      setModExplore('');
      setModExplain('');
      setModElaborate({});
      setModEvaluate('');
    }
  };

  const handleDeleteModule = async (id: string) => {
    const res = await fetch(`/api/modules/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setModules(modules.filter((m) => m._id !== id));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="auth-header" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div className="auth-logo-wrapper" style={{ margin: 0, width: '60px', height: '60px' }}>
            <Image src="/logosm.svg" alt="ICT Learner NG" width={60} height={55} priority />
          </div>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>Teacher Hub</h2>
            <p className="auth-subtitle">Architecting the next generation of ICT excellence.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingBottom: '0.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>Authenticated Architect</p>
            <p style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--foreground)' }}>{teacherName}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline" style={{ padding: '0.6rem 1.5rem' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="peak-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--foreground)', marginBottom: '0.5rem' }}>{subjects.length}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sectors</div>
        </div>
        <div className="peak-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem' }}>{topics.length}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Clusters</div>
        </div>
        <div className="peak-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '0.5rem' }}>{modules.length}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>5E Blueprints</div>
        </div>
      </div>

      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'subjects' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          📂 Subjects
        </button>
        <button
          className={`tab-btn ${activeTab === 'topics' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          📚 Topics
        </button>
        <button
          className={`tab-btn ${activeTab === 'modules' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('modules')}
        >
          ✨ 5E Modules
        </button>
      </div>

      {/* SUBJECTS TAB */}
      {activeTab === 'subjects' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <form onSubmit={handleAddSubject} className="peak-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ color: 'var(--primary)' }}>➕</span> Create New Subject
            </h3>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 3 }}>
                <label className="auth-label">Subject Title</label>
                <input
                  type="text"
                  placeholder="e.g., Computer Science"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="auth-label">Icon</label>
                <input
                  type="text"
                  placeholder="💻"
                  value={subIcon}
                  onChange={(e) => setSubIcon(e.target.value)}
                  className="input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="auth-label">Brand Color</label>
                <input
                  type="color"
                  value={subColor}
                  onChange={(e) => setSubColor(e.target.value)}
                  className="input"
                  style={{ padding: '0.4rem', height: '54px' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="auth-label">Syllabus Overview</label>
              <textarea
                placeholder="Describe the overall scope and pedagogical goals of this subject..."
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                className="input"
                style={{ minHeight: '120px', resize: 'vertical' }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label className="auth-label">
                Adaptive Contexts (Student Roles)
                <div className="info-tooltip" data-tooltip="Define the different backgrounds or roles your students might have. This enables AI and content to adapt to their real-world needs.">
                  <div style={{ width: '20px', height: '20px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, marginLeft: '0.5rem' }}>?</div>
                </div>
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Add role (e.g. Graphic Designer, Market Trader, Data Entry Clerk)"
                  value={currentSubContext}
                  onChange={(e) => setCurrentSubContext(e.target.value)}
                  className="input"
                />
                <button type="button" onClick={addSubContext} className="btn btn-outline" style={{ minWidth: '120px' }}>Add Role</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
                {subContexts.map(ctx => (
                  <div key={ctx} style={{ background: 'white', border: '1px solid var(--primary-light)', padding: '0.5rem 1.25rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 12px var(--primary-glow)' }}>
                    {ctx} 
                    <span style={{ cursor: 'pointer', color: '#ef4444', fontSize: '1.2rem', lineHeight: 1 }} onClick={() => removeSubContext(ctx)}>✕</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              Finalize Subject
            </button>
          </form>

          <div className="dashboard-grid">
            {subjects.length === 0 ? (
              <div className="peak-card" style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                <p>No subjects defined. Begin by creating your first academic sector.</p>
              </div>
            ) : (
              subjects.map((sub) => (
                <div key={sub._id} className="peak-card" style={{ borderBottom: `6px solid ${sub.color}`, padding: '2.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="badge-icon" style={{ marginRight: '1.5rem' }}>{sub.icon}</div>
                      <h4 style={{ fontSize: '1.75rem' }}>{sub.title}</h4>
                    </div>
                    <button onClick={() => handleDeleteSubject(sub._id)} style={{ background: 'hsla(0, 72%, 51%, 0.05)', color: '#ef4444', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>✕</button>
                  </div>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>{sub.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {sub.allowedContexts.map(ctx => (
                      <span key={ctx} className="tag-nigeria" style={{ fontSize: '0.65rem' }}>{ctx}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TOPICS TAB */}
      {activeTab === 'topics' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <form onSubmit={handleAddTopic} className="peak-card">
            <h3><span style={{ color: 'var(--primary)' }}>📖</span> Define New Topic</h3>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label className="auth-label">Parent Subject</label>
                <select
                  value={topicSubId}
                  onChange={(e) => setTopicSubId(e.target.value)}
                  className="input"
                  style={{ cursor: 'pointer' }}
                  required
                >
                  <option value="">Select Sector</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>{s.icon} {s.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="auth-label">Category</label>
                <select
                  value={topicCategory}
                  onChange={(e) => setTopicCategory(e.target.value)}
                  className="input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="General ICT">General ICT</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Digital Literacy">Digital Literacy</option>
                  <option value="Programming">Programming</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="auth-label">Topic Title</label>
              <input
                type="text"
                placeholder="e.g., Introduction to Cloud Systems"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className="input"
                required
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label className="auth-label">Learning Objectives</label>
              <textarea
                placeholder="What should the students understand following this topic?"
                value={topicDesc}
                onChange={(e) => setTopicDesc(e.target.value)}
                className="input"
                style={{ minHeight: '120px', resize: 'vertical' }}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!topicSubId} style={{ alignSelf: 'flex-start' }}>
              Register Topic
            </button>
          </form>

          <div className="dashboard-grid">
            {topics.length === 0 ? (
              <div className="peak-card" style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                <p>No topics listed. Populate your subjects with specific learning areas.</p>
              </div>
            ) : (
              topics.map((topic) => (
                <div key={topic._id} className="peak-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{topic.title}</h4>
                      <span className="tag-nigeria">{topic.category}</span>
                    </div>
                    <button onClick={() => handleDeleteTopic(topic._id)} style={{ background: 'hsla(0, 72%, 51%, 0.05)', color: '#ef4444', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>✕</button>
                  </div>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{topic.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODULES TAB */}
      {activeTab === 'modules' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          <div className="peak-card" style={{ 
            background: 'linear-gradient(135deg, hsla(158, 94%, 30%, 0.1) 0%, hsla(199, 89%, 48%, 0.05) 100%)',
            border: '2px solid var(--primary-light)',
            padding: '3rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '2rem' }}>
              <span style={{ fontSize: '2.5rem' }}>⚡</span> Magic 5E AI Architect
            </h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '800px' }}>
              Our AI Pedagogical Expert will construct a complete 5E-compliant module based on your topic. This includes Nigerian context scenarios.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Enter topic/syllabus snippet (e.g. Binary Logic Gates)..." 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="input"
                style={{ flex: 1, height: '60px', fontSize: '1.1rem' }}
              />
              <button 
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="btn btn-primary"
                style={{ minWidth: '220px', height: '60px', fontSize: '1.1rem' }}
              >
                {isGenerating ? 'Architecting...' : 'Construct 5E ⚡'}
              </button>
            </div>
          </div>

          <form onSubmit={handleAddModule} className="peak-card">
            <h3 style={{ marginBottom: '2rem' }}><span style={{ color: 'var(--primary)' }}>🛠️</span> Module Constructor</h3>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 2 }}>
                <label className="auth-label">Reference Topic</label>
                <select
                  value={modTopicId}
                  onChange={(e) => setModTopicId(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select Topic</option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>{t.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="auth-label">Module Type</label>
                <select
                  value={modType}
                  onChange={(e) => setModType(e.target.value as 'lesson' | 'activity' | 'project')}
                  className="input"
                >
                  <option value="lesson">📖 Lesson</option>
                  <option value="activity">🛠️ Activity</option>
                  <option value="project">🚀 Project</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="auth-label">Module Title</label>
              <input
                type="text"
                placeholder="Display title for the student"
                value={modTitle}
                onChange={(e) => setModTitle(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label className="auth-label">Foundation Overview</label>
              <textarea
                placeholder="Initial narrative or conceptual introduction..."
                value={modContent}
                onChange={(e) => setModContent(e.target.value)}
                className="input"
                style={{ minHeight: '120px', resize: 'vertical' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <div>
                <label className="auth-label">Step 1: Engage (The Hook)</label>
                <textarea
                  placeholder="Spark curiosity..."
                  value={modEngage}
                  onChange={(e) => setModEngage(e.target.value)}
                  className="input"
                  style={{ minHeight: '100px' }}
                />
              </div>
              <div>
                <label className="auth-label">Step 2: Explore (Discovery)</label>
                <textarea
                  placeholder="Hands-on activity..."
                  value={modExplore}
                  onChange={(e) => setModExplore(e.target.value)}
                  className="input"
                  style={{ minHeight: '100px' }}
                />
              </div>
              <div>
                <label className="auth-label">Step 3: Explain (Mental Model)</label>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
                  At the end of this lesson student should be able to:
                </p>
                <textarea
                  placeholder="Bridge the gap between discovery and theory..."
                  value={modExplain}
                  onChange={(e) => setModExplain(e.target.value)}
                  className="input"
                  style={{ minHeight: '100px' }}
                />
              </div>
            </div>

            <div style={{ background: 'hsla(210, 40%, 98%, 1)', padding: '2.5rem', borderRadius: 'var(--radius-md)', border: '2px dashed var(--card-border)', marginBottom: '3rem' }}>
              <label className="auth-label" style={{ marginBottom: '1.5rem' }}>Step 4: Elaborate (Adaptive Scaffolding)</label>
              {currentModuleContexts.length === 0 ? (
                <p style={{ color: 'var(--accent)', fontWeight: 800 }}>
                  ⚠️ No roles defined for this subject.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {currentModuleContexts.map((opt) => (
                    <div key={opt}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary)' }}>Scenario for: {opt}</p>
                      <textarea
                        className="input"
                        placeholder={`Adaptation for ${opt}...`}
                        value={modElaborate[opt] || ''}
                        onChange={(e) => setModElaborate({ ...modElaborate, [opt]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <label className="auth-label">Step 5: Evaluate (Mastery Check)</label>
              <textarea
                placeholder="Practical challenge or reflection..."
                value={modEvaluate}
                onChange={(e) => setModEvaluate(e.target.value)}
                className="input"
                style={{ minHeight: '100px' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>
              Publish Blueprint
            </button>
          </form>

          <div className="dashboard-grid">
            {modules.length === 0 ? (
              <div className="peak-card" style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                <p>No active blueprints found.</p>
              </div>
            ) : (
              modules.map((mod) => (
                <div key={mod._id} className="peak-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{mod.title}</h4>
                      <span className="tag-nigeria">
                        {mod.type === 'lesson' ? '📖' : mod.type === 'activity' ? '🛠️' : '🚀'} {mod.type}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteModule(mod._id)} style={{ background: 'hsla(0, 72%, 51%, 0.05)', color: '#ef4444', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>✕</button>
                  </div>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{mod.content.substring(0, 120)}...</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
