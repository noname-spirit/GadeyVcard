'use client';

import { Eye, MousePointer, Users, TrendingUp, ExternalLink, Settings } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import type { LeadRow } from '@/components/dashboard/LeadsTable';
import { Button } from '@/components/ui/Button';

// Données mock — remplacées par fetch Supabase
const MOCK_STATS = [
  { label: 'Vues totales', value: '1 284', sub: '30 derniers jours', icon: Eye, trend: { value: 12, label: 'vs mois dernier' } },
  { label: 'Clics liens', value: '347', sub: 'Instagram, Site, WhatsApp', icon: MousePointer, trend: { value: 8, label: 'vs mois dernier' } },
  { label: 'Leads captés', value: '42', sub: 'Formulaire + QR code', icon: Users, trend: { value: 24, label: 'vs mois dernier' } },
  { label: 'Taux conversion', value: '3.2%', sub: 'Vues → Leads', icon: TrendingUp, trend: { value: -2, label: 'vs mois dernier' } },
];

const MOCK_LEADS: LeadRow[] = [
  { id: '1', nom: 'Sophie Martin', email: 'sophie@cafe.fr', telephone: '+33612345678', domaine: 'Café', source: 'formulaire', createdAt: '2026-04-15T10:00:00Z' },
  { id: '2', nom: 'Maxime Nguyen', email: 'max@studio.com', telephone: '+33698765432', domaine: 'Marketing', source: 'qd code', createdAt: '2026-04-14T14:30:00Z' },
  { id: '3', nom: 'Léa Dupont', email: 'lea@villa.com', telephone: '+33611223344', domaine: 'Villa', source: 'formulaire', createdAt: '2026-04-13T09:15:00Z' },
];

export default function DashboardPage() {
  const handleDelete = (id: string) => {
    // TODO : DELETE /api/leads/[id]
    console.log('Delete lead:', id);
  };

  const handleExport = () => {
    // TODO : export CSV via API
    const csv = [
      'Nom,Email,Téléphone,Domaine,Source,Date',
      ...MOCK_LEADS.map((l) =>
        `${l.nom},${l.email},${l.telephone || ''},${l.domaine},${l.source},${l.createdAt}`
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Sidebar + content layout */}
      <div className="flex">

        {/* Sidebar */}
        <aside className="w-60 min-h-screen bg-zinc-900 border-r border-zinc-800/60 flex flex-col p-4 gap-6 fixed top-0 left-0">
          <div className="pt-2">
            <h1 className="text-lg font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Smart vCard
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">Dashboard</p>
          </div>

          <nav className="flex flex-col gap-1">
            {[
              { label: 'Aperçu', icon: Eye, active: true },
              { label: 'Ma carte', icon: ExternalLink },
              { label: 'Leads', icon: Users },
              { label: 'Paramètres', icon: Settings },
            ].map((item) => (
              <button
                key={item.label}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left',
                  item.active
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
                ].join(' ')}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Plan actuel</span>
                <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                  Free
                </span>
              </div>
              <Button size="sm" className="w-full text-xs">
                Passer Pro
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-60 p-8 flex flex-col gap-8">

          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Aperçu</h2>
              <p className="text-zinc-500 text-sm mt-0.5">Bienvenue, Noname Spirit</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ExternalLink size={14} />
                Voir ma carte
              </Button>
              <Button size="sm" className="flex items-center gap-2">
                <Settings size={14} />
                Modifier
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {MOCK_STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* Leads */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Leads récents</h3>
              <span className="text-xs text-zinc-500">{MOCK_LEADS.length} contacts</span>
            </div>
            <LeadsTable
              leads={MOCK_LEADS}
              onDelete={handleDelete}
              onExport={handleExport}
            />
          </div>

        </main>
      </div>
    </div>
  );
}
