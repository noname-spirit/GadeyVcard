'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { CardTheme } from '@/types/card';

interface CardFooterProps {
  theme?: CardTheme;
  year?: number;
  brand?: string;
  accentColor?: string;
}

export function CardFooter({
  theme = 'dark',
  year = new Date().getFullYear(),
  brand = 'Noname-spirit',
  accentColor,
}: CardFooterProps) {
  const router = useRouter();
  const dark = theme === 'dark';
  const [hover, setHover] = useState(false);

  const copyClass = dark ? 'text-zinc-500' : 'text-zinc-500';
  const accent = accentColor || (dark ? '#f97316' : '#6366f1');

  return (
    <div className="w-full mt-6 mb-2 flex flex-col items-center gap-1.5 text-center select-none">
      <p className={`text-[11px] tracking-wide ${copyClass}`}>
        © {year} {brand}. Tous droits réservés.
      </p>
      <button
        type="button"
        onClick={() => router.push('/login')}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          color: accent,
          textDecoration: hover ? 'underline' : 'none',
          textUnderlineOffset: '4px',
        }}
        className="text-[11px] tracking-wide font-medium transition-opacity hover:opacity-80"
      >
        Accéder à mon compte
      </button>
    </div>
  );
}
