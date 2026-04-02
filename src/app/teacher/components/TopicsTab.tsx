import { useState } from 'react';
import { Subject, Topic } from '@/types';

export default function TopicsTab({ topics, setTopics, subjects }: { 
  topics: Topic[], 
  setTopics: (t: Topic[]) => void, 
  subjects: Subject[] 
}) {
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [topicCategory, setTopicCategory] = useState('General ICT');
  const [topicSubId, setTopicSubId] = useState('');

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
      setTopicTitle(''); setTopicDesc(''); setTopicSubId('');
    }
  };

  const handleDeleteTopic = async (id: string) => {
    const res = await fetch(`/api/topics/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) setTopics(topics.filter((t) => t._id !== id));
  };

  return (
    <div className="animate-fade-in flex flex-col gap-12">
      <form onSubmit={handleAddTopic} className="glass-panel border-l-8 border-secondary">
        <h3 className="mb-8 font-black flex items-center gap-2 fluid-text-h2">
          <span className="text-secondary">📚</span> Define New Topic Cluster
        </h3>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-1">
            <label className="auth-label text-secondary">Parent Sector (Subject)</label>
            <select value={topicSubId} onChange={e => setTopicSubId(e.target.value)} className="input border-secondary/20 focus:border-secondary focus:ring-secondary/20" required>
              <option value="">Select Academic Sector</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.icon} {s.title}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="auth-label text-secondary">Category Taxonomy</label>
            <select value={topicCategory} onChange={e => setTopicCategory(e.target.value)} className="input border-secondary/20 focus:border-secondary focus:ring-secondary/20">
              <option value="General ICT">General ICT</option>
              <option value="Web Development">Web Development</option>
              <option value="Digital Literacy">Digital Literacy</option>
              <option value="Programming">Programming</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="auth-label text-secondary">Topic Cluster Title</label>
          <input type="text" placeholder="e.g. Asynchronous Javascript Patterns" value={topicTitle} onChange={e => setTopicTitle(e.target.value)} className="input border-secondary/20 focus:border-secondary focus:ring-secondary/20" required />
        </div>

        <div className="mb-10">
          <label className="auth-label text-secondary">Learning Objectives (Syllabus Snippet)</label>
          <textarea 
            placeholder="Define the specific learning outcomes for this topic cluster."
            value={topicDesc} 
            onChange={e => setTopicDesc(e.target.value)} 
            className="input min-h-[100px] border-secondary/20 focus:border-secondary focus:ring-secondary/20" 
            required 
          />
        </div>

        <button type="submit" className="btn bg-secondary text-white px-10 py-4 shadow-[0_10px_20px_var(--secondary-glow)] hover:scale-105 transition-transform" disabled={!topicSubId}>
          🛡️ Register Topic Cluster
        </button>
      </form>

      <div className="dashboard-grid">
        {topics.length === 0 ? (
          <div className="glass-panel text-center text-text-muted col-span-full py-12">
            No topic clusters are currently registered within your academic sectors.
          </div>
        ) : (
          topics.map((topic: Topic) => (
            <div key={topic._id} className="glass-panel flex flex-col h-full border-l-4 border-secondary/30 hover:border-secondary transition-all p-5 sm:p-8">
              <div className="flex justify-between items-start mb-4 md:mb-6">
                <div>
                  <h4 className="text-lg md:text-xl font-black mb-2 leading-tight">{topic.title}</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tag-nigeria bg-secondary/10 text-secondary border-secondary/20 text-[0.6rem] md:text-[0.65rem]">{topic.category}</span>
                    <span className="text-[0.6rem] md:text-[0.65rem] text-text-muted font-bold uppercase tracking-widest px-2 py-0.5 bg-gray-100 rounded-full">
                      ID: {typeof topic.subjectId === 'object' ? (topic.subjectId as Subject).icon?.substring(0, 2) || '📂' : '📂'}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDeleteTopic(topic._id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-[#ef4444] hover:bg-red-500 hover:text-white transition-all">✕</button>
              </div>
              <p className="text-text-muted text-sm leading-relaxed flex-1 italic opacity-80">&quot;{topic.description}&quot;</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
