'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import styles from './TeacherDashboard.module.css';

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
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
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

  if (loading) {
    return (
      <div className={styles.page}>
        <h2 className="gradient-text" style={{ fontSize: '2.5rem' }}>Teacher Hub</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Initializing pedagogical systems...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>Teacher Hub</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Architecting the next generation of ICT excellence through constructivist design.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Authenticated</p>
            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{teacherName}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline" style={{ padding: '0.6rem 1.2rem' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statNum}>{subjects.length}</div>
          <div className={styles.statLabel}>Subjects</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>{topics.length}</div>
          <div className={styles.statLabel}>Topics</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>{modules.length}</div>
          <div className={styles.statLabel}>5E Modules</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'subjects' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          📂 Subjects
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'topics' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          📚 Topics
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'modules' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('modules')}
        >
          ✨ 5E Modules
        </button>
      </div>

      {/* SUBJECTS TAB */}
      {activeTab === 'subjects' && (
        <div className={styles.content}>
          <form onSubmit={handleAddSubject} className={`peak-card ${styles.form}`}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--primary)' }}>➕</span> Create New Subject
            </h3>
            <div className={styles.formRow}>
              <div style={{ flex: 3 }}>
                <label className={styles.label}>Subject Title</label>
                <input
                  type="text"
                  placeholder="e.g., Computer Science"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className={styles.label}>Icon</label>
                <input
                  type="text"
                  placeholder="💻"
                  value={subIcon}
                  onChange={(e) => setSubIcon(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className={styles.label}>Brand Color</label>
                <input
                  type="color"
                  value={subColor}
                  onChange={(e) => setSubColor(e.target.value)}
                  className={styles.input}
                  style={{ padding: '0.4rem', height: '54px' }}
                />
              </div>
            </div>
            <div>
              <label className={styles.label}>Syllabus Overview</label>
              <textarea
                placeholder="Describe the overall scope and pedagogical goals of this subject..."
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                className={styles.textarea}
                required
              />
            </div>
            
            <div>
              <label className={styles.label}>
                Adaptive Contexts (Student Roles)
                <div className={styles.tooltipContainer}>
                  <div className={styles.infoIcon}>?</div>
                  <div className={styles.tooltipText}>Define the different backgrounds or roles your students might have. This enables AI and content to adapt to their real-world needs.</div>
                </div>
              </label>
              <div className={styles.formRow}>
                <input
                  type="text"
                  placeholder="Add role (e.g. Graphic Designer, Market Trader, Data Entry Clerk)"
                  value={currentSubContext}
                  onChange={(e) => setCurrentSubContext(e.target.value)}
                  className={styles.input}
                />
                <button type="button" onClick={addSubContext} className="btn btn-outline" style={{ minWidth: '120px' }}>Add Role</button>
              </div>
              <div className={styles.contextList} style={{ marginTop: '1.5rem' }}>
                {subContexts.map(ctx => (
                  <div key={ctx} className={styles.contextTag}>
                    {ctx} 
                    <span className={styles.removeTag} onClick={() => removeSubContext(ctx)}>✕</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
              Finalize Subject
            </button>
          </form>

          <div className={styles.list}>
            {subjects.length === 0 ? (
              <div className="peak-card" style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                <p>No subjects defined. Begin by creating your first academic sector.</p>
              </div>
            ) : (
              subjects.map((sub) => (
                <div key={sub._id} className={`peak-card ${styles.card}`} style={{ borderBottom: `4px solid ${sub.color}` }}>
                  <div className={styles.cardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className={styles.subjectIcon}>{sub.icon}</div>
                      <h4 style={{ fontSize: '1.75rem' }}>{sub.title}</h4>
                    </div>
                    <button onClick={() => handleDeleteSubject(sub._id)} className={styles.deleteBtn}>✕</button>
                  </div>
                  <p className={styles.cardDesc}>{sub.description}</p>
                  <div className={styles.contextList}>
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
        <div className={styles.content}>
          <form onSubmit={handleAddTopic} className={`peak-card ${styles.form}`}>
            <h3><span style={{ color: 'var(--primary)' }}>📖</span> Define New Topic</h3>
            <div className={styles.formRow}>
              <div style={{ flex: 1 }}>
                <label className={styles.label}>Parent Subject</label>
                <select
                  value={topicSubId}
                  onChange={(e) => setTopicSubId(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">Select Sector</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>{s.icon} {s.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className={styles.label}>Category</label>
                <select
                  value={topicCategory}
                  onChange={(e) => setTopicCategory(e.target.value)}
                  className={styles.select}
                >
                  <option value="General ICT">General ICT</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Digital Literacy">Digital Literacy</option>
                  <option value="Programming">Programming</option>
                </select>
              </div>
            </div>
            <div>
              <label className={styles.label}>Topic Title</label>
              <input
                type="text"
                placeholder="e.g., Introduction to Cloud Systems"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div>
              <label className={styles.label}>Learning Objectives</label>
              <textarea
                placeholder="What should the students understand following this topic?"
                value={topicDesc}
                onChange={(e) => setTopicDesc(e.target.value)}
                className={styles.textarea}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!topicSubId} style={{ alignSelf: 'flex-start' }}>
              Register Topic
            </button>
          </form>

          <div className={styles.list}>
            {topics.length === 0 ? (
              <div className="peak-card" style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                <p>No topics listed. Populate your subjects with specific learning areas.</p>
              </div>
            ) : (
              topics.map((topic) => (
                <div key={topic._id} className={`peak-card ${styles.card}`}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{topic.title}</h4>
                      <span className="tag-nigeria">{topic.category}</span>
                    </div>
                    <button onClick={() => handleDeleteTopic(topic._id)} className={styles.deleteBtn}>✕</button>
                  </div>
                  <p className={styles.cardDesc}>{topic.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODULES TAB */}
      {activeTab === 'modules' && (
        <div className={styles.content}>
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
                className={styles.input}
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
            
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Rapid Selection:</span>
              <button 
                 onClick={() => setAiInput('Data Processing: Database Management Systems Evolution')} 
                 className="btn btn-outline" 
                 style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}
              >
                📄 Import Syllabus Snippet
              </button>
            </div>
          </div>

          <form onSubmit={handleAddModule} className={`peak-card ${styles.form}`}>
            <h3><span style={{ color: 'var(--primary)' }}>🛠️</span> Module Constructor</h3>
            
            <div className={styles.formRow}>
              <div style={{ flex: 2 }}>
                <label className={styles.label}>Reference Topic</label>
                <select
                  value={modTopicId}
                  onChange={(e) => setModTopicId(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">Select Topic</option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>{t.title}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className={styles.label}>Module Type</label>
                <select
                  value={modType}
                  onChange={(e) => setModType(e.target.value as 'lesson' | 'activity' | 'project')}
                  className={styles.select}
                >
                  <option value="lesson">📖 Lesson</option>
                  <option value="activity">🛠️ Activity</option>
                  <option value="project">🚀 Project</option>
                </select>
              </div>
            </div>

            <div>
              <label className={styles.label}>Module Title</label>
              <input
                type="text"
                placeholder="Display title for the student"
                value={modTitle}
                onChange={(e) => setModTitle(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            
            <div>
              <label className={styles.label}>Foundation Overview</label>
              <textarea
                placeholder="Initial narrative or conceptual introduction..."
                value={modContent}
                onChange={(e) => setModContent(e.target.value)}
                className={styles.textarea}
                required
              />
            </div>

            <div className={styles.label}>
              Step 1: Engage (The Hook)
              <div className={styles.tooltipContainer}>
                <div className={styles.infoIcon}>?</div>
                <div className={styles.tooltipText}>Spark curiosity with a visual aid, puzzle, or provocative question that relates to the student&apos;s background.</div>
              </div>
            </div>
            <textarea
              placeholder="e.g., Show a picture of a crowded market. Ask: 'How can we track 500 different sales instantly?'"
              value={modEngage}
              onChange={(e) => setModEngage(e.target.value)}
              className={styles.textarea}
            />

            <div className={styles.label}>
              Step 2: Explore (Discovery)
              <div className={styles.tooltipContainer}>
                <div className={styles.infoIcon}>?</div>
                <div className={styles.tooltipText}>Hands-on activity. Let students play with data or tools before explaining the theory.</div>
              </div>
            </div>
            <textarea
              placeholder="e.g., Provide a raw table of data and ask students to find the highest spender manually."
              value={modExplore}
              onChange={(e) => setModExplore(e.target.value)}
              className={styles.textarea}
            />

            <div className={styles.label}>
              Step 3: Explain (Mental Model)
              <div className={styles.tooltipContainer}>
                <div className={styles.infoIcon}>?</div>
                <div className={styles.tooltipText}>Bridge the gap between their discovery and formal ICT concepts/definitions.</div>
              </div>
            </div>
            <textarea
              placeholder="e.g., Introduce SQL SELECT statements and how they automate their manual search process."
              value={modExplain}
              onChange={(e) => setModExplain(e.target.value)}
              className={styles.textarea}
            />

            <div className={styles.label}>Step 4: Elaborate (Real-world Scaffolding)</div>
            <div className={styles.contextGroup}>
              {currentModuleContexts.length === 0 ? (
                <p style={{ color: 'var(--accent)', fontWeight: 700 }}>
                  ⚠️ No roles defined for this subject. Please add &apos;Adaptive Contexts&apos; in the Subjects tab.
                </p>
              ) : (
                currentModuleContexts.map((opt) => (
                  <div key={opt} style={{ marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>Scenario for: {opt}</p>
                    <textarea
                      className={styles.textarea}
                      placeholder={`Adapt the learning for a student working as a ${opt}...`}
                      value={modElaborate[opt] || ''}
                      onChange={(e) =>
                        setModElaborate({ ...modElaborate, [opt]: e.target.value })
                      }
                    />
                  </div>
                ))
              )}
            </div>

            <div className={styles.label} style={{ marginTop: '2rem' }}>
              Step 5: Evaluate (Mastery Check)
              <div className={styles.tooltipContainer}>
                <div className={styles.infoIcon}>?</div>
                <div className={styles.tooltipText}>Formative assessment. Exit tickets, reflections, or practical challenges.</div>
              </div>
            </div>
            <textarea
              placeholder="e.g., Student must write a query to solve a new logistics problem for a local delivery business."
              value={modEvaluate}
              onChange={(e) => setModEvaluate(e.target.value)}
              className={styles.textarea}
            />

            <button type="submit" className="btn btn-primary" style={{ marginTop: '3rem', alignSelf: 'flex-start', padding: '1rem 3rem' }}>
              Publish Module to Network
            </button>
          </form>

          <div className={styles.list}>
            {modules.length === 0 ? (
              <div className="peak-card" style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                <p>System offline. No active modules found in this sector.</p>
              </div>
            ) : (
              modules.map((mod) => (
                <div key={mod._id} className={`peak-card ${styles.card}`}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h4 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{mod.title}</h4>
                      <span className={styles.typeBadge} data-type={mod.type}>
                        {mod.type === 'lesson' ? '📖' : mod.type === 'activity' ? '🛠️' : '🚀'} {mod.type}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteModule(mod._id)} className={styles.deleteBtn}>✕</button>
                  </div>
                  <p className={styles.cardDesc}>{mod.content.substring(0, 150)}...</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
