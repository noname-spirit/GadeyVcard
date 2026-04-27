'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, TrendingUp, Activity, Search, MoreHorizontal, Shield, Ban, Eye } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StatCard } from '@/components/dashboard/StatCard';

const MOCK_STATS = [
  { label: 'Utilisateurs total', value: '1 847', sub: 'Tous plans confondus', icon: Users, trend: { value: 18, label: 'ce mois' } },
  { label: 'MRR', value: '4 230€', sub: 'Monthly Recurring Revenue', icon: CreditCard, trend: { value: 11, label: 'vs mois dernier' } },
  { label: 'Cartes actives', value: '2 103', sub: 'Cartes avec activité < 30j', icon: Activity, trend: { value: 9, label: 'vs mois dernier' } },
  { label: 'Taux conversion', value: '8.4%', sub: 'Free → payant', icon: TrendingUp, trend: { value: 2, label: 'vs mois dernier' } },
];

const MOCK_USERS = [
  { id: '1', name: 'Sophie Martin', email: 'sophie@cafe.fr', plan: 'Pro', cards: 1, status: 'active', joined: '2026-03-12' },
  { id: '2', name: 'Maxime Nguyen', email: 'max@studio.com', plan: 'Business', cards: 4, status: 'active', joined: '2026-02-28' },
  { id: '3', name: 'Léa Dupont', email: 'lea@villa.com', plan: 'Free', cards: 1, status: 'active', joined: '2026-04-01' },
  { id: '4', name: 'Thomas Brun', email: 'thomas@agence.fr', plan: 'Starter', cards: 1, status: 'suspended', joined: '2026-01-15' },
  { id: '5', name: 'Emma Wilson', email: 'emma@restaurant.com', plan: 'Pro', cards: 1, status: 'active', joined: '2026-04-10' },
];

const PLAN_COLORS: Record<string, string> = {
  Free: 'text-zinc-400 bg-zinc-800 border-zinc-700/40',
  Starter: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Pro: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  Business: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const TABS = ['Utilisateurs', 'Revenus', 'Cartes', 'Logs'] as const;
type Tab = typeof TABS[number];

export default function AdminPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('Utilisateurs');

  const filtered = MOCK_USERS.filter((u) =>
    [u.name, u.email, u.plan].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">

      {/* Sidebar */}
      <aside className="w-56 min-h-screen bg-zinc-900 border-r border-zinc-800/60 flex flex-col p-4 gap-6 fixed top-0 left-0">
        <div className="pt-2 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-orange-400" />
            <h1 className="text-base font-bold text-white">Super Admin</h1>
          </div>
          <p className="text-xs text-zinc-600">Smart vCard</p>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { label: 'Dashboard', icon: Activity, active: true },
            { label: 'Utilisateurs', icon: Users },
            { label: 'Revenus', icon: CreditCard },
            { label: 'Cartes', icon: Eye },
          ].map((item) => (
            <button
              key={item.label}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                item.active
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
              ].join(' ')}
            >
              <item.icon size={15} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-3 text-xs text-zinc-500">
            <p className="font-semibold text-zinc-400 mb-1">Santé système</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Tous les services actifs</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 p-8 flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard global</h2>
            <p className="text-zinc-500 text-sm mt-0.5">Vue d&apos;ensemble du SaaS</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900 border border-zinc-800/60 rounded-xl px-3 py-2">
            <Activity size={12} className="text-emerald-400 animate-pulse" />
            Temps réel
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {MOCK_STATS.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* MRR breakdown */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Répartition par plan</h3>
          <div className="flex flex-col gap-3">
            {[
              { plan: 'Free', users: 1102, pct: 60, color: 'bg-zinc-600' },
              { plan: 'Starter', users: 312, pct: 17, color: 'bg-blue-500' },
              { plan: 'Pro', users: 298, pct: 16, color: 'bg-orange-500' },
              { plan: 'Business', users: 135, pct: 7, color: 'bg-emerald-500' },
            ].map((p) => (
              <div key={p.plan} className="flex items-center gap-3">
                <span className="text-sm text-zinc-400 w-16 shrink-0">{p.plan}</span>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={`h-full ${p.color} rounded-full`}
                  />
                </div>
                <span className="text-xs text-zinc-500 w-16 text-right shrink-0">{p.users} users</span>
              </div>
            ))}
          </div>
        </div>

        {/* Users table */}
        <div className="flex flex-col gap-4">
          {/* Tabs + search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex gap-1 bg-zinc-900 border border-zinc-800/60 rounded-xl p-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                    tab === t ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-200',
                  ].join(' ')}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un utilisateur..."
                className="pl-8 pr-4 py-2 text-sm bg-zinc-900 border border-zinc-800/60 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-zinc-800/60 overflow-x-auto">
            <table className="w-full text-sm min-w-150">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/60">
                  {['Utilisateur', 'Plan', 'Cartes', 'Statut', 'Inscrit', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-200">{user.name}</span>
                        <span className="text-xs text-zinc-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PLAN_COLORS[user.plan]}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{user.cards}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span className={`text-xs ${user.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {user.status === 'active' ? 'Actif' : 'Suspendu'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">
                      {new Date(user.joined).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-all" title="Voir">
                          <Eye size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Suspendre">
                          <Ban size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-all">
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-600 text-right">{filtered.length} utilisateur{filtered.length > 1 ? 's' : ''}</p>
        </div>

      </main>
    </div>
    </ProtectedRoute>
  );
}
