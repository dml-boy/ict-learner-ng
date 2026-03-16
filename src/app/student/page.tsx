export default function StudentDashboard() {
  return (
    <div>
      <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>My Learning Journey</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Construct your knowledge through active projects and interactive modules.</p>
      
      <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>📝 Constructivist Lesson Note: Introduction to Web Design</h3>
        <p>Today, your goal is not to read about HTML, but to <strong>build a basic landing page</strong> for a local business in your community. Think about what information they need to show.</p>
        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn-primary">Launch Project Sandbox</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3>Learning Modules</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600 }}>Computer Hardware Basics</p>
                <div style={{ width: '150px', height: '6px', background: 'var(--glass-bg)', borderRadius: '3px', marginTop: '0.5rem' }}>
                  <div style={{ width: '70%', height: '100%', background: 'var(--secondary)', borderRadius: '3px' }}></div>
                </div>
              </div>
              <button style={{ color: 'var(--secondary)', fontWeight: 600 }}>Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
