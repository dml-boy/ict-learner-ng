'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthCard from '@/components/AuthCard';

export default function StudentRegister() {
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
        body: JSON.stringify({ name, email, password, role: 'student' }),
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
        headerTitle="Access Granted" 
        headerSubtitle="Verification Initiated"
        isSuccess={true}
        footerContent={
          <Link href="/login" className="btn btn-primary w-full py-4 text-lg">
            Return to Gateway
          </Link>
        }
      >
        <div className="text-center py-6">
          <div className="text-6xl mb-10 animate-float">🚀</div>
          <h2 className="gradient-text text-3xl font-black mb-6">Credential Dispatch</h2>
          <p className="text-slate-500 font-medium leading-relaxed px-4">
            A secure verification link has been sent to <strong>{email}</strong>. <br />
            Activate your profile to begin your ICT mastery journey.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      headerTitle="Student Portal" 
      headerSubtitle="Construct Your Digital Future"
      footerContent={
        <div className="text-slate-500 font-medium text-center">
          Already part of the network? <Link href="/login" className="auth-link">Sign In</Link> <br />
          <div className="mt-6 pt-4 border-t border-slate-50">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sector Specialist?</span> <br />
             <Link href="/register/teacher" className="text-emerald-600 font-black hover:text-[#044331] no-underline">Access Educator Gateway</Link>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label className="auth-label">Full Name</label>
          <input 
            type="text" 
            className="input" 
            placeholder="Adebayo Ogunlesi" 
            required 
            autoComplete="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="auth-label">Personal Email</label>
          <input 
            type="email" 
            className="input" 
            placeholder="student@domain.edu.ng" 
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
          {loading ? 'Initializing...' : 'Construct Account'}
        </button>
      </form>
    </AuthCard>
  );
}
