'use client';
import { useState } from 'react';
import Link from 'next/link';

const LABS = [
  { id: 'binary', title: 'Binary Calculator Lab', desc: 'Convert between binary, decimal, and hexadecimal in real-time.', icon: '🔢', status: 'live', difficulty: 'Beginner' },
  { id: 'network', title: 'Network Simulator', desc: 'Simulate packet routing across a simple IP network topology.', icon: '🌐', status: 'live', difficulty: 'Intermediate' },
  { id: 'logic', title: 'Logic Gates Sandbox', desc: 'Build circuits with AND, OR, NOT, NAND, NOR, XOR gates.', icon: '⚡', status: 'live', difficulty: 'Intermediate' },
  { id: 'html', title: 'HTML/CSS Playground', desc: 'Live preview HTML & CSS as you type — the Constructivist Sandbox.', icon: '🎨', status: 'live', difficulty: 'Beginner' },
  { id: 'algo', title: 'Algorithm Visualizer', desc: 'Watch sorting algorithms come to life step by step.', icon: '📊', status: 'coming', difficulty: 'Advanced' },
  { id: 'database', title: 'Database Query Lab', desc: 'Practice SQL queries against a live sample database.', icon: '🗄️', status: 'coming', difficulty: 'Advanced' },
];

export default function VirtualLabsPage() {
  const [activeLab, setActiveLab] = useState<string | null>(null);
  const [binaryInput, setBinaryInput] = useState('');
  const [decimalInput, setDecimalInput] = useState('');

  const toBinary = (n: string) => {
    const num = parseInt(n);
    return isNaN(num) ? '' : num.toString(2);
  };

  const toDecimal = (b: string) => {
    const num = parseInt(b, 2);
    return isNaN(num) ? '' : num.toString();
  };

  return (
    <div className="animate-fade-in px-4 sm:px-8 lg:px-12 pb-32">
      <div className="mb-12 animate-fade-in-down">
        <Link href="/student" className="inline-flex items-center gap-2 text-text-muted font-bold hover:text-primary transition-colors text-sm mb-8 group">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
        </Link>
        <h1 className="text-4xl sm:text-5xl font-black text-primary mb-3 tracking-tighter">Virtual Labs</h1>
        <p className="text-text-muted font-bold text-lg opacity-80">Hands-on interactive environments for practical ICT mastery.</p>
      </div>

      {/* Lab Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {LABS.map(lab => (
          <div 
            key={lab.id} 
            className={`peak-card p-8 bg-white border-none shadow-sm cursor-pointer group transition-all ${lab.status === 'coming' ? 'opacity-50' : 'hover:shadow-md hover:-translate-y-1'}`}
            onClick={() => lab.status === 'live' && setActiveLab(lab.id === activeLab ? null : lab.id)}
          >
            <div className="text-4xl mb-5">{lab.icon}</div>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-black text-foreground group-hover:text-primary transition-colors">{lab.title}</h3>
            </div>
            <p className="text-sm text-text-muted font-medium leading-relaxed mb-6">{lab.desc}</p>
            <div className="flex items-center justify-between">
              <span className={`text-[0.65rem] font-black uppercase tracking-widest px-3 py-1 rounded-full ${lab.difficulty === 'Beginner' ? 'bg-primary/10 text-primary' : lab.difficulty === 'Intermediate' ? 'bg-secondary/10 text-secondary' : 'bg-orange-500/10 text-orange-500'}`}>
                {lab.difficulty}
              </span>
              <span className={`text-[0.65rem] font-black uppercase tracking-widest ${lab.status === 'live' ? 'text-green-500' : 'text-text-muted'}`}>
                {lab.status === 'live' ? '● Live' : '⏳ Soon'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Lab Content */}
      {activeLab === 'binary' && (
        <div className="peak-card p-8 bg-white border-none shadow-sm animate-fade-in animate-fade-in-up mb-8">
          <h3 className="text-2xl font-black text-primary mb-8 flex items-center gap-3">🔢 Binary Calculator Lab</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest block mb-3">Decimal Input</label>
              <input
                type="number"
                value={decimalInput}
                onChange={e => { setDecimalInput(e.target.value); setBinaryInput(toBinary(e.target.value)); }}
                className="w-full p-4 bg-background rounded-2xl border border-card-border text-foreground font-mono text-xl font-black outline-none focus:border-primary transition-all"
                placeholder="Enter decimal..."
              />
              <p className="mt-3 text-sm text-text-muted font-bold">Binary: <span className="text-primary font-black font-mono">{binaryInput || '—'}</span></p>
            </div>
            <div>
              <label className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest block mb-3">Binary Input</label>
              <input
                type="text"
                value={binaryInput}
                onChange={e => { setBinaryInput(e.target.value.replace(/[^01]/g, '')); setDecimalInput(toDecimal(e.target.value)); }}
                className="w-full p-4 bg-background rounded-2xl border border-card-border text-foreground font-mono text-xl font-black outline-none focus:border-primary transition-all"
                placeholder="Enter binary (0s and 1s)..."
              />
              <p className="mt-3 text-sm text-text-muted font-bold">Decimal: <span className="text-primary font-black font-mono">{decimalInput || '—'}</span></p>
            </div>
          </div>
          {binaryInput && (
            <div className="mt-8 p-6 bg-card-bg rounded-2xl">
              <p className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest mb-3">Binary Breakdown</p>
              <div className="flex flex-wrap gap-2">
                {binaryInput.split('').map((bit, i) => (
                  <div key={i} className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black border-2 ${bit === '1' ? 'bg-primary text-white border-primary' : 'bg-white text-text-muted border-card-border'}`}>
                    <span className="text-lg">{bit}</span>
                    <span className="text-[0.5rem] opacity-60">{Math.pow(2, binaryInput.length - 1 - i)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeLab === 'logic' && (
        <div className="peak-card p-8 bg-white border-none shadow-sm animate-fade-in animate-fade-in-up mb-8">
          <h3 className="text-2xl font-black text-primary mb-8">⚡ Logic Gates Sandbox</h3>
          <p className="text-text-muted font-medium mb-8">Toggle inputs A and B to see how different logic gates respond.</p>
          <LogicGatesLab />
        </div>
      )}

      {activeLab === 'html' && (
        <div className="peak-card p-8 bg-white border-none shadow-sm animate-fade-in animate-fade-in-up mb-8">
          <h3 className="text-2xl font-black text-primary mb-6">🎨 HTML/CSS Playground</h3>
          <p className="text-text-muted font-medium mb-6">Use the Constructivist Sandbox on the main Dashboard for the full live code editor experience.</p>
          <Link href="/student" className="btn btn-primary px-8 py-3 text-[0.8rem] font-black uppercase tracking-widest">
            Go to Dashboard Sandbox
          </Link>
        </div>
      )}

      {activeLab === 'network' && (
        <div className="peak-card p-8 bg-white border-none shadow-sm animate-fade-in animate-fade-in-up mb-8">
          <h3 className="text-2xl font-black text-primary mb-8">🌐 Network Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { term: 'IP Address', def: 'A unique numerical label assigned to each device on a network (e.g., 192.168.1.1)' },
              { term: 'Subnet Mask', def: 'Divides an IP address into network and host portions (e.g., 255.255.255.0)' },
              { term: 'DNS', def: 'Domain Name System — translates domain names to IP addresses' },
              { term: 'Router', def: 'Directs data packets between networks and forwards them to their destinations' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-card-bg rounded-2xl">
                <p className="font-black text-primary text-lg mb-2">{item.term}</p>
                <p className="text-text-muted text-sm font-medium leading-relaxed">{item.def}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LogicGatesLab() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);

  const gates = [
    { name: 'AND', result: a && b, symbol: '&' },
    { name: 'OR', result: a || b, symbol: '≥1' },
    { name: 'NOT A', result: !a, symbol: '1' },
    { name: 'NAND', result: !(a && b), symbol: '↑' },
    { name: 'NOR', result: !(a || b), symbol: '↓' },
    { name: 'XOR', result: a !== b, symbol: '=1' },
  ];

  return (
    <div>
      <div className="flex gap-8 mb-10">
        {([['A', a, setA], ['B', b, setB]] as [string, boolean, (v: boolean) => void][]).map(([label, val, setter]) => (
          <button key={label} onClick={() => setter(!val)} className={`w-24 h-24 rounded-3xl text-2xl font-black border-4 transition-all ${val ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-white text-text-muted border-card-border'}`}>
            {label}<br /><span className="text-3xl">{val ? '1' : '0'}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gates.map(gate => (
          <div key={gate.name} className={`p-5 rounded-2xl border-2 text-center transition-all ${gate.result ? 'bg-primary text-white border-primary' : 'bg-white border-card-border text-foreground'}`}>
            <p className="text-[0.65rem] font-black uppercase tracking-widest mb-1 opacity-70">{gate.name}</p>
            <p className="text-3xl font-black">{gate.result ? '1' : '0'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
