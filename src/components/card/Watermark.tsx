interface WatermarkProps {
  plan?: 'free' | 'starter' | 'pro' | 'business';
}

export function Watermark({ plan = 'free' }: WatermarkProps) {
  if (plan !== 'free') return null;

  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      <span className="text-zinc-600 text-[10px]">Propulsé par</span>
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-semibold text-zinc-500 hover:text-orange-400 transition-colors"
      >
        Smart vCard
      </a>
      <span className="text-[10px] text-zinc-700">·</span>
      <a
        href="/pricing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-zinc-600 hover:text-orange-400 transition-colors underline"
      >
        Supprimer
      </a>
    </div>
  );
}
