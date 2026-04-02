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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

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
  
  const handleResend = async () => {
    if (!email) {
      setError('Please enter your institutional email to resend the verification link.');
      return;
    }
    
    setResendLoading(true);
    setResendSuccess('');
    setError('');
    
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setResendSuccess(data.message);
      } else {
        setError(data.error || 'Failed to dispatch verification protocol.');
      }
    } catch {
      setError('System communication interrupted.');
    } finally {
      setResendLoading(false);
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
        <div className="auth-message auth-message-error mb-6 flex flex-col gap-3">
          <p>{displayError}</p>
          {(urlError === 'unverified' || error === 'Please verify your email address before logging in.') && !resendSuccess && (
            <button 
              type="button" 
              onClick={handleResend} 
              disabled={resendLoading}
              className="text-xs font-black uppercase tracking-widest text-emerald-950 hover:underline text-left"
            >
              {resendLoading ? 'Re-dispatching...' : 'Resend Verification Protocol?'}
            </button>
          )}
        </div>
      )}

      {resendSuccess && (
        <div className="auth-message auth-message-success mb-6 text-sm">
          {resendSuccess}
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
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              className="input pr-12" 
              placeholder="••••••••" 
              required 
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
            >
              {showPassword ? (
                <span className="text-xs font-black uppercase tracking-tighter">Hide</span>
              ) : (
                <span className="text-xs font-black uppercase tracking-tighter">Show</span>
              )}
            </button>
          </div>
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
