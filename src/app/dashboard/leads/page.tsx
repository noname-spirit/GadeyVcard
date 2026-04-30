'use client';

import { useState, useEffect } from 'react';
import { Users, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import type { LeadRow } from '@/components/dashboard/LeadsTable';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { getCardsByUid } from '@/lib/supabase/cards';
import { getLeadsByCardId, deleteLead } from '@/lib/supabase/leads';
import { getProfile } from '@/lib/supabase/profile';
import { LockedFeature } from '@/components/ui/LockedFeature';

const MOCK_LEADS: LeadRow[] = [
  { id: '1', nom: 'Sophie Martin', email: 'sophie@cafe.fr', telephone: '+33612345678', domaine: 'Café', source: 'formulaire', createdAt: '2026-04-15T10:00:00Z' },
  { id: '2', nom: 'Maxime Nguyen', email: 'max@studio.com', telephone: '+33698765432', domaine: 'Marketing', source: 'qd code', createdAt: '2026-04-14T14:30:00Z' },
  { id: '3', nom: 'Léa Dupont', email: 'lea@villa.com', telephone: '+33611223344', domaine: 'Immobilier', source: 'formulaire', createdAt: '2026-04-13T09:15:00Z' },
  { id: '4', nom: 'Thomas Bernard', email: 'thomas@tech.io', telephone: '+33622334455', domaine: 'Tech', source: 'formulaire', createdAt: '2026-04-12T16:00:00Z' },
  { id: '5', nom: 'Emma Rousseau', email: 'emma@design.fr', telephone: undefined, domaine: 'Design', source: 'qd code', createdAt: '2026-04-11T11:30:00Z' },
];

export default function LeadsPage() {
  const { uid } = useAuth();
  const [leads, setLeads] = useState<LeadRow[]>(MOCK_LEADS);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<'free' | 'starter' | 'pro' | 'business'>('free');
  const canExport = userPlan !== 'free';

  useEffect(() => {
    getProfile().then((p) => { if (p) setUserPlan(p.plan ?? 'free'); }).catch(() => {});
    if (!uid) { setLoading(false); return; }
    getCardsByUid(uid).then(async (cards) => {
      if (!cards.length) { setLoading(false); return; }
      const dbLeads = await getLeadsByCardId(cards[0].id);
      if (dbLeads.length > 0) {
        setLeads(dbLeads.map((l) => ({
          id: l.id ?? crypto.randomUUID(),
          nom: l.name,
          email: l.email ?? '',
          telephone: l.phone ?? undefined,
          message: l.message ?? undefined,
          domaine: l.domain ?? '',
          source: 'formulaire',
          createdAt: l.created_at ?? '',
        })));
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [uid]);

  const handleDelete = async (id: string) => {
    await deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleExport = () => {
    const csv = ['Nom,Email,Téléphone,Message,Domaine,Source,Date',
      ...leads.map((l) => `"${l.nom}","${l.email}","${l.telephone || ''}","${l.message || ''}","${l.domaine}","${l.source}","${l.createdAt}"`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout active="Leads">
      <div className="flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white">Leads</h2>
            <p className="text-zinc-500 text-sm mt-0.5">{leads.length} contact{leads.length > 1 ? 's' : ''} enregistré{leads.length > 1 ? 's' : ''}</p>
          </div>
          {canExport ? (
            <button onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/40 rounded-xl text-zinc-300 hover:text-white transition-all self-start sm:self-auto">
              <Download size={14} />
              Exporter CSV
            </button>
          ) : (
            <LockedFeature plan="starter" label="Export CSV" desc="Exportez vos leads au format CSV">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-800 border border-zinc-700/40 rounded-xl text-zinc-300">
                <Download size={14} />
                Exporter CSV
              </button>
            </LockedFeature>
          )}
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: leads.length, icon: Users, color: 'text-orange-400 bg-orange-500/10' },
            { label: 'Ce mois', value: leads.filter((l) => new Date(l.createdAt) > new Date(Date.now() - 30 * 86400000)).length, icon: Users, color: 'text-emerald-400 bg-emerald-500/10' },
            { label: 'Cette semaine', value: leads.filter((l) => new Date(l.createdAt) > new Date(Date.now() - 7 * 86400000)).length, icon: Users, color: 'text-blue-400 bg-blue-500/10' },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-4 flex flex-col gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={14} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-zinc-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : (
          <LeadsTable leads={leads} onDelete={handleDelete} onExport={canExport ? handleExport : undefined} />
        )}

      </div>
    </DashboardLayout>
  );
}
