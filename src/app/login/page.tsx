'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthCard from '@/components/AuthCard';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Derive messages from searchParams
  const verified = searchParams.get('verified') === 'true';
  const urlError = searchParams.get('error');
  
  const displayMessage = verified ? 'Email verified successfully! You can now log in.' : '';
  const displayError = error || (
    urlError === 'missing_token' || urlError === 'invalid_token' ? 'The verification link is invalid or has expired.' :
    urlError === 'unverified' ? 'Please verify your email address before logging in.' : ''
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', { 
      email, 
      password, 
      redirect: false 
    });

    if (res?.error) {
      setError('Invalid email or password.');
      setLoading(false);
    } else {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      
      if (session?.user?.role === 'teacher') {
        router.push('/teacher');
      } else {
        router.push('/student');
      }
    }
  };

  return (
    <AuthCard 
      headerTitle="Gateway Access" 
      headerSubtitle="Enter the Nigerian ICT Ecosystem"
      footerContent={
        <div className="text-slate-500 font-medium text-center">
          New to the network? <br />
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/register/student" className="auth-link">As Student</Link>
            <Link href="/register/teacher" className="auth-link">As Teacher</Link>
          </div>
        </div>
      }
    >
      {displayMessage && (
        <div className="auth-message auth-message-success mb-6">
          {displayMessage}
        </div>
      )}

      {displayError && (
        <div className="auth-message auth-message-error mb-6">
          {displayError}
        </div>
      )}

      <form onSubmit={handleLogin} className="auth-form">
        <div>
          <label className="auth-label">Institutional Email</label>
          <input 
            type="email" 
            className="input" 
            placeholder="chidi@school.edu.ng" 
            required 
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="auth-label mb-0">Security Password</label>
            <a href="#" className="text-xs font-black text-emerald-600 hover:text-[#044331] transition-colors uppercase tracking-widest no-underline">Reset?</a>
          </div>
          <input 
            type="password" 
            className="input" 
            placeholder="••••••••" 
            required 
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full py-4 text-lg mt-4" 
          disabled={loading}
        >
          {loading ? 'Authorizing...' : 'Enter Platform'}
        </button>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-page flex items-center justify-center">
        <div className="peak-card w-full max-w-[440px] h-[500px] animate-pulse flex items-center justify-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest">Securing Connection...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
