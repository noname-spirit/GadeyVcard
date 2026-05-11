'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Trophy, ChevronDown, X, Check } from 'lucide-react';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminSidebar } from '@/components/AdminSidebar';
import type { Profile } from '@/lib/supabase/profile';

const PLAN_COLORS: Record<string, string> = {
  free:     'text-zinc-400 bg-zinc-800 border-zinc-700/40',
  starter:  'text-blue-400 bg-blue-500/10 border-blue-500/20',
  pro:      'text-orange-400 bg-orange-500/10 border-orange-500/20',
  business: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
};

const AVATAR_COLORS = ['bg-orange-500', 'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'];
const PLANS = ['free', 'starter', 'pro', 'business'] as const;

type PlanFilter = 'tous' | typeof PLANS[number];

interface UserRow extends Profile {
  email: string;
  lastSignIn: string;
  cardSlug: string;
  leadsCount: number;
}

function PlanModal({
  user,
  onClose,
  onSave,
}: {
  user: UserRow;
  onClose: () => void;
  onSave: (plan: string) => Promise<void>;
}) {
  const [selected, setSelected] = useState(user.plan);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(selected);
    setSaving(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-5 shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between">
          <p className="font-semibold text-white">Changer le plan</p>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all">
            <X size={15} />
          </button>
        </div>
        <p className="text-sm text-zinc-400">
          Utilisateur : <span className="text-white font-medium">{user.full_name ?? user.email}</span>
        </p>
        <div className="flex flex-col gap-2">
          {PLANS.map((plan) => (
            <button
              key={plan}
              onClick={() => setSelected(plan)}
              className={[
                'flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all capitalize',
                selected === plan
                  ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                  : 'border-zinc-800/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200',
              ].join(' ')}
            >
              {plan}
              {selected === plan && <Check size={14} />}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || selected === user.plan}
          className="w-full py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Enregistrement…' : 'Appliquer'}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('tous');
  const [planModal, setPlanModal] = useState<UserRow | null>(null);

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then(({ profiles, cardByUser, leadsByUser, emailMap, lastSignInMap }) => {
        const rows: UserRow[] = (profiles ?? []).map((p: Profile) => ({
          ...p,
          email: emailMap?.[p.id] ?? '',
          lastSignIn: lastSignInMap?.[p.id] ?? '',
          cardSlug: cardByUser?.[p.id]?.slug ?? '',
          leadsCount: leadsByUser?.[p.id] ?? 0,
        }));
        setUsers(rows);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const top5 = useMemo(() =>
    [...users].sort((a, b) => b.leadsCount - a.leadsCount).slice(0, 5),
    [users]
  );

  const filtered = useMemo(() =>
    users.filter((u) => {
      const matchesPlan = planFilter === 'tous' || u.plan === planFilter;
      const q = search.toLowerCase();
      const matchesSearch = !q || [u.full_name ?? '', u.email, u.cardSlug].some((v) => v.toLowerCase().includes(q));
      return matchesPlan && matchesSearch;
    }),
    [users, search, planFilter]
  );

  const handlePlanSave = async (userId: string, plan: string) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plan }),
    });
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, plan: plan as Profile['plan'] } : u));
  };

  const handleExport = () => {
    const csv = [
      'Nom,Email,Plan,Slug,Leads,Inscription,Dernière activité',
      ...users.map((u) => [
        u.full_name ?? '',
        u.email,
        u.plan,
        u.cardSlug,
        u.leadsCount,
        new Date(u.created_at).toLocaleDateString('fr-FR'),
        u.lastSignIn ? new Date(u.lastSignIn).toLocaleDateString('fr-FR') : '—',
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'utilisateurs.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const fmtDate = (iso: string) =>
    iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const fmtRelative = (iso: string) => {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  return (
    <AdminRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
        <AdminSidebar />

        <main className="flex-1 ml-56 p-8 flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Utilisateurs</h2>
              <p className="text-zinc-500 text-sm mt-0.5">
                {loading ? '…' : `${users.length} comptes enregistrés`}
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800/60 rounded-xl hover:border-zinc-700 hover:text-white transition-all"
            >
              <Download size={14} />
              Exporter CSV
            </button>
          </div>

          {/* Top 5 leads */}
          {!loading && top5.some((u) => u.leadsCount > 0) && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-amber-400" />
                <h3 className="text-sm font-semibold text-zinc-300">Top 5 — Leads captés</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {top5.map((u, i) => (
                  <div key={u.id} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                        {(u.full_name ?? u.email)?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      {i === 0 && <span className="text-xs text-amber-400 font-semibold">#1</span>}
                    </div>
                    <p className="text-xs font-medium text-zinc-200 truncate">{u.full_name ?? u.email}</p>
                    <p className="text-xl font-bold text-white">{u.leadsCount}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize w-fit ${PLAN_COLORS[u.plan]}`}>
                      {u.plan}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex gap-1 bg-zinc-900 border border-zinc-800/60 rounded-xl p-1 flex-wrap">
              {(['tous', ...PLANS] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setPlanFilter(f)}
                  className={[
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                    planFilter === f ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-200',
                  ].join(' ')}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom, email, slug…"
                className="pl-8 pr-4 py-2 text-sm bg-zinc-900 border border-zinc-800/60 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 w-60"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-zinc-800/60 overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/60">
                  {['Utilisateur', 'Plan', 'Carte', 'Leads', 'Inscrit le', 'Dernière activité', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-zinc-600 text-xs">Aucun utilisateur trouvé.</td>
                  </tr>
                ) : filtered.map((user, idx) => (
                  <tr key={user.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                    {/* Utilisateur */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                          {(user.full_name ?? user.email)?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-zinc-200 truncate max-w-[160px]">{user.full_name ?? '—'}</p>
                          <p className="text-xs text-zinc-500 truncate max-w-[160px]">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${PLAN_COLORS[user.plan]}`}>
                        {user.plan}
                      </span>
                    </td>

                    {/* Carte */}
                    <td className="px-4 py-3">
                      {user.cardSlug ? (
                        <a
                          href={`/${user.cardSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-orange-400 hover:text-orange-300 transition-colors font-mono"
                        >
                          /{user.cardSlug}
                        </a>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </td>

                    {/* Leads */}
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${user.leadsCount > 0 ? 'text-white' : 'text-zinc-600'}`}>
                        {user.leadsCount}
                      </span>
                    </td>

                    {/* Inscrit le */}
                    <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">
                      {fmtDate(user.created_at)}
                    </td>

                    {/* Dernière activité */}
                    <td className="px-4 py-3 text-xs text-zinc-500 whitespace-nowrap">
                      {fmtRelative(user.lastSignIn)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setPlanModal(user)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all border border-zinc-800/60 hover:border-zinc-700 whitespace-nowrap"
                      >
                        Changer plan
                        <ChevronDown size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-600 text-right">{filtered.length} utilisateur{filtered.length > 1 ? 's' : ''}</p>

        </main>
      </div>

      <AnimatePresence>
        {planModal && (
          <PlanModal
            user={planModal}
            onClose={() => setPlanModal(null)}
            onSave={(plan) => handlePlanSave(planModal.id, plan)}
          />
        )}
      </AnimatePresence>
    </AdminRoute>
  );
}
