'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, ExternalLink, ToggleLeft, ToggleRight } from 'lucide-react';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminSidebar } from '@/components/AdminSidebar';

const PLAN_COLORS: Record<string, string> = {
  free:     'text-zinc-400 bg-zinc-800 border-zinc-700/40',
  starter:  'text-blue-400 bg-blue-500/10 border-blue-500/20',
  pro:      'text-orange-400 bg-orange-500/10 border-orange-500/20',
  business: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
};

const TEMPLATE_LABELS: Record<string, string> = {
  dark:        'Dark',
  light:       'Light',
  color:       'Color',
  influencer:  'Influencer',
  restaurant:  'Restaurant',
};

const TEMPLATE_COLORS: Record<string, string> = {
  dark:        'text-zinc-300 bg-zinc-800/60',
  light:       'text-zinc-100 bg-zinc-500/20',
  color:       'text-orange-300 bg-orange-500/15',
  influencer:  'text-pink-300 bg-pink-500/15',
  restaurant:  'text-amber-300 bg-amber-500/15',
};

interface AdminCard {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  template: string;
  is_active: boolean;
  view_count: number;
  created_at: string;
  leadsCount: number;
  ownerName: string;
  ownerPlan: string;
}

type TemplateFilter = 'tous' | 'dark' | 'light' | 'color' | 'influencer' | 'restaurant';
type StatusFilter = 'tous' | 'active' | 'inactive';

export default function AdminCardsPage() {
  const [cards, setCards] = useState<AdminCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [templateFilter, setTemplateFilter] = useState<TemplateFilter>('tous');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('tous');
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/cards')
      .then((r) => r.json())
      .then(({ cards: data }) => setCards(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    cards.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q || [c.slug, c.name, c.ownerName].some((v) => v.toLowerCase().includes(q));
      const matchTemplate = templateFilter === 'tous' || c.template === templateFilter;
      const matchStatus = statusFilter === 'tous'
        || (statusFilter === 'active' && c.is_active)
        || (statusFilter === 'inactive' && !c.is_active);
      return matchSearch && matchTemplate && matchStatus;
    }),
    [cards, search, templateFilter, statusFilter]
  );

  const handleToggle = async (card: AdminCard) => {
    setToggling(card.id);
    const newActive = !card.is_active;
    await fetch('/api/admin/cards', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: card.id, is_active: newActive }),
    });
    setCards((prev) => prev.map((c) => c.id === card.id ? { ...c, is_active: newActive } : c));
    setToggling(null);
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  const activeCount = cards.filter((c) => c.is_active).length;

  return (
    <AdminRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
        <AdminSidebar />

        <main className="flex-1 ml-56 p-8 flex flex-col gap-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Cartes</h2>
              <p className="text-zinc-500 text-sm mt-0.5">
                {loading ? '…' : `${cards.length} cartes · ${activeCount} actives`}
              </p>
            </div>
          </div>

          {/* Stats rapides */}
          {!loading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['dark', 'light', 'color', 'influencer', 'restaurant'] as const).map((tpl) => {
                const count = cards.filter((c) => c.template === tpl).length;
                return (
                  <div key={tpl} className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 flex flex-col gap-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md w-fit ${TEMPLATE_COLORS[tpl]}`}>
                      {TEMPLATE_LABELS[tpl]}
                    </span>
                    <p className="text-2xl font-bold text-white mt-1">{count}</p>
                    <p className="text-xs text-zinc-500">cartes</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {/* Template filter */}
              <div className="flex gap-1 bg-zinc-900 border border-zinc-800/60 rounded-xl p-1">
                {(['tous', 'dark', 'light', 'color', 'influencer', 'restaurant'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTemplateFilter(f)}
                    className={[
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                      templateFilter === f ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-200',
                    ].join(' ')}
                  >
                    {f === 'tous' ? 'Tous' : TEMPLATE_LABELS[f]}
                  </button>
                ))}
              </div>
              {/* Status filter */}
              <div className="flex gap-1 bg-zinc-900 border border-zinc-800/60 rounded-xl p-1">
                {(['tous', 'active', 'inactive'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={[
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                      statusFilter === f ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-200',
                    ].join(' ')}
                  >
                    {f === 'tous' ? 'Tous' : f === 'active' ? 'Actives' : 'Inactives'}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Slug, nom, propriétaire…"
                className="pl-8 pr-4 py-2 text-sm bg-zinc-900 border border-zinc-800/60 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 w-60"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-zinc-800/60 overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/60">
                  {['Carte', 'Propriétaire', 'Template', 'Plan', 'Vues', 'Leads', 'Créée le', 'Statut'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-zinc-600 text-xs">Aucune carte trouvée.</td>
                  </tr>
                ) : filtered.map((card) => (
                  <tr key={card.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                    {/* Carte */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-zinc-200">{card.name}</span>
                        <a
                          href={`/${card.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors font-mono"
                        >
                          /{card.slug}
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </td>

                    {/* Propriétaire */}
                    <td className="px-4 py-3 text-sm text-zinc-300">
                      {card.ownerName}
                    </td>

                    {/* Template */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${TEMPLATE_COLORS[card.template] ?? 'text-zinc-400 bg-zinc-800'}`}>
                        {TEMPLATE_LABELS[card.template] ?? card.template}
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${PLAN_COLORS[card.ownerPlan]}`}>
                        {card.ownerPlan}
                      </span>
                    </td>

                    {/* Vues */}
                    <td className="px-4 py-3 text-sm font-semibold text-white">
                      {card.view_count ?? 0}
                    </td>

                    {/* Leads */}
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${card.leadsCount > 0 ? 'text-white' : 'text-zinc-600'}`}>
                        {card.leadsCount}
                      </span>
                    </td>

                    {/* Créée le */}
                    <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">
                      {fmtDate(card.created_at)}
                    </td>

                    {/* Statut toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(card)}
                        disabled={toggling === card.id}
                        className="flex items-center gap-1.5 text-xs font-medium transition-all disabled:opacity-50"
                        title={card.is_active ? 'Désactiver' : 'Activer'}
                      >
                        {card.is_active ? (
                          <>
                            <ToggleRight size={18} className="text-emerald-400" />
                            <span className="text-emerald-400">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft size={18} className="text-zinc-600" />
                            <span className="text-zinc-600">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-600 text-right">{filtered.length} carte{filtered.length > 1 ? 's' : ''}</p>

        </main>
      </div>
    </AdminRoute>
  );
}
