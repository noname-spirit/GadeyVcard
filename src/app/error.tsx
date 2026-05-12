'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <AlertTriangle size={24} className="text-rose-400" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-lg font-bold text-white">Une erreur est survenue</h1>
          <p className="text-sm text-zinc-500">
            Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou revenir à l&apos;accueil.
          </p>
          {error.digest && (
            <p className="text-xs text-zinc-700 font-mono mt-1">#{error.digest}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-colors"
          >
            <RotateCcw size={14} />
            Réessayer
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 text-sm font-medium transition-colors"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}
