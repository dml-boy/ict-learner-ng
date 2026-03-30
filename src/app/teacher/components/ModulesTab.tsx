import { useState, useRef } from 'react';
import { Subject, Topic, Question, Module, AiGeneratedData } from '@/types';

export default function ModulesTab({ modules, setModules, topics, subjects }: { 
  modules: Module[], 
  setModules: (m: Module[]) => void, 
  topics: Topic[], 
  subjects: Subject[] 
}) {
  const [modTitle, setModTitle] = useState('');
  const [modContent, setModContent] = useState('');
  const [modTopicId, setModTopicId] = useState('');
  const [modType, setModType] = useState<'lesson' | 'activity' | 'project'>('lesson');
  const [isUploading, setIsUploading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState<AiGeneratedData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are supported for automated extraction.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/modules/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.text) {
        // Append or replace the content
        setModContent(prev => prev ? `${prev}\n\n--- PDF EXTRACTION ---\n${data.data.text}` : data.data.text);
        alert(`Successfully extracted text from ${data.data.pageCount} pages.`);
      } else {
        throw new Error(data.error || 'Extraction failed');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to extract PDF. Make sure it contains readable text and not scanned images.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSynthesize = async () => {
    if (!modTitle || !modContent || !modTopicId) {
      alert('Please provide a title, topic, and foundational content first.');
      return;
    }

    setIsSynthesizing(true);
    try {
      // Find the allowed contexts for the selected topic's subject
      const selectedTopic = topics.find(t => t._id === modTopicId);
      const subjectId = typeof selectedTopic?.subjectId === 'object' ? selectedTopic.subjectId._id : selectedTopic?.subjectId;
      const selectedSubject = subjects.find(s => s._id === subjectId);
      const contextOptions = selectedSubject?.allowedContexts || ['Student', 'Professional', 'Entrepreneur'];

      const res = await fetch('/api/ai/generate-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: modContent,
          contextOptions
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiGeneratedData(data.data);
      } else {
        throw new Error(data.error || 'Synthesis failed');
      }
    } catch (err) {
      console.error(err);
      alert('AI Engine failure. Please try again or refine your input.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiGeneratedData) return;

    const res = await fetch('/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: modTitle, 
        content: modContent, 
        topicId: modTopicId, 
        type: modType,
        ...aiGeneratedData
      }),
    });
    const data = await res.json();
    if (data.success) {
      setModules([data.data, ...modules]);
      setModTitle(''); setModContent(''); setModTopicId('');
      setAiGeneratedData(null);
    }
  };

  const handleDeleteModule = async (id: string) => {
    const res = await fetch(`/api/modules/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) setModules(modules.filter((m) => m._id !== id));
  };

  return (
    <div className="animate-fade-in flex flex-col gap-12">
      <div className="peak-card bg-linear-to-br from-[hsla(199,89%,48%,0.1)] to-[hsla(280,89%,48%,0.05)] border-2 border-primary-light p-12">
        <h3 className="mb-4 text-foreground flex items-center gap-4 text-3xl font-extrabold">⚡ Dynamic 5E Synergy Engine</h3>
        <p className="text-lg text-text-muted mb-4 max-w-3xl leading-relaxed">
          You no longer need to manually construct the 5E phases! 
          Just define the core, raw syllabus content here or <strong>upload a PDF lesson plan</strong>. When your students start the lesson, our Gemini AI will dynamically synthesize a fully personalized 5E curriculum on-the-fly, meticulously mapped to their distinct contextual role and background.
        </p>
      </div>

      <form onSubmit={handleAddModule} className="peak-card">
        <h3 className="mb-8 font-extrabold"><span className="text-primary">🛠️</span> Module Foundation Constructor</h3>
        
        <div className="flex gap-6 mb-6">
          <div className="flex-[2]">
            <label className="auth-label">Parent Topic Block</label>
            <select value={modTopicId} onChange={e => setModTopicId(e.target.value)} className="input" required>
              <option value="">Select Topic Cluster</option>
              {topics.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="auth-label">Delivery Type</label>
            <select value={modType} onChange={e => setModType(e.target.value as 'lesson' | 'activity' | 'project')} className="input">
              <option value="lesson">📖 Concept Lesson</option>
              <option value="activity">🛠️ Practical Activity</option>
              <option value="project">🚀 Milestone Project</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="auth-label">Module Designator (Title)</label>
          <input type="text" placeholder="e.g. Memory Architectures" value={modTitle} onChange={e => setModTitle(e.target.value)} className="input" required />
        </div>
        
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <label className="auth-label flex items-center gap-2 m-0">
              Raw Foundational Content | Syllabus | Lesson Plan
              <span className="text-xs font-medium px-2 py-0.5 bg-primary-glow text-primary rounded-full">AI Baseline</span>
            </label>
            
            <div>
              <input 
                type="file" 
                accept=".pdf" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <button 
                type="button" 
                className="btn btn-outline px-4 py-2 flex items-center gap-2" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Extracting...' : '📄 Upload PDF'}
              </button>
            </div>
          </div>
          <textarea 
            placeholder="Paste your syllabus here, or use the Upload PDF button above. Pro tip: If you want to force specific questions for the Engage or Evaluate phases, explicitly type them here." 
            value={modContent} 
            onChange={e => setModContent(e.target.value)} 
            className="input min-h-[200px]" 
            required 
          />
        </div>

        {!aiGeneratedData ? (
          <button 
            type="button" 
            onClick={handleSynthesize} 
            className="btn btn-primary px-12 py-4 bg-linear-to-br from-primary to-secondary" 
            disabled={isSynthesizing}
          >
            {isSynthesizing ? 'Brainstorming with Gemini...' : '✨ Synthesize AI Foundation'}
          </button>
        ) : (
          <div className="animate-fade-in mt-8 p-8 bg-[rgba(255,255,255,0.03)] rounded-md border border-primary-glow">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-primary m-0 flex items-center gap-2 font-extrabold">
                <span>✨</span> AI Synthesis: Active Review & Refinement
              </h4>
              <div className="tag-nigeria text-[0.7rem]">Constructivist Guardrails Active</div>
            </div>
            
            {aiGeneratedData.constructivistNote && (
              <div className="mb-8 p-4 bg-primary-glow rounded-lg border-l-4 border-primary">
                <p className="text-[0.75rem] font-extrabold text-primary mb-2 uppercase">Constructivist Designer Notes (Internal)</p>
                <p className="text-[0.9rem] italic text-foreground">{aiGeneratedData.constructivistNote}</p>
              </div>
            )}

            <div className="flex flex-col gap-8 mb-10">
              {[
                { key: 'engage', label: '1. ENGAGE (The Hook & Questions)', icon: '🎣', placeholder: 'Activate schema with thought-provoking questions...' },
                { key: 'explore', label: '2. EXPLORE (The Discovery Task)', icon: '🔍', placeholder: 'A hands-on investigative task for discovery...' },
                { key: 'explain', label: '3. EXPLAIN (Theoretical Foundation)', icon: '📖', placeholder: 'Formal definitions and theoretical core...' },
                { key: 'evaluate', label: '5. EVALUATE (Reflection Question)', icon: '🤔', placeholder: 'Final metacognitive reflection question...' }
              ].map(phase => (
                <div key={phase.key} className="peak-card bg-[rgba(255,255,255,0.01)] border-l-4 border-primary">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{phase.icon}</span>
                    <label className="auth-label text-[0.8rem] uppercase font-black text-primary m-0">{phase.label}</label>
                  </div>
                  <textarea 
                    className="input min-h-[120px] text-[0.95rem] leading-relaxed" 
                    placeholder={phase.placeholder}
                    value={aiGeneratedData[phase.key as keyof AiGeneratedData] as string}
                    onChange={e => setAiGeneratedData({ ...aiGeneratedData, [phase.key]: e.target.value })}
                  />
                </div>
              ))}
              
              <div className="peak-card bg-[rgba(255,255,255,0.01)] border-l-4 border-secondary">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl">🛠️</span>
                  <label className="auth-label text-[0.8rem] uppercase font-black text-secondary m-0">4. ELABORATE (Contextual & Personal Tie-back)</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(aiGeneratedData.elaborate).map(([context, content]) => (
                    <div key={context} className="bg-[rgba(0,0,0,0.1)] p-5 rounded-lg border border-secondary/20 hover:border-secondary transition-all">
                      <p className="text-[0.65rem] font-black text-secondary mb-3 uppercase tracking-tighter flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
                        <span className="shrink-0 text-xs">👤</span> Role: <span className="text-foreground">{context}</span>
                      </p>
                      <textarea 
                        className="input min-h-[140px] text-[0.85rem] bg-transparent leading-relaxed border-secondary/10"
                        value={content}
                        onChange={e => setAiGeneratedData({ 
                          ...aiGeneratedData, 
                          elaborate: { ...aiGeneratedData.elaborate, [context]: e.target.value } 
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
                <span className="text-2xl">📝</span>
                <p className="font-black uppercase text-foreground m-0 text-sm tracking-widest">Confirmative Assessment (Short Test)</p>
                <div className="ml-auto tag-nigeria bg-primary/10 text-primary border-primary/20 text-[0.6rem]">3 Neural Validation Points</div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {aiGeneratedData.questions?.map((q: Question, i: number) => (
                  <div key={i} className="peak-card bg-[rgba(255,255,255,0.02)] border border-dashed border-primary-glow/30 hover:border-primary-glow transition-all">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <label className="auth-label text-[0.7rem] font-black text-primary uppercase m-0 flex items-center gap-2">
                          <span className="w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full text-[0.6rem]">{i+1}</span>
                          Validation Question
                        </label>
                      </div>
                      <input 
                        className="input bg-transparent border-primary/10 focus:border-primary" 
                        placeholder="e.g. What is the complexity of O(n)?"
                        value={q.question} 
                        onChange={e => {
                          const newQs = [...aiGeneratedData.questions];
                          newQs[i].question = e.target.value;
                          setAiGeneratedData({ ...aiGeneratedData, questions: newQs });
                        }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`relative ${optIdx === q.correctAnswer ? 'ring-2 ring-primary/30 rounded-lg' : ''}`}>
                          <label className="auth-label text-[0.6rem] mb-1 pl-1">
                            {String.fromCharCode(65 + optIdx)}. Option {optIdx === q.correctAnswer && ' (Correct Solution)'}
                          </label>
                          <input 
                            className={`input text-[0.85rem] py-2.5 ${optIdx === q.correctAnswer ? 'bg-primary/5 border-primary/30' : 'bg-transparent border-white/5'}`}
                            value={opt}
                            onChange={e => {
                              const newQs = [...aiGeneratedData.questions];
                              newQs[i].options[optIdx] = e.target.value;
                              setAiGeneratedData({ ...aiGeneratedData, questions: newQs });
                            }}
                          />
                          {optIdx === q.correctAnswer && <span className="absolute right-3 top-[2.1rem] text-primary text-xs">✔️</span>}
                        </div>
                      ))}
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                      <label className="auth-label text-[0.6rem] text-primary uppercase font-black mb-2 flex items-center gap-1.5">
                        <span>💡</span> Constructivist Rationale (Feedback)
                      </label>
                      <textarea 
                        className="input min-h-[60px] text-[0.8rem] bg-transparent border-none p-0 focus:ring-0 italic"
                        placeholder="Explain why this is the correct path for the student..."
                        value={q.explanation}
                        onChange={e => {
                          const newQs = [...aiGeneratedData.questions];
                          newQs[i].explanation = e.target.value;
                          setAiGeneratedData({ ...aiGeneratedData, questions: newQs });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-6 mt-12 pt-8 border-t border-border">
              <button type="submit" className="btn btn-primary flex-[2] p-4 text-[1.1rem] bg-linear-to-br from-primary to-secondary shadow-[0_10px_20px_-5px_var(--primary-glow)]">🚀 Deploy Full High-Fidelity Package</button>
              <button type="button" onClick={() => setAiGeneratedData(null)} className="btn btn-outline flex-1 p-4">✖ Discard Blueprint</button>
            </div>
          </div>
        )}
      </form>

      <div className="dashboard-grid">
        {modules.length === 0 ? <div className="peak-card text-center text-text-muted col-span-full">No foundational blueprints currently deployed.</div> : (
          modules.map(mod => (
            <div key={mod._id} className="peak-card flex flex-col h-full">
              <div className="flex justify-between mb-6">
                <div>
                  <h4 className="text-[1.4rem] mb-2">{mod.title}</h4>
                  <div className="flex gap-2 items-center">
                    <span className="tag-nigeria text-[0.7rem]">{mod.type === 'lesson' ? '📖' : mod.type === 'activity' ? '🛠️' : '🚀'} {mod.type}</span>
                    {mod.questions?.length > 0 && <span className="text-[0.7rem] text-secondary">• {mod.questions.length} Questions</span>}
                  </div>
                </div>
                <button onClick={() => handleDeleteModule(mod._id)} className="text-[#ef4444] bg-none border-none cursor-pointer text-xl h-fit">✕</button>
              </div>
              
              <div className="flex gap-1 mb-4">
                {['engage', 'explore', 'explain', 'evaluate'].map(phase => (
                  <div key={phase} title={`${phase.toUpperCase()} active`} className={`h-1 flex-1 rounded-sm ${ (mod as unknown as Record<string, string>)[phase] ? 'bg-primary' : 'bg-[rgba(255,255,255,0.1)]'}`} />
                ))}
              </div>

              <p className="text-text-muted leading-relaxed text-[0.9rem] mb-6 flex-1">
                {mod.content.substring(0, 100)}...
              </p>

              {mod.constructivistNote && (
                <div className="p-3 bg-[rgba(0,0,0,0.2)] rounded-md text-[0.8rem] italic text-primary-light border-l-2 border-primary">
                  &quot;{mod.constructivistNote.substring(0, 80)}...&quot;
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
