'use client';

import { useRouter } from 'next/navigation';
import type { CardTheme } from '@/types/card';

interface CardFooterProps {
  theme?: CardTheme;
  year?: number;
  brand?: string;
}

export function CardFooter({
  theme = 'dark',
  year = new Date().getFullYear(),
  brand = 'Noname-spirit',
}: CardFooterProps) {
  const router = useRouter();
  const dark = theme === 'dark';

  const copyClass = dark ? 'text-zinc-500' : 'text-zinc-500';
  const linkClass = dark
    ? 'text-zinc-500 hover:text-zinc-200'
    : 'text-zinc-500 hover:text-zinc-900';

  return (
    <div className="w-full mt-6 mb-2 flex flex-col items-center gap-1.5 text-center select-none">
      <p className={`text-[11px] tracking-wide ${copyClass}`}>
        © {year} {brand}. Tous droits réservés.
      </p>
      <button
        type="button"
        onClick={() => router.push('/login')}
        className={`text-[11px] tracking-wide underline-offset-4 hover:underline transition-colors ${linkClass}`}
      >
        Accéder à mon compte
      </button>
    </div>
  );
}
