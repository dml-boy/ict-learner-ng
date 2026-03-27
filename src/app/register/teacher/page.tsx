'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthCard from '@/components/AuthCard';

export default function TeacherRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'teacher' }),
      });
      
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Registration failed');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard 
        headerTitle="Authorization Initiated" 
        headerSubtitle="Faculty Credentialing"
        isSuccess={true}
        footerContent={
          <Link href="/login" className="btn btn-primary w-full py-4 text-lg">
            Return to Gateway
          </Link>
        }
      >
        <div className="text-center py-6">
          <div className="text-6xl mb-10 animate-float">🎓</div>
          <h2 className="gradient-text text-3xl font-black mb-6">Security Protocol</h2>
          <p className="text-slate-500 font-medium leading-relaxed px-4">
            A secure verification link has been dispatched to <strong>{email}</strong>. <br />
            Teacher accounts require manual verification to access pedagogical AI tools.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      headerTitle="Educator Portal" 
      headerSubtitle="Architects of Nigerian ICT Excellence"
      footerContent={
        <div className="text-slate-500 font-medium text-center">
          Already part of the network? <Link href="/login" className="auth-link">Sign In</Link> <br />
          <div className="mt-6 pt-4 border-t border-slate-50">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Wanna Learn?</span> <br />
             <Link href="/register/student" className="text-emerald-600 font-black hover:text-[#044331] no-underline">Join Student Hub</Link>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label className="auth-label">Full Name & Honorific</label>
          <input 
            type="text" 
            className="input" 
            placeholder="Prof. Chidi Mokeme" 
            required 
            autoComplete="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="auth-label">Professional Institutional Email</label>
          <input 
            type="email" 
            className="input" 
            placeholder="teacher@school.edu.ng" 
            required 
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="auth-label">Security Password</label>
          <input 
            type="password" 
            className="input" 
            placeholder="••••••••" 
            required 
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="auth-message auth-message-error mb-4">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary w-full py-4 text-lg mt-4" 
          disabled={loading}
        >
          {loading ? 'Authorizing...' : 'Authorize Teacher Account'}
        </button>
      </form>
    </AuthCard>
  );
}
