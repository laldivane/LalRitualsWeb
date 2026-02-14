'use client';

import { EmotionalPhase } from '@/lib/types';

interface EmotionalStateBarProps {
  phase: EmotionalPhase;
}

export default function EmotionalStateBar({ phase }: EmotionalStateBarProps) {
  return (
    <div className="w-full border-y border-border-dark bg-void-card/50 px-6 py-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-8">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-crimson shadow-[0_0_10px_#c0003f]" />
          <span className="font-terminal text-xs uppercase tracking-[0.15em] text-text-body">
            Current State:{' '}
            <span className="text-crimson">{phase.replace(/_/g, ' ')}</span>
          </span>
        </div>
        <span className="font-terminal text-[10px] uppercase tracking-[0.2em] text-muted">
          <span className="text-crimson">●</span> Transmitting Signal
        </span>
      </div>
    </div>
  );
}
