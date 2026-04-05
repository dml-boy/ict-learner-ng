// Boneyard — skeleton loading primitives for ICT Learner NG

/* ───────────────────────────────────────────────
   1. PRIMITIVE: SkeletonBlock
   A generic animated rectangle. Compose these
   into any shape of loading placeholder.
─────────────────────────────────────────────── */
interface SkeletonBlockProps {
  width?: string;
  height?: string;
  className?: string;
  delay?: string; // animation-delay CSS value
  rounded?: string; // tailwind rounded class
}

export function SkeletonBlock({
  width = '100%',
  height = '1rem',
  className = '',
  delay = '0s',
  rounded = 'rounded-xl',
}: SkeletonBlockProps) {
  return (
    <div
      className={`skeleton-bone ${rounded} ${className}`}
      style={{ width, height, animationDelay: delay }}
      aria-hidden="true"
    />
  );
}

/* ───────────────────────────────────────────────
   2. STAT CARD skeleton (matches the 3-card grid)
─────────────────────────────────────────────── */
export function SkeletonStatCard() {
  return (
    <div className="peak-card p-8 flex flex-col items-center text-center gap-4 glossy-border">
      {/* icon circle */}
      <SkeletonBlock width="56px" height="56px" rounded="rounded-2xl" />
      {/* big number */}
      <SkeletonBlock width="60%" height="36px" rounded="rounded-lg" delay="0.1s" />
      {/* label */}
      <SkeletonBlock width="45%" height="12px" rounded="rounded-full" delay="0.15s" />
    </div>
  );
}

/* ───────────────────────────────────────────────
   3. MODULE CARD skeleton (matches dashboard-grid)
─────────────────────────────────────────────── */
export function SkeletonModuleCard() {
  return (
    <div className="peak-card flex flex-col p-10 gap-6 glossy-border">
      {/* top row: tag + icon */}
      <div className="flex justify-between items-start">
        <SkeletonBlock width="90px" height="24px" rounded="rounded-full" />
        <SkeletonBlock width="56px" height="56px" rounded="rounded-2xl" delay="0.05s" />
      </div>
      {/* title */}
      <SkeletonBlock width="80%" height="22px" rounded="rounded-lg" delay="0.1s" />
      <SkeletonBlock width="60%" height="16px" rounded="rounded-lg" delay="0.12s" />
      {/* body text lines */}
      <SkeletonBlock width="100%" height="14px" rounded="rounded-lg" delay="0.14s" />
      <SkeletonBlock width="90%" height="14px" rounded="rounded-lg" delay="0.16s" />
      {/* footer */}
      <div className="flex justify-between items-center mt-auto pt-8 border-t border-primary/5">
        <SkeletonBlock width="60px" height="14px" rounded="rounded-full" delay="0.2s" />
        <SkeletonBlock width="80px" height="36px" rounded="rounded-xl" delay="0.22s" />
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   4. LEADERBOARD ROW skeleton
─────────────────────────────────────────────── */
export function SkeletonLeaderboardRow() {
  return (
    <div className="flex gap-4 items-start">
      {/* avatar */}
      <SkeletonBlock width="40px" height="40px" rounded="rounded-xl" className="shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <SkeletonBlock width="70%" height="14px" rounded="rounded-full" delay="0.08s" />
        <SkeletonBlock width="45%" height="12px" rounded="rounded-full" delay="0.12s" />
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   5. TAB BAR skeleton
─────────────────────────────────────────────── */
export function SkeletonTabBar({ count = 3 }: { count?: number }) {
  return (
    <div className="flex gap-2 p-1.5 bg-white shadow-sm border border-card-border rounded-2xl">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBlock
          key={i}
          height="44px"
          rounded="rounded-xl"
          className="flex-1"
          delay={`${i * 0.08}s`}
        />
      ))}
    </div>
  );
}

/* ───────────────────────────────────────────────
   6. COMPOSED: Student Dashboard skeleton
─────────────────────────────────────────────── */
export function StudentDashboardSkeleton() {
  return (
    <div className="px-4 sm:px-8 lg:px-12 pb-32 animate-fade-in" aria-label="Loading dashboard…">
      {/* Header row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div className="flex flex-col gap-3">
          <SkeletonBlock width="clamp(180px, 40vw, 380px)" height="48px" rounded="rounded-2xl" />
          <SkeletonBlock width="clamp(140px, 25vw, 260px)" height="18px" rounded="rounded-full" delay="0.1s" />
        </div>
        <SkeletonBlock width="220px" height="64px" rounded="rounded-2xl" delay="0.15s" className="shrink-0" />
      </div>

      <div className="main-content-layout">
        <div className="flex flex-col gap-12">
          {/* Stat cards */}
          <div className="stat-grid">
            {[0, 1, 2].map(i => <SkeletonStatCard key={i} />)}
          </div>

          {/* Section header */}
          <div className="flex flex-col gap-2 mb-4">
            <SkeletonBlock width="180px" height="28px" rounded="rounded-xl" />
            <SkeletonBlock width="240px" height="16px" rounded="rounded-full" delay="0.1s" />
          </div>

          {/* Module grid */}
          <div className="dashboard-grid">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <SkeletonModuleCard key={i} />
            ))}
          </div>
        </div>

        {/* Insights aside */}
        <aside className="insights-panel">
          <div className="peak-card p-8 bg-card-bg border-none shadow-none mb-8">
            <SkeletonBlock width="120px" height="22px" rounded="rounded-xl" className="mb-6" />
            <div className="flex flex-col gap-6">
              {[0, 1, 2].map(i => <SkeletonLeaderboardRow key={i} />)}
            </div>
            <SkeletonBlock width="100%" height="44px" rounded="rounded-xl" className="mt-8" delay="0.3s" />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────
   7. COMPOSED: Teacher Dashboard skeleton
