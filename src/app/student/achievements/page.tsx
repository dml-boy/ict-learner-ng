'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LeaderboardEntry {
  userId: string;
  name: string;
  totalCompleted: number;
  totalScore: number;
  totalModules: number;
  completionRate: number;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function AchievementsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => { if (data.success) setLeaderboard(data.data); })
      .catch(err => console.error('[Achievements] Leaderboard fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in px-4 sm:px-8 lg:px-12 pb-32">
      <div className="mb-12 animate-fade-in-down">
        <Link href="/student" className="inline-flex items-center gap-2 text-text-muted font-bold hover:text-primary transition-colors text-sm mb-8 group">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
        </Link>
        <h1 className="text-4xl sm:text-5xl font-black text-primary mb-3 tracking-tighter">Achievements</h1>
        <p className="text-text-muted font-bold text-lg opacity-80">Track your progress and see how you rank among peers.</p>
      </div>

      {/* Achievement Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {[
          { icon: '🚀', label: 'First Module', desc: 'Complete your first module', earned: true },
          { icon: '🔥', label: 'On Fire', desc: '5 modules in a week', earned: false },
          { icon: '🛡️', label: 'Master', desc: 'Complete an entire subject', earned: false },
          { icon: '⚡', label: 'Speed Learner', desc: 'Finish in under 30 mins', earned: false },
        ].map((badge, i) => (
          <div key={i} className={`peak-card p-8 text-center bg-white border-none shadow-sm transition-all ${!badge.earned ? 'opacity-40 grayscale' : 'hover:shadow-md hover:-translate-y-1'}`}>
            <div className="text-5xl mb-4">{badge.icon}</div>
            <h4 className="font-black text-foreground text-sm mb-1">{badge.label}</h4>
            <p className="text-text-muted text-xs font-medium">{badge.desc}</p>
            {badge.earned && <div className="mt-4 text-[0.6rem] font-black text-primary uppercase tracking-widest bg-primary/10 rounded-full px-3 py-1">Earned</div>}
          </div>
        ))}
      </div>

      {/* Live Leaderboard */}
      <div className="peak-card bg-white border-none shadow-sm p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-2xl font-black text-primary mb-8 flex items-center gap-4">
          <span className="w-10 h-1 bg-primary rounded-full"></span>
          Global Leaderboard
        </h3>

        {loading ? (
          <div className="flex flex-col items-center py-16 gap-4">
            <div className="w-10 h-10 border-4 border-primary-glow border-t-primary rounded-full animate-spin" />
            <p className="text-text-muted font-bold text-[0.7rem] uppercase tracking-widest">Fetching rankings...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16 opacity-50">
            <div className="text-5xl mb-4">🏆</div>
            <p className="font-black text-foreground">No rankings yet. Complete some modules to appear here!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {leaderboard.map((entry, i) => (
              <div key={entry.userId} className={`flex items-center gap-6 p-5 rounded-2xl transition-all ${i === 0 ? 'bg-primary/5 border border-primary/10' : 'bg-background hover:bg-card-bg'}`}>
                <div className="text-2xl w-10 text-center font-black">
                  {i < 3 ? MEDALS[i] : <span className="text-text-muted text-lg">#{i + 1}</span>}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-white text-lg shadow-sm">
                  {entry.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <p className="font-black text-foreground">{entry.name || 'Anonymous'}</p>
                  <p className="text-xs text-text-muted font-medium">{entry.totalModules} modules attempted</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary text-lg">{entry.totalCompleted}</p>
                  <p className="text-[0.65rem] text-text-muted font-black uppercase tracking-widest">Completed</p>
                </div>
                <div className="hidden sm:block w-28">
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min(entry.completionRate, 100)}%` }}
                    />
                  </div>
                  <p className="text-[0.6rem] text-text-muted font-black mt-1 text-right">{Math.round(entry.completionRate)}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
