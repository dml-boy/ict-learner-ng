'use client';

import { useState } from 'react';

interface PriorKnowledgeCheckProps {
  onSelect: (context: string) => void;
  options: string[];
}

export default function PriorKnowledgeCheck({ onSelect, options }: PriorKnowledgeCheckProps) {
  const [selected, setSelected] = useState('');

  const defaultOptions = ['Business Owner', 'Student', 'Hobbyist', 'Professional'];
  const displayOptions = options && options.length > 0 ? options : defaultOptions;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
      <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Before we begin...</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        In constructivist learning, we relate new knowledge to your personal context. 
        How should we frame this module for you?
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {displayOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`btn-secondary ${selected === opt ? 'active-context' : ''}`}
            style={{ 
              padding: '1.5rem', 
              border: selected === opt ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
              background: selected === opt ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        onClick={() => onSelect(selected)}
        disabled={!selected}
        className="btn-primary"
        style={{ width: '100%', padding: '1rem' }}
      >
        Start Learning Contextually →
      </button>

      <style jsx>{`
        .active-context {
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </div>
  );
}
