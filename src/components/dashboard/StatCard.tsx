import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
}

export function StatCard({ label, value, sub, icon: Icon, trend }: StatCardProps) {
  const positive = trend && trend.value >= 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between">
        <span className="text-zinc-500 text-sm font-medium">{label}</span>
        <div className="p-2 bg-orange-500/10 rounded-lg">
          <Icon size={16} className="text-orange-400" />
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold text-white">{value}</span>
        {sub && <span className="text-xs text-zinc-500">{sub}</span>}
      </div>

      {trend && (
        <div className={`text-xs font-medium flex items-center gap-1 ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
          <span>{positive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}% {trend.label}</span>
        </div>
      )}
    </div>
  );
}
