'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="animate-in" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        padding: '8rem 2rem 4rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="tag-nigeria" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
            Empowering Nigeria&apos;s Digital Future
          </div>
          <h1 className="gradient-text" style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 5rem)', 
            lineHeight: 1.1,
            marginBottom: '1.5rem'
          }}>
            Master ICT Through <br /> Active Construction
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#94a3b8', 
            maxWidth: '700px', 
            margin: '0 auto 3rem',
            lineHeight: 1.8
          }}>
            The first project-based ICT learning platform tailored for Nigerian students. 
            Build real-world skills through our constructivist 5E learning model.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register/student" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Start Learning as Student
            </Link>
            <Link href="/register/teacher" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Join as Teacher
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          <div className="glass-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏗️</div>
            <h3>Project-First</h3>
            <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
              Don&apos;t just watch videos. Build real applications and projects that solve local problems.
            </p>
          </div>
          <div className="glass-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🇳🇬</div>
            <h3>Localized Content</h3>
            <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
              Curriculum designed specifically for the Nigerian ICT environment and infrastructure.
            </p>
          </div>
          <div className="glass-card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
            <h3>Constructivist Flow</h3>
            <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
              Our 5E model guides you through Engage, Explore, Explain, Elaborate, and Evaluate.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '4rem 2rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--card-border)',
        marginTop: '4rem',
        color: '#64748b'
      }}>
        <p>© 2026 ICT Learner NG. Bridging the digital gap through knowledge construction.</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <Link href="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Login</Link>
          <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
