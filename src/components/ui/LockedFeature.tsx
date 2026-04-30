'use client';

import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LockedFeatureProps {
  plan: 'starter' | 'pro';
  label: string;
  desc?: string;
  children?: React.ReactNode;
}

export function LockedFeature({ plan, label, desc, children }: LockedFeatureProps) {
  const planLabel = plan === 'pro' ? 'Pro' : 'Starter';
  const accent = plan === 'pro' ? 'text-amber-400' : 'text-orange-400';

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {children && (
        <div className="blur-md pointer-events-none select-none opacity-60">
          {children}
        </div>
      )}
      <div className={`${children ? 'absolute inset-0' : ''} flex flex-col items-center justify-center gap-3 bg-zinc-950/60 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800/60`}>
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/40 flex items-center justify-center">
          <Lock size={16} className={accent} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-zinc-200">{label}</p>
          {desc && <p className="text-xs text-zinc-500 mt-1 max-w-xs">{desc}</p>}
        </div>
        <a href="/dashboard/upgrade">
          <Button size="sm" className="text-xs">
            Passer au plan {planLabel}
          </Button>
        </a>
      </div>
    </div>
  );
}
