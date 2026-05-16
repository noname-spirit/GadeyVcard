'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ExternalLink, Settings, Users, Menu, X, Zap, CreditCard, LogOut, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { getCardsByUid } from '@/lib/supabase/cards';
import { getProfile, Profile } from '@/lib/supabase/profile';
import Link from 'next/link';
import Image from 'next/image';

const BASE_NAV = [
  { label: 'Aperçu', icon: Eye, href: '/dashboard' },
  { label: 'Leads', icon: Users, href: '/dashboard/leads' },
  { label: 'Analytics', icon: BarChart2, href: '/dashboard/analytics' },
  { label: 'Paramètres', icon: Settings, href: '/dashboard/settings' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  active?: string;
}

function Sidebar({ active, slug, onClose, onLogout,profil }: { active?: string; slug: string; onClose?: () => void; onLogout: () => void; profil: Profile | null }) {
  const nav = [
    ...BASE_NAV.slice(0, 1),
    { label: 'Ma carte', icon: ExternalLink, href: `/${slug}` },
    ...BASE_NAV.slice(1),
  ];
  return (
    <div className="flex flex-col h-full p-4 gap-6">
      <div className="flex items-center justify-between pt-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo/logo-horizontal-white.svg" alt="vCard" width={200} height={64} className="h-16 w-auto" priority />
          <span className="text-xs text-zinc-500">Dashboard</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => (
          <a key={item.label} href={item.href} onClick={onClose}
            className={['flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              active === item.label ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
            ].join(' ')}>
            <item.icon size={16} />{item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Plan actuel</span>
            <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">{profil?.plan}</span>
          </div>
          {profil?.plan !== 'pro' && profil?.plan !== 'business' && (
            <Link href="/dashboard/upgrade">
              <Button size="sm" className="w-full text-xs flex items-center justify-center gap-1.5">
                <Zap size={11} />Passer Pro
              </Button>
            </Link>
          )}
        </div>
        <button onClick={onLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full">
          <LogOut size={16} />Se déconnecter
        </button>
      </div>
    </div>
  );
}

export function DashboardLayout({ children, active }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState('demo');
  const [profil, setprofil] = useState<Profile | null>(null);
  const router = useRouter();
  const { uid } = useAuth();

  useEffect(() => {
    if (!uid) return;
    getProfile().then((data) => setprofil(data)).catch(() => {});
    getCardsByUid(uid).then((cards) => {
      if (cards.length > 0) setSlug(cards[0].slug);
    }).catch(() => {});
  }, [uid]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">

        <aside className="hidden lg:flex w-60 min-h-screen bg-zinc-900 border-r border-zinc-800/60 flex-col fixed top-0 left-0">
          <Sidebar active={active} slug={slug} onLogout={handleLogout} profil={profil} />
        </aside>

        <AnimatePresence>
          {open && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />
              <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className="fixed top-0 left-0 w-64 h-full bg-zinc-900 border-r border-zinc-800/60 z-50 lg:hidden">
                <Sidebar active={active} slug={slug} onClose={() => setOpen(false)} onLogout={handleLogout} profil={profil} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 lg:ml-60 flex flex-col min-h-screen">
          <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800/60 sticky top-0 z-30">
            <button onClick={() => setOpen(true)} className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all">
              <Menu size={20} />
            </button>
            <Image src="/logo/logo-horizontal-white.svg" alt="vCard" width={160} height={48} className="h-12 w-auto" priority />
            {profil?.plan !== 'pro' && profil?.plan !== 'business' ? (
              <Link href="/dashboard/upgrade" className="p-2 rounded-xl text-zinc-400 hover:text-orange-400 transition-all">
                <CreditCard size={18} />
              </Link>
            ) : (
              <div className="p-2 w-9" />
            )}
          </div>
          <div className="flex-1 p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
