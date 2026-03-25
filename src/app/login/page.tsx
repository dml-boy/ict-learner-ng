'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import Image from 'next/image';

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
      // Fetch session to determine role and redirect
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
    <div className="auth-container">
      <div className="glass-card animate-in" style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Image src="/logosm.svg" alt="ICT Learner NG" width={50} height={46} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#044331', marginBottom: '0.5rem', letterSpacing: '-0.3px' }}>ICT LEARNER NG</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>Log in to your account</p>
        </div>

        {displayMessage && (
          <div style={{ 
            padding: '1rem', 
            background: '#ecfdf5', 
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-sm)',
            color: '#065f46',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {displayMessage}
          </div>
        )}

        {displayError && (
          <div style={{ 
            padding: '1rem', 
            background: '#fef2f2', 
            border: '1px solid #ef4444',
            borderRadius: 'var(--radius-sm)',
            color: '#991b1b',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {displayError}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="label">Email Address</label>
            <input 
              type="email" 
              className="input" 
              placeholder="you@example.com" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="label" style={{ marginBottom: 0 }}>Password</label>
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Forgot?</a>
            </div>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don&apos;t have an account? <br />
          <span style={{ display: 'inline-block', marginTop: '0.5rem' }}>
            Register as <Link href="/register/student" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Student</Link> or <Link href="/register/teacher" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Teacher</Link>
          </span>
        </p>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-container">
        <div className="glass-card animate-pulse" style={{ width: '100%', maxWidth: '440px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading Secure Login...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
