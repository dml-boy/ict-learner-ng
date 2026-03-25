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
        <h2 className="gradient-text" style={{ fontSize: '2.5rem' }}>Teacher Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading your content...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h2 className="gradient-text" style={{ fontSize: '2.5rem' }}>Teacher Dashboard</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage subjects, topics, and constructivist modules with AI assistance.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Logged in as <strong style={{ color: 'white' }}>{teacherName}</strong></span>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            Sign Out
          </button>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{subjects.length}</span>
            <span className={styles.statLabel}>Subjects</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{topics.length}</span>
            <span className={styles.statLabel}>Topics</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{modules.length}</span>
            <span className={styles.statLabel}>Modules</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'subjects' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          📁 Subjects
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
          📦 Modules
        </button>
      </div>

      {/* SUBJECTS TAB */}
      {activeTab === 'subjects' && (
        <div className={styles.content}>
          <form onSubmit={handleAddSubject} className={`glass-card ${styles.form}`}>
            <h3>Add New Subject</h3>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="Subject title (e.g., Computer Science)"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                className={styles.input}
                style={{ flex: 3 }}
                required
              />
              <input
                type="text"
                placeholder="Icon (e.g., 💻)"
                value={subIcon}
                onChange={(e) => setSubIcon(e.target.value)}
                className={styles.input}
                style={{ flex: 1 }}
              />
              <input
                type="color"
                value={subColor}
                onChange={(e) => setSubColor(e.target.value)}
                className={styles.input}
                style={{ flex: 1, padding: '0.25rem', height: '45px' }}
              />
            </div>
            <textarea
              placeholder="Describe the overall scope of this subject..."
              value={subDesc}
              onChange={(e) => setSubDesc(e.target.value)}
              className={styles.textarea}
              required
            />
            <div className={styles.label}>Subject Contexts (Student Roles)</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Define the different backgrounds/roles students might have for this subject (e.g. &quot;Trader&quot;, &quot;Policy Maker&quot;).
            </p>
            <div className={styles.formRow}>
              <input
                type="text"
                placeholder="New context (e.g. Student)"
                value={currentSubContext}
                onChange={(e) => setCurrentSubContext(e.target.value)}
                className={styles.input}
              />
              <button type="button" onClick={addSubContext} className="btn-secondary">Add</button>
            </div>
            <div className={styles.contextList} style={{ marginTop: '0.5rem' }}>
              {subContexts.map(ctx => (
                <div key={ctx} className={styles.contextTag}>
                  {ctx} 
                  <span className={styles.removeTag} onClick={() => removeSubContext(ctx)}>✕</span>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Subject</button>
          </form>

          <div className={styles.list}>
            {subjects.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No subjects yet. Create your first subject above!</p>
              </div>
            ) : (
              subjects.map((sub) => (
                <div key={sub._id} className={`glass-card ${styles.card}`} style={{ borderLeft: `8px solid ${sub.color}` }}>
                  <div className={styles.cardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className={styles.subjectIcon}>{sub.icon}</span>
                      <h4>{sub.title}</h4>
                    </div>
                    <button onClick={() => handleDeleteSubject(sub._id)} className={styles.deleteBtn}>✕</button>
                  </div>
                  <p className={styles.cardDesc}>{sub.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TOPICS TAB */}
      {activeTab === 'topics' && (
        <div className={styles.content}>
          <form onSubmit={handleAddTopic} className={`glass-card ${styles.form}`}>
            <h3>Add New Topic</h3>
            <select
              value={topicSubId}
              onChange={(e) => setTopicSubId(e.target.value)}
              className={styles.select}
              required
            >
              <option value="">Select Parent Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>{s.icon} {s.title}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Topic title (e.g., Introduction to HTML)"
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
              className={styles.input}
              required
            />
            <textarea
              placeholder="Describe the topic and its learning objectives..."
              value={topicDesc}
              onChange={(e) => setTopicDesc(e.target.value)}
              className={styles.textarea}
              required
            />
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
            <button type="submit" className="btn btn-primary" disabled={!topicSubId}>Add Topic</button>
          </form>

          <div className={styles.list}>
            {topics.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No topics yet. Create your first topic above!</p>
              </div>
            ) : (
              topics.map((topic) => (
                <div key={topic._id} className={`glass-card ${styles.card}`}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h4>{topic.title}</h4>
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
          <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)', background: 'rgba(99, 102, 241, 0.05)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚡</span> Magic 5E AI Generator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Paste a topic idea or syllabus snippet below to auto-construct a constructivist 5E lesson.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="e.g. Differentiation in Calculus or Binary Arithmetic" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="input-base"
                style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem', borderRadius: '8px' }}
              />
              <button 
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="btn-primary"
                style={{ background: 'var(--primary)', minWidth: '150px' }}
              >
                {isGenerating ? 'Constructing...' : 'Construct 5E ⚡'}
              </button>
            </div>
            
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR:</span>
              <button 
                 onClick={() => setAiInput('Extracted Syllabus: Data Processing Module 4 - Information Systems Evolution')} 
                 className="btn-secondary" 
                 style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                📁 Simulate Syllabus PDF Upload
              </button>
            </div>
          </div>

          <form onSubmit={handleAddModule} className={`glass-card ${styles.form}`}>
            <h3>Add New Constructivist Module</h3>
            
            <div className={styles.formRow}>
              <select
                value={modTopicId}
                onChange={(e) => setModTopicId(e.target.value)}
                className={styles.select}
                required
                style={{ flex: 2 }}
              >
                <option value="">Select a Topic</option>
                {topics.map((t) => (
                  <option key={t._id} value={t._id}>{t.title}</option>
                ))}
              </select>
              <select
                value={modType}
                onChange={(e) => setModType(e.target.value as 'lesson' | 'activity' | 'project')}
                className={styles.select}
                style={{ flex: 1 }}
              >
                <option value="lesson">📖 Lesson</option>
                <option value="activity">🛠️ Activity</option>
                <option value="project">🚀 Project</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Module title"
              value={modTitle}
              onChange={(e) => setModTitle(e.target.value)}
              className={styles.input}
              required
            />
            
            <textarea
              placeholder="Brief introduction or overview content for this module..."
              value={modContent}
              onChange={(e) => setModContent(e.target.value)}
              className={styles.textarea}
              required
            />

            <div className={styles.label}>
              Step 1: Engage (The Hook)
              <div className={styles.tooltipContainer}>
                <span className={styles.infoIcon}>?</span>
                <span className={styles.tooltipText}>Create a puzzle or question to activate prior knowledge and create curiosity.</span>
              </div>
            </div>
            <textarea
              placeholder="e.g., Project a complex curve. Ask: 'What is the slope exactly at this single point?'"
              value={modEngage}
              onChange={(e) => setModEngage(e.target.value)}
              className={styles.textarea}
            />

            <div className={styles.label}>
              Step 2: Explore (Hands-on Investigation)
              <div className={styles.tooltipContainer}>
                <span className={styles.infoIcon}>?</span>
                <span className={styles.tooltipText}>Provide a task where students experiment or manipulate concepts before being told the rules.</span>
              </div>
            </div>
            <textarea
              placeholder="e.g., Use Desmos to pick two points and move them closer and closer together. Observe the slope."
              value={modExplore}
              onChange={(e) => setModExplore(e.target.value)}
              className={styles.textarea}
            />

            <div className={styles.label}>
              Step 3: Explain (Formal Concept)
              <div className={styles.tooltipContainer}>
                <span className={styles.infoIcon}>?</span>
                <span className={styles.tooltipText}>Now introduce the formal definitions and formulas based on their exploration.</span>
              </div>
            </div>
            <textarea
              placeholder="e.g., Introduce the limit definition of the derivative: f'(x) = lim h->0 ..."
              value={modExplain}
              onChange={(e) => setModExplain(e.target.value)}
              className={styles.textarea}
            />

            <div className={styles.label}>Step 4: Elaborate (Adaptive Extensions)</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              How does this apply to different real-world roles? (Inherited from Subject)
            </p>
            <div className={styles.contextGroup}>
              {currentModuleContexts.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>
                  ⚠️ No contexts defined for this subject. Add them in the Subjects tab to enable adaptive content.
                </p>
              ) : (
                currentModuleContexts.map((opt) => (
                  <div key={opt} style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Applied Scenario for: {opt}</p>
                    <textarea
                      className={styles.textarea}
                      placeholder={`Explain how this concept applies specifically to a ${opt}`}
                      value={modElaborate[opt] || ''}
                      onChange={(e) =>
                        setModElaborate({ ...modElaborate, [opt]: e.target.value })
                      }
                    />
                  </div>
                ))
              )}
            </div>

            <div className={styles.label}>
              Step 5: Evaluate (Assessment & Reflection)
              <div className={styles.tooltipContainer}>
                <span className={styles.infoIcon}>?</span>
                <span className={styles.tooltipText}>Assess mastery through reflections, quizzes, or exit tickets.</span>
              </div>
            </div>
            <textarea
              placeholder="e.g., Write a 'Letter to a Friend' explaining what a derivative actually represents."
              value={modEvaluate}
              onChange={(e) => setModEvaluate(e.target.value)}
              className={styles.textarea}
            />

            <button type="submit" className="btn btn-primary" style={{ marginTop: '2rem' }}>Publish 5E Module</button>
          </form>

          <div className={styles.list}>
            {modules.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No modules yet. Create your first module above!</p>
              </div>
            ) : (
              modules.map((mod) => (
                <div key={mod._id} className={`glass-card ${styles.card}`}>
                  <div className={styles.cardHeader}>
                    <div>
                      <h4>{mod.title}</h4>
                      <span className={styles.typeBadge} data-type={mod.type}>
                        {mod.type === 'lesson' ? '📖' : mod.type === 'activity' ? '🛠️' : '🚀'} {mod.type}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteModule(mod._id)} className={styles.deleteBtn}>✕</button>
                  </div>
                  <p className={styles.cardDesc}>{mod.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
