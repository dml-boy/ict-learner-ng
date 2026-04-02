import { useState } from 'react';
import Image from 'next/image';
import { Subject } from '@/types';

export default function SubjectsTab({ subjects, setSubjects }: { 
  subjects: Subject[], 
  setSubjects: (s: Subject[]) => void 
}) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('📚');
  const [color, setColor] = useState('#3b82f6');
  const [contexts, setContexts] = useState<string[]>([]);
  const [currentContext, setCurrentContext] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let finalIcon = icon; // default: current emoji '📚' or whatever is set

    try {
      // Step 1: If an image was selected, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();

        if (uploadData.success && uploadData.url) {
          finalIcon = uploadData.url; // swap icon for the GitHub CDN URL
        } else {
          alert(uploadData.error || 'Image upload failed. Subject will be created with the default icon.');
          finalIcon = '📚'; // fallback gracefully — don't block creation
        }
      }

      // Step 2: Create the subject (always runs, image is optional)
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc, icon: finalIcon, color, allowedContexts: contexts }),
      });
      const data = await res.json();

      if (data.success) {
        setSubjects([data.data, ...subjects]);
        // Reset all fields
        setTitle('');
        setDesc('');
        setContexts([]);
        setImageFile(null);
        setImagePreview(null);
        setIcon('📚');
      } else {
        alert(data.error || 'Failed to create subject.');
      }
    } catch (err) {
      console.error('[SubjectsTab] Creation failure:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) setSubjects(subjects.filter((s) => s._id !== id));
  };

  return (
    <div className="animate-fade-in flex flex-col gap-12">
      <form onSubmit={handleAdd} className="glass-panel">
        <h3 className="mb-8 font-black flex items-center gap-2 fluid-text-h2">
          <span className="text-primary">📂</span> Create New Academic Sector
        </h3>
        
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="flex-[3]">
            <label className="auth-label">Subject Designation (Title)</label>
            <input type="text" placeholder="e.g. Computer Science v5" value={title} onChange={e => setTitle(e.target.value)} className="input" required />
          </div>
          <div className="flex-[1.5]">
            <label className="auth-label text-emerald-600 font-black">Semantic Cover (High-Fi Image)</label>
            <div className="flex items-center gap-4">
              <div className="relative group overflow-hidden w-14 h-14 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center bg-primary/5 shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl opacity-20">📸</span>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if(file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
              <div className="flex-1 text-[0.7rem] text-text-muted font-bold leading-tight">
                {imageFile ? <span className="text-primary">Ready for Uplink: {imageFile.name}</span> : 'Select an image to replace the default icon.'}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label className="auth-label">Brand Color</label>
            <div className="relative group">
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="input h-[54px] cursor-pointer p-1" />
              <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-sm transition-colors" style={{ backgroundColor: color }}></div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="auth-label">Sector Intelligence (Description)</label>
          <textarea 
            placeholder="Outline the core objective of this academic sector and how it maps to Nigerian ICT standards."
            value={desc} 
            onChange={e => setDesc(e.target.value)} 
            className="input min-h-[100px]" 
            required 
          />
        </div>

        <div className="mb-10">
          <label className="auth-label">Cognitive Contexts (Available Personas)</label>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input type="text" value={currentContext} onChange={e => setCurrentContext(e.target.value)} className="input" placeholder="e.g. Aspiring Architect, Data Scientist" />
            <button type="button" className="btn btn-outline shrink-0 w-full sm:w-auto" onClick={() => { if(currentContext) { setContexts([...contexts, currentContext]); setCurrentContext(''); } }}>
              <span>➕</span> Add Persona
            </button>
          </div>
          <div className="flex gap-2 flex-wrap min-h-[2.5rem] p-2 bg-slate-50/50 rounded-xl border border-slate-100/50">
            {contexts.length === 0 ? <p className="text-text-muted text-sm italic py-2">No personas defined yet. These will be used for the AI synthesis context.</p> : contexts.map(ctx => (
              <span key={ctx} className="tag-nigeria flex items-center gap-2 animate-fade-in group">
                {ctx} 
                <button type="button" onClick={() => setContexts(contexts.filter(c => c !== ctx))} className="opacity-40 group-hover:opacity-100 hover:text-red-500 transition-all">✕</button>
              </span>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isUploading} className="btn btn-primary px-10 py-4 shadow-[0_10px_20px_var(--primary-glow)] disabled:opacity-50">
          {isUploading ? '🔄 Uploading & Defining...' : '🚀 Define Academic Sector'}
        </button>
      </form>

      <div className="dashboard-grid">
        {subjects.length === 0 ? (
          <div className="glass-panel text-center text-text-muted col-span-full py-12">
            No academic sectors are currently initialized in your terminal.
          </div>
        ) : (
          subjects.map((sub: Subject) => (
            <div key={sub._id} className="glass-panel flex flex-col h-full border-t-4 transition-all hover:scale-[1.02]" style={{ borderTopColor: sub.color }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  {sub.icon?.startsWith('http') ? (
                    <Image src={sub.icon} alt={sub.title} width={56} height={56} className="object-cover rounded-xl mb-4 shadow-sm border border-border/10" />
                  ) : (
                    <span className="text-3xl mb-2 block">{sub.icon}</span>
                  )}
                  <h4 className="text-xl font-black">{sub.title}</h4>
                </div>
                <button onClick={() => handleDelete(sub._id)} className="text-[#ef4444] bg-none border-none cursor-pointer text-xl hover:scale-125 transition-transform">✕</button>
              </div>
              <p className="text-text-muted text-sm mb-8 leading-relaxed flex-1 italic">&quot;{sub.description}&quot;</p>
              <div className="mt-auto border-t border-border pt-4">
                <p className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest mb-3">Contextual Personas</p>
                <div className="flex gap-1.5 flex-wrap">
                  {sub.allowedContexts?.map((ctx: string) => <span key={ctx} className="tag-nigeria text-[0.65rem] px-2 py-0.5">{ctx}</span>)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
