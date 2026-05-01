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
import { getLeadsByCardId, deleteLead } from '@/lib/supabase/leads';
import { getCardStats } from '@/lib/supabase/events';
import { getProfile } from '@/lib/supabase/profile';
import { LockedFeature } from '@/components/ui/LockedFeature';


const MOCK_LEADS: LeadRow[] = [
  { id: '1', nom: 'Sophie Martin', email: 'sophie@cafe.fr', telephone: '+33612345678', domaine: 'Café', source: 'formulaire', createdAt: '2026-04-15T10:00:00Z' },
  { id: '2', nom: 'Maxime Nguyen', email: 'max@studio.com', telephone: '+33698765432', domaine: 'Marketing', source: 'qd code', createdAt: '2026-04-14T14:30:00Z' },
  { id: '3', nom: 'Léa Dupont', email: 'lea@villa.com', telephone: '+33611223344', domaine: 'Villa', source: 'formulaire', createdAt: '2026-04-13T09:15:00Z' },
];

export default function DashboardPage() {
  const { uid } = useAuth();
  const router = useRouter();
  const [name,setName] = useState('');

  const [slug,setslug] = useState('demo');

  const [leads, setLeads] = useState<LeadRow[]>(MOCK_LEADS);
  const [views, setViews] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [userPlan, setUserPlan] = useState<'free' | 'starter' | 'pro' | 'business'>('free');
  const canExport = userPlan !== 'free';

  useEffect(() => {
    if (!uid) return;
    getProfile().then((p) => { if (p) setUserPlan(p.plan ?? 'free'); }).catch(() => {});
    getCardsByUid(uid).then(async (cards) => {
      if (cards.length === 0) return;
      setslug(cards[0].slug);
      setName(cards[0].name);
const [dbLeads, stats] = await Promise.all([
        getLeadsByCardId(cards[0].id),
        getCardStats(cards[0].id),
      ]);
      setViews(stats.views);
      setClicks(stats.clicks);
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

  const handleDelete = async (id: string) => {
    await deleteLead(id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

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
          <StatCard label="Vues totales" value={String(views)} sub="Toutes les visites" icon={Eye} trend={{ value: 0, label: '' }} />
          <StatCard label="Clics liens" value={String(clicks)} sub="Instagram, Site, WhatsApp…" icon={MousePointer} trend={{ value: 0, label: '' }} />
          {userPlan === 'free' ? (
            <LockedFeature plan="starter" label="Leads captés" desc="Capturez et suivez vos contacts">
              <StatCard label="Leads captés" value="—" sub="Formulaire + QR code" icon={Users} trend={{ value: 0, label: '' }} />
            </LockedFeature>
          ) : (
            <StatCard label="Leads captés" value={String(leads.length)} sub="Formulaire + QR code" icon={Users} trend={{ value: 0, label: '' }} />
          )}
          {userPlan === 'free' ? (
            <LockedFeature plan="starter" label="Taux de conversion" desc="Vues → Leads">
              <StatCard label="Taux conversion" value="3.2%" sub="Vues → Leads" icon={TrendingUp} trend={{ value: -2, label: 'vs mois dernier' }} />
            </LockedFeature>
          ) : (
            <StatCard label="Taux conversion" value="3.2%" sub="Vues → Leads" icon={TrendingUp} trend={{ value: -2, label: 'vs mois dernier' }} />
          )}
        </div>

        {/* Leads */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base lg:text-lg font-semibold text-white">Leads récents</h3>
            {userPlan !== 'free' && <span className="text-xs text-zinc-500">{leads.length} contacts</span>}
          </div>
          {userPlan === 'free' ? (
            <LockedFeature plan="starter" label="Capture de leads" desc="Recevez et gérez les contacts qui visitent votre carte">
              <LeadsTable leads={MOCK_LEADS} />
            </LockedFeature>
          ) : (
            <LeadsTable leads={leads} onDelete={handleDelete} onExport={canExport ? handleExport : undefined} />
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
