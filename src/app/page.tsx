export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <h1 className="gradient-text" style={{ fontSize: '4rem', marginBottom: '1rem' }}>Empowering the Next Generation of ICT Leaders</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', marginBottom: '3rem' }}>
        A constructivist learning platform designed to bridge the digital gap in Nigeria through project-based education and interactive experiences.
      </p>
      
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <a href="/student" className="btn-primary">Start Learning</a>
        <a href="/teacher" className="glass" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>Teacher Access</a>
      </div>
      
      <div style={{ marginTop: '5rem', display: 'flex', gap: '3rem' }}>
        <div>
          <h3 style={{ fontSize: '2.5rem' }}>100%</h3>
          <p style={{ color: 'var(--text-muted)' }}>Project Focused</p>
        </div>
        <div>
          <h3 style={{ fontSize: '2.5rem' }}>Local</h3>
          <p style={{ color: 'var(--text-muted)' }}>Nigerian Context</p>
        </div>
        <div>
          <h3 style={{ fontSize: '2.5rem' }}>Active</h3>
          <p style={{ color: 'var(--text-muted)' }}>Learning</p>
        </div>
      </div>
    </div>
  );
}