─────────────────────────────────────────────── */
export function TeacherDashboardSkeleton() {
  return (
    <div className="pb-32 px-4 sm:px-8 lg:px-12 animate-fade-in" aria-label="Loading hub…">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 mb-12">
        <div className="flex gap-5 items-center">
          <SkeletonBlock width="64px" height="64px" rounded="rounded-2xl" className="shrink-0" />
          <div className="flex flex-col gap-2">
            <SkeletonBlock width="180px" height="36px" rounded="rounded-xl" />
            <SkeletonBlock width="260px" height="14px" rounded="rounded-full" delay="0.1s" />
          </div>
        </div>
        <SkeletonBlock width="200px" height="56px" rounded="rounded-2xl" delay="0.15s" className="shrink-0" />
      </div>

      <div className="main-content-layout">
        <div className="flex flex-col gap-10">
          {/* Stat grid */}
          <div className="stat-grid">
            {[0, 1, 2].map(i => <SkeletonStatCard key={i} />)}
          </div>
          
          {/* Tab bar */}
          <SkeletonTabBar count={3} />

          {/* Content cards below tab */}
          <div className="dashboard-grid">
            {[0, 1, 2, 3].map(i => (
              <SkeletonModuleCard key={i} />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <aside className="insights-panel">
          <div className="peak-card p-8 bg-card-bg border-none shadow-none mb-8">
            <SkeletonBlock width="130px" height="22px" rounded="rounded-xl" className="mb-6" />
            <div className="flex flex-col gap-4">
              <SkeletonBlock width="100%" height="48px" rounded="rounded-xl" />
              <SkeletonBlock width="100%" height="48px" rounded="rounded-xl" delay="0.08s" />
            </div>
          </div>
          <div className="peak-card p-8 bg-white border border-card-border shadow-sm mb-8">
            <SkeletonBlock width="140px" height="22px" rounded="rounded-xl" className="mb-6" />
            <div className="flex flex-col gap-6">
              {[0, 1, 2].map(i => <SkeletonLeaderboardRow key={i} />)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
