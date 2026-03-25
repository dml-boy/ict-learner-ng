'use client';

import { useState } from 'react';
import Link from 'next/link';

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
      <div className="auth-container">
        <div className="glass-card animate-in" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📧</div>
          <h2 style={{ marginBottom: '1rem' }}>Verify Your Email</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
            We&apos;ve sent a verification link to <strong>{email}</strong>. 
            Please check your inbox (and spam folder) to complete your registration.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="glass-card animate-in" style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
          <h2 className="gradient-text">Student Registration</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Start your journey as an ICT learner</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="label">Full Name</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Adebayo Ogunlesi" 
              required 
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="label">Email Address</label>
            <input 
              type="email" 
              className="input" 
              placeholder="student@example.ng" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div style={{ 
              padding: '0.75rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: '#f87171',
              fontSize: '0.875rem',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Student Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign In</Link>
        </p>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Registering as a teacher? <Link href="/register/teacher" style={{ color: 'white', textDecoration: 'none' }}>Click here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
