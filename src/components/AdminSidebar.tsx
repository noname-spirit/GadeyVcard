'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Shield, Activity, Users, CreditCard, CreditCard as CardIcon, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { label: 'Dashboard',     icon: Activity,  href: '/admin' },
  { label: 'Utilisateurs',  icon: Users,     href: '/admin/utilisateurs' },
  { label: 'Revenus',       icon: CreditCard, href: '/admin/revenue' },
  { label: 'Cartes',        icon: CardIcon,  href: '/admin/cards' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  return (
    <aside className="w-56 min-h-screen bg-zinc-900 border-r border-zinc-800/60 flex flex-col p-4 gap-6 fixed top-0 left-0">
      <div className="pt-2 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-orange-400" />
          <h1 className="text-base font-bold text-white">Super Admin</h1>
        </div>
        <p className="text-xs text-zinc-600">Smart vCard</p>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                isActive
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
              ].join(' ')}
            >
              <item.icon size={15} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-3 text-xs text-zinc-500">
          <p className="font-semibold text-zinc-400 mb-1">Santé système</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tous les services actifs</span>
          </div>
        </div>
        <button
          onClick={async () => { await createClient().auth.signOut(); router.push('/admin/login'); }}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
