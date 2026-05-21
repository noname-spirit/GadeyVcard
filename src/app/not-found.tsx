'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-950 flex flex-col items-center justify-center px-4 py-12 text-white">
      <div className="flex flex-col items-center gap-8 max-w-md text-center">

        <Image
          src="/logo/logo-vertical-white.svg"
          alt="vCard"
          width={240}
          height={240}
          className="h-44 w-auto opacity-90"
          priority
        />

        <div className="flex flex-col items-center gap-3">
          <h1 className="text-7xl font-bold bg-linear-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-white">Page introuvable</h2>
          <p className="text-zinc-400 text-sm">
            Cette page n&apos;existe pas ou a été déplacée. Pas de panique, retournons à l&apos;accueil.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-white bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 shadow-[0_8px_24px_rgba(249,115,22,0.25)] transition-all duration-300"
          >
            <Home size={16} />
            Retour à l&apos;accueil
          </button>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/60 transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Mon dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
