'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface AmbientBackgroundProps {
  accent: string;
}

export function AmbientBackground({ accent }: AmbientBackgroundProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Pointer tracking + parallax via CSS vars (zero React re-render)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        el.style.setProperty('--mx', `${e.clientX}px`);
        el.style.setProperty('--my', `${e.clientY}px`);
        el.style.setProperty('--px', `${(e.clientX / w - 0.5) * 2}`);
        el.style.setProperty('--py', `${(e.clientY / h - 0.5) * 2}`);
        raf = 0;
      });
    };

    const onDown = (e: PointerEvent) => {
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1100);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Deterministic starfield (SSR-safe)
  const stars = useMemo(
    () =>
      Array.from({ length: 56 }, (_, i) => ({
        x: (i * 137.508) % 100,
        y: ((i * 73.247) + (i % 7) * 5) % 100,
        size: i % 9 === 0 ? 2 : 1,
        delay: (i % 11) * 0.3,
        duration: 3 + (i % 4),
        opacity: 0.25 + (i % 5) * 0.13,
        depth: (i % 3) + 1,
      })),
    [],
  );

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{
        ['--mx' as string]: '50%',
        ['--my' as string]: '50%',
        ['--px' as string]: '0',
        ['--py' as string]: '0',
      }}
    >
      {/* Base — warm dark radial */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, #0c0a09 0%, #060606 55%, #000 100%)',
        }}
      />

      {/* Aurora ribbon — top (parallax depth 2) */}
      <div
        className="absolute inset-0"
        style={{
          transform: 'translate3d(calc(var(--px) * 24px), calc(var(--py) * 14px), 0)',
          transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <motion.div
          className="absolute top-[12%] left-0 right-0 h-64 origin-center pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent}22 25%, ${accent}40 50%, ${accent}22 75%, transparent 100%)`,
            filter: 'blur(80px)',
            transform: 'rotate(-9deg) scaleX(1.3)',
          }}
          animate={{ x: ['-8%', '8%', '-8%'], opacity: [0.6, 0.85, 0.6] }}
          transition={{
            x: { duration: 28, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </div>

      {/* Aurora ribbon — bottom (parallax depth 1, counter direction) */}
      <div
        className="absolute inset-0"
        style={{
          transform: 'translate3d(calc(var(--px) * -16px), calc(var(--py) * -10px), 0)',
          transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <motion.div
          className="absolute bottom-[18%] left-0 right-0 h-48 origin-center pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent}1a 35%, ${accent}30 50%, ${accent}1a 65%, transparent 100%)`,
            filter: 'blur(70px)',
            transform: 'rotate(6deg) scaleX(1.3)',
          }}
          animate={{ x: ['6%', '-6%', '6%'], opacity: [0.5, 0.75, 0.5] }}
          transition={{
            x: { duration: 34, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 11, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </div>

      {/* Rotating conic mesh — slow ambient swirl */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] -translate-x-1/2 -translate-y-1/2 opacity-50"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${accent}14 60deg, transparent 130deg, transparent 200deg, ${accent}0d 260deg, transparent 330deg)`,
          filter: 'blur(80px)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      />

      {/* Light leak — diagonal from top-right (window-glow metaphor) */}
      <motion.div
        className="absolute -top-20 right-0 w-72 h-[130vh] origin-top pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${accent}33, ${accent}1a 40%, transparent 75%)`,
          filter: 'blur(50px)',
          transform: 'rotate(18deg) translateX(20%)',
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blueprint grid — base (dim) */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px),
            radial-gradient(circle at 0 0, rgba(255,255,255,0.9) 1.5px, transparent 0)
          `,
          backgroundSize: '64px 64px, 64px 64px, 64px 64px',
          backgroundPosition: '0 0, 0 0, 0 0',
          maskImage:
            'radial-gradient(ellipse 70% 60% at center, black 20%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at center, black 20%, transparent 80%)',
        }}
      />

      {/* Blueprint grid — REVEAL under cursor (designer's lamp on blueprint) */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(${accent}99 1px, transparent 1px),
            linear-gradient(90deg, ${accent}99 1px, transparent 1px),
            radial-gradient(circle at 0 0, ${accent} 2px, transparent 0)
          `,
          backgroundSize: '64px 64px, 64px 64px, 64px 64px',
          backgroundPosition: '0 0, 0 0, 0 0',
          maskImage:
            'radial-gradient(220px circle at var(--mx) var(--my), black 0%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(220px circle at var(--mx) var(--my), black 0%, transparent 70%)',
        }}
      />

      {/* Starfield — deterministic, individually twinkling + parallax by depth */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white will-change-transform"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              transform: `translate3d(calc(var(--px) * ${s.depth * -6}px), calc(var(--py) * ${s.depth * -4}px), 0)`,
              transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            animate={{ opacity: [s.opacity * 0.25, s.opacity, s.opacity * 0.25] }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Mouse spotlight — designer's lamp */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(600px circle at var(--mx) var(--my), ${accent}14, transparent 65%)`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Film grain */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.05] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="ambient-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch">
            <animate
              attributeName="baseFrequency"
              dur="9s"
              values="0.9;0.95;0.9"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ambient-grain)" />
      </svg>

      {/* Click ripples — tactile feedback */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: r.x,
              top: r.y,
              x: '-50%',
              y: '-50%',
              border: `1.5px solid ${accent}`,
              boxShadow: `0 0 20px ${accent}66, inset 0 0 20px ${accent}33`,
            }}
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: 360, height: 360, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
