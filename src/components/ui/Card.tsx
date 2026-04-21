import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'raised';
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-zinc-900 border border-zinc-800/60',
  glass: 'bg-white/5 backdrop-blur-sm border border-white/10',
  raised: 'bg-zinc-800 border border-zinc-700/40',
};

export function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        variantClasses[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
