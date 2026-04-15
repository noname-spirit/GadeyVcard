/**
 * Design tokens — source de vérité du design system vCard SaaS
 * Utiliser ces constantes dans les composants plutôt que des classes Tailwind en dur.
 */

export const colors = {
  brand: {
    DEFAULT: 'text-orange-500',
    light: 'text-orange-400',
    dark: 'text-orange-600',
    bg: 'bg-orange-500',
    bgSubtle: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    gradient: 'from-orange-500 to-orange-600',
  },
  success: {
    DEFAULT: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
  },
  bg: {
    base: 'bg-zinc-950',
    surface: 'bg-zinc-900',
    raised: 'bg-zinc-800',
    subtle: 'bg-zinc-800/50',
  },
  border: {
    DEFAULT: 'border-zinc-700/40',
    strong: 'border-zinc-700/60',
    subtle: 'border-zinc-800/40',
  },
  text: {
    primary: 'text-zinc-100',
    secondary: 'text-zinc-400',
    muted: 'text-zinc-500',
  },
} as const;

export const glass = {
  DEFAULT: 'bg-white/5 backdrop-blur-sm border border-white/10',
  strong: 'bg-white/8 backdrop-blur-md border border-white/15',
} as const;

export const radius = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
} as const;

export const shadow = {
  brand: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]',
  card: 'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
} as const;
