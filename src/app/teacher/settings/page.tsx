'use client';
import { Skeleton } from 'boneyard-js/react';
import { useState } from 'react';

export default function TeacherSettings() {
  const [loading] = useState(false);

  return (
    <Skeleton name="teacher-settings" loading={loading}>
      <div className="animate-fade-in pb-32 px-4 sm:px-8 lg:px-12">
        <h2 className="text-4xl font-black text-primary mb-4 tracking-tighter">Settings</h2>
        <div className="glass-panel text-center text-text-muted py-20">
          <span className="text-4xl mb-4 block">⚙️</span>
          Settings page coming soon.
        </div>
      </div>
    </Skeleton>
  );
}
