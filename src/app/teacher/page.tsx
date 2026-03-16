export default function TeacherDashboard() {
  return (
    <div>
      <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Teacher Dashboard</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your topics, modules, and constructive lesson notes.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3>Add New Topic</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>Create a fresh ICT topic for your students to explore.</p>
          <button className="btn-primary">Create Topic</button>
        </div>
        
        <div className="glass-card">
          <h3>Recent Modules</h3>
          <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <strong>Introduction to HTML</strong>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created 2 days ago</p>
            </li>
            <li style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <strong>Digital Literacy in Nigeria</strong>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created 1 week ago</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
