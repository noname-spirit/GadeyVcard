'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, MousePointer, Users, TrendingUp, ExternalLink, Settings } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { LeadsTable } from '@/components/dashboard/LeadsTable';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import type { LeadRow } from '@/components/dashboard/LeadsTable';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { getCardsByUid } from '@/lib/supabase/cards';
import { getLeadsByCardId } from '@/lib/supabase/leads';
import { Card } from '@/components/ui';

const MOCK_STATS_BASE = [
  { label: 'Vues totales', value: '1 284', sub: '30 derniers jours', icon: Eye, trend: { value: 12, label: 'vs mois dernier' } },
  { label: 'Clics liens', value: '347', sub: 'Instagram, Site, WhatsApp', icon: MousePointer, trend: { value: 8, label: 'vs mois dernier' } },
  { label: 'Taux conversion', value: '3.2%', sub: 'Vues → Leads', icon: TrendingUp, trend: { value: -2, label: 'vs mois dernier' } },
];

const MOCK_LEADS: LeadRow[] = [
  { id: '1', nom: 'Sophie Martin', email: 'sophie@cafe.fr', telephone: '+33612345678', domaine: 'Café', source: 'formulaire', createdAt: '2026-04-15T10:00:00Z' },
  { id: '2', nom: 'Maxime Nguyen', email: 'max@studio.com', telephone: '+33698765432', domaine: 'Marketing', source: 'qd code', createdAt: '2026-04-14T14:30:00Z' },
  { id: '3', nom: 'Léa Dupont', email: 'lea@villa.com', telephone: '+33611223344', domaine: 'Villa', source: 'formulaire', createdAt: '2026-04-13T09:15:00Z' },
];

export default function DashboardPage() {
  const { uid } = useAuth();
  const router = useRouter();
  const [name,setName] = useState('');

  const [slug] = useState(() => {
    if (typeof window === 'undefined') return 'demo';
    try {
      const stored = localStorage.getItem('vcard_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.slug || 'demo';
      }
    } catch { /* ignore */ }
    return 'demo';
  });

  const [leads, setLeads] = useState<LeadRow[]>(MOCK_LEADS);

  useEffect(() => {
    if (!uid) return;
    getCardsByUid(uid).then(async (cards) => {
      if (cards.length === 0) return;
      const dbLeads = await getLeadsByCardId(cards[0].id);
      setName(cards[0].name);
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
    }).catch(() => {});
  }, [uid]);

  const handleDelete = (id: string) => console.log('Delete lead:', id);

  const handleExport = () => {
    const csv = ['Nom,Email,Téléphone,Message,Domaine,Source,Date',
      ...leads.map((l) => `${l.nom},${l.email},${l.telephone || ''},${l.message || ''},${l.domaine},${l.source},${l.createdAt}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout active="Aperçu">
      <div className="flex flex-col gap-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white">Aperçu</h2>
            <p className="text-zinc-500 text-sm mt-0.5">Bienvenue, {name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => window.open(`/${slug}`, '_blank')}>
              <ExternalLink size={14} />
              Ma carte
            </Button>
            <Button size="sm" className="flex items-center gap-2" onClick={() => router.push('/dashboard/settings')}>
              <Settings size={14} />
              Modifier
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
          {[
            ...MOCK_STATS_BASE.slice(0, 2),
            { label: 'Leads captés', value: String(leads.length), sub: 'Formulaire + QR code', icon: Users, trend: { value: 0, label: '' } },
            ...MOCK_STATS_BASE.slice(2),
          ].map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Leads */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base lg:text-lg font-semibold text-white">Leads récents</h3>
            <span className="text-xs text-zinc-500">{leads.length} contacts</span>
          </div>
          <LeadsTable leads={leads} onDelete={handleDelete} onExport={handleExport} />
        </div>

      </div>
    </DashboardLayout>
  );
}
