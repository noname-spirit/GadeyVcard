'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, TrendingUp, Activity, Search, MoreHorizontal, Ban, Eye } from 'lucide-react';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminSidebar } from '@/components/AdminSidebar';
import { StatCard } from '@/components/dashboard/StatCard';
import type { Profile } from '@/lib/supabase/profile';

const PLAN_COLORS: Record<string, string> = {
  free:     'text-zinc-400 bg-zinc-800 border-zinc-700/40',
  starter:  'text-blue-400 bg-blue-500/10 border-blue-500/20',
  pro:      'text-orange-400 bg-orange-500/10 border-orange-500/20',
  business: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const PLAN_BAR_COLORS: Record<string, string> = {
  free:     'bg-zinc-600',
  starter:  'bg-blue-500',
  pro:      'bg-orange-500',
  business: 'bg-emerald-500',
};

const TABS = ['Utilisateurs', 'Revenus', 'Cartes', 'Logs'] as const;
type Tab = typeof TABS[number];

export default function AdminPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('Utilisateurs');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [cardCountByUser, setCardCountByUser] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/data')
      .then((r) => r.json())
      .then(({ profiles: allProfiles, cards: allCards }) => {
        setProfiles(allProfiles ?? []);
        const counts: Record<string, number> = {};
        (allCards ?? []).forEach((c: { user_id: string }) => {
          counts[c.user_id] = (counts[c.user_id] ?? 0) + 1;
        });
        setCardCountByUser(counts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = profiles.length;
  const totalCards = Object.values(cardCountByUser).reduce((s, n) => s + n, 0);
  const paidUsers  = profiles.filter((p) => p.plan !== 'free').length;
  const conversionRate = totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : '0';

  const planCounts = (['free', 'starter', 'pro', 'business'] as const).map((plan) => ({
    plan,
    users: profiles.filter((p) => p.plan === plan).length,
    pct: totalUsers > 0 ? Math.round((profiles.filter((p) => p.plan === plan).length / totalUsers) * 100) : 0,
  }));

  const filtered = profiles.filter((p) =>
    [p.full_name ?? '', p.plan].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">

        <AdminSidebar />

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

          {/* Stats KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Utilisateurs total" value={loading ? '…' : String(totalUsers)} sub="Tous plans confondus" icon={Users} trend={{ value: 0, label: '' }} />
            <StatCard label="MRR" value="—" sub="Monthly Recurring Revenue" icon={CreditCard} trend={{ value: 0, label: '' }} />
            <StatCard label="Cartes actives" value={loading ? '…' : String(totalCards)} sub="Cartes créées" icon={Activity} trend={{ value: 0, label: '' }} />
            <StatCard label="Taux conversion" value={loading ? '…' : `${conversionRate}%`} sub="Free → payant" icon={TrendingUp} trend={{ value: 0, label: '' }} />
          </div>

          {/* Répartition par plan */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Répartition par plan</h3>
            <div className="flex flex-col gap-3">
              {planCounts.map((p) => (
                <div key={p.plan} className="flex items-center gap-3">
                  <span className="text-sm text-zinc-400 w-16 shrink-0 capitalize">{p.plan}</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className={`h-full ${PLAN_BAR_COLORS[p.plan]} rounded-full`}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 w-20 text-right shrink-0">{p.users} users · {p.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Users table */}
          <div className="flex flex-col gap-4">
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

            <div className="rounded-2xl border border-zinc-800/60 overflow-x-auto">
              <table className="w-full text-sm min-w-150">
                <thead>
                  <tr className="border-b border-zinc-800/60 bg-zinc-900/60">
                    {['Utilisateur', 'Plan', 'Cartes', 'Inscrit', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-zinc-600 text-xs">Chargement…</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-zinc-600 text-xs">Aucun utilisateur trouvé.</td>
                    </tr>
                  ) : filtered.map((user) => (
                    <tr key={user.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-zinc-200">{user.full_name ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${PLAN_COLORS[user.plan]}`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{cardCountByUser[user.id] ?? 0}</td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
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
    </AdminRoute>
  );
}
