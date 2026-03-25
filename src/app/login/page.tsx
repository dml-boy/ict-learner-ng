'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'student';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setError('Invalid email or password.');
      setLoading(false);
    } else {
      router.push(role === 'teacher' ? '/teacher' : '/student');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!data.success) {
      setError(data.error || 'Registration failed.');
      setLoading(false);
    } else {
      // Auto-login after register
      await signIn('credentials', { email, password, redirect: false });
      router.push(role === 'teacher' ? '/teacher' : '/student');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo / Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>ICT Learner Nigeria</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Constructivist Learning Platform</p>
        </div>

        {/* Role Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '2rem',
        }}>
          {(['student', 'teacher'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                background: role === r ? (r === 'teacher' ? 'var(--primary)' : 'var(--secondary)') : 'transparent',
                color: role === r ? 'white' : 'var(--text-muted)',
              }}
            >
              {r === 'teacher' ? '👩‍🏫 Teacher' : '🎓 Student'}
            </button>
          ))}
        </div>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '8px',
                border: `1px solid ${mode === m ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                background: mode === m ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: mode === m ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'capitalize',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="glass-card">
          {mode === 'register' && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                required
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? `Sign In as ${role === 'teacher' ? 'Teacher' : 'Student'}` : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ICT Learner Nigeria · 5E Constructivist Platform
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.8rem 1rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: 'white',
  fontSize: '1rem',
  outline: 'none',
};
