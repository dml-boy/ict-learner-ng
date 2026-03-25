'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
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
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
          <h1 className="gradient-text">Welcome Back</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Log in to your ICT Learner account</p>
        </div>

        {displayMessage && (
          <div style={{ 
            padding: '0.75rem', 
            background: 'rgba(5, 150, 105, 0.1)', 
            border: '1px solid rgba(5, 150, 105, 0.2)',
            borderRadius: 'var(--radius-sm)',
            color: '#34d399',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {displayMessage}
          </div>
        )}

        {displayError && (
          <div style={{ 
            padding: '0.75rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-sm)',
            color: '#f87171',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
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
              <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary-light)', textDecoration: 'none' }}>Forgot?</a>
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

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
          Don&apos;t have an account? <br />
          <span style={{ display: 'inline-block', marginTop: '0.5rem' }}>
            Register as <Link href="/register/student" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Student</Link> or <Link href="/register/teacher" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Teacher</Link>
          </span>
        </p>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'none' }}>
            ← Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
