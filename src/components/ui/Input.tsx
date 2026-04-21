import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm text-zinc-400 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={[
            'w-full px-4 py-2.5 rounded-xl text-sm',
            'bg-zinc-800/60 border text-zinc-100 placeholder:text-zinc-500',
            'transition-all duration-200 outline-none',
            error
              ? 'border-rose-500/50 focus:border-rose-500'
              : 'border-zinc-700/40 focus:border-orange-500/50',
            'focus:ring-1 focus:ring-orange-500/20',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
