'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface LeaderboardEntry {
  userId: string;
  name: string;
  totalCompleted: number;
  totalScore: number;
  completionRate: number;
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const MEDALS = ['🥇', '🥈', '🥉'];

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => { if (data.success) setLeaderboard(data.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in px-4 sm:px-8 lg:px-12 pb-32">
      <div className="mb-12 animate-fade-in-down">
        <Link href="/student" className="inline-flex items-center gap-2 text-text-muted font-bold hover:text-primary transition-colors text-sm mb-8 group">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
        </Link>
        <h1 className="text-4xl sm:text-5xl font-black text-primary mb-3 tracking-tighter">Peer Learning Hub</h1>
        <p className="text-text-muted font-bold text-lg opacity-80">Learn together. Grow together.</p>
      </div>

      <div className="main-content-layout">
        <div className="flex flex-col gap-10">
          {/* Ask the Community */}
          <div className="peak-card p-8 bg-white border-none shadow-sm animate-fade-in-up">
            <h3 className="text-xl font-black text-primary mb-6 flex items-center gap-3">
              <span>💬</span> Ask the Community
            </h3>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Got a question about ICT? Ask your peers..."
              className="w-full p-4 bg-background rounded-2xl border border-card-border text-foreground font-medium resize-none outline-none focus:border-primary transition-all"
              rows={4}
            />
            <button 
              className="btn btn-primary mt-4 px-8 py-3 text-[0.8rem] font-black uppercase tracking-widest"
              onClick={() => { setQuestion(''); alert('Feature coming soon — your peers will respond shortly!'); }}
            >
              Post Question
            </button>
          </div>

          {/* Community Discussions */}
          <div className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-black text-primary flex items-center gap-4">
              <span className="w-8 h-1 bg-primary rounded-full"></span>Recent Discussions
            </h3>
            {[
              { user: 'Chidi O.', question: 'What is the difference between RAM and ROM?', replies: 4, time: '2h ago' },
              { user: 'Fatima Z.', question: 'How does binary addition work with carry bits?', replies: 7, time: '5h ago' },
              { user: 'Musa A.', question: 'Can someone explain subnetting in simple terms?', replies: 2, time: '1d ago' },
            ].map((post, i) => (
              <div key={i} className="peak-card p-6 bg-white border-none shadow-sm hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-white text-sm shrink-0">
                    {post.user[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-foreground group-hover:text-primary transition-colors mb-1">{post.question}</p>
                    <div className="flex items-center gap-4 text-[0.7rem] text-text-muted font-bold">
                      <span>{post.user}</span>
                      <span>•</span>
                      <span>{post.replies} replies</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Leaderboard */}
        <aside className="insights-panel animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
          <div className="peak-card p-8 bg-card-bg border-none shadow-none">
            <h4 className="text-lg font-black mb-6 text-primary flex items-center gap-3">
              <span className="text-2xl">🏆</span> Leaderboard
            </h4>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary-glow border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {leaderboard.slice(0, 5).map((entry, i) => (
                  <div key={entry.userId} className="flex items-center gap-3 group">
                    <span className="text-lg w-7 text-center">{i < 3 ? MEDALS[i] : `#${i + 1}`}</span>
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-black text-white text-sm">
                      {entry.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{entry.name}</p>
                      <p className="text-[0.65rem] text-text-muted font-bold">{entry.totalCompleted} completed</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/student/achievements" className="btn btn-outline w-full mt-6 text-[0.7rem] py-3 border-primary/10 font-black uppercase tracking-widest">
              Full Leaderboard
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
