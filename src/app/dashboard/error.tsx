'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

export default function DashboardError({
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
    <div className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <AlertTriangle size={20} className="text-rose-400" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-bold text-white">Erreur de chargement</h2>
          <p className="text-sm text-zinc-500">
            Cette section n&apos;a pas pu se charger. Réessayez ou revenez au tableau de bord.
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
            <RotateCcw size={13} />
            Réessayer
          </button>
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={13} />
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
