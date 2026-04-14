'use client';
import { Skeleton } from 'boneyard-js/react';
import { useState } from 'react';

export default function TeacherAnalytics() {
  const [loading] = useState(false);

  return (
    <Skeleton name="teacher-analytics" loading={loading}>
      <div className="animate-fade-in pb-32 px-4 sm:px-8 lg:px-12">
        <h2 className="text-4xl font-black text-primary mb-4 tracking-tighter">Global Analytics</h2>
        <div className="glass-panel text-center text-text-muted py-20">
          <span className="text-4xl mb-4 block">📊</span>
          Analytics dashboard coming soon.
        </div>
      </div>
    </Skeleton>
  );
}
