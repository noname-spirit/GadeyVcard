'use client';

import { useState, useEffect } from 'react';
import { Eye, MousePointer, TrendingUp, Download, Users, Clock, Smartphone, Monitor, BarChart2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { LockedFeature } from '@/components/ui/LockedFeature';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { getCardsByUid } from '@/lib/supabase/cards';
import { getCardStats } from '@/lib/supabase/events';
import { getProfile } from '@/lib/supabase/profile';
import { getLeadsByCardId } from '@/lib/supabase/leads';

const HOURS = ['0h', '2h', '4h', '6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'];
const MOCK_HOURLY = [2, 1, 0, 0, 4, 12, 18, 24, 31, 28, 19, 14];
const MOCK_WEEKLY = [
  { day: 'Lun', leads: 3, views: 42 },
  { day: 'Mar', leads: 5, views: 61 },
  { day: 'Mer', leads: 2, views: 38 },
  { day: 'Jeu', leads: 8, views: 94 },
  { day: 'Ven', leads: 11, views: 118 },
  { day: 'Sam', leads: 6, views: 72 },
  { day: 'Dim', leads: 4, views: 55 },
];
const MOCK_LINKS = [
  { label: 'Instagram', clicks: 87, color: 'bg-pink-500' },
  { label: 'Site web', clicks: 54, color: 'bg-orange-500' },
  { label: 'WhatsApp', clicks: 42, color: 'bg-emerald-500' },
  { label: 'LinkedIn', clicks: 19, color: 'bg-blue-500' },
];
const MOCK_DOMAINS = [
  { label: 'Marketing', pct: 34 },
  { label: 'Immobilier', pct: 22 },
  { label: 'Restauration', pct: 18 },
  { label: 'Autre', pct: 26 },
];

const maxHourly = Math.max(...MOCK_HOURLY);
const DAYS_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const maxLinks = Math.max(...MOCK_LINKS.map((l) => l.clicks));

export default function AnalyticsPage() {
  const { uid } = useAuth();
  const [views, setViews] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [userPlan, setUserPlan] = useState<'free' | 'starter' | 'pro' | 'business'>('free');
  const [weeklyStats, setWeeklyStats] = useState<{ day: string; leads: number; views: number }[]>(MOCK_WEEKLY);

  const isPro = userPlan === 'pro' || userPlan === 'business';
  const isStarter = userPlan !== 'free';

  useEffect(() => {
    if (!uid) return;
    Promise.all([
      getCardsByUid(uid),
      getProfile(),
    ]).then(async ([cards, profile]) => {
      if (profile) setUserPlan(profile.plan ?? 'free');
      if (!cards.length) return;
      const [stats, leads] = await Promise.all([
        getCardStats(cards[0].id),
        getLeadsByCardId(cards[0].id),
      ]);
      setViews(stats.views);
      setClicks(stats.clicks);
      const today = new Date();
      setWeeklyStats(Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - 6 + i);
        return {
          day: DAYS_SHORT[d.getDay()],
          leads: leads.filter((l) => l.created_at && new Date(l.created_at).toDateString() === d.toDateString()).length,
          views: 0,
        };
      }));
    }).catch(() => {});
  }, [uid]);

  const conversionRate = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0';
  const maxWeekly = Math.max(...weeklyStats.map((d) => d.views), 1);

  return (
    <DashboardLayout active="Analytics">
      <div className="flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-white">Analytics</h2>
            <p className="text-zinc-500 text-sm mt-0.5">Performance de votre carte · 30 derniers jours</p>
          </div>
          {!isPro && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
              <BarChart2 size={13} />
              {isStarter ? 'Analytics avancés disponibles en plan Pro' : 'Analytics disponibles à partir du plan Starter'}
            </div>
          )}
        </div>

        {/* KPIs — Free = verrouillé, Starter = basiques, Pro = tout */}
        {!isStarter ? (
          <LockedFeature
            plan="starter"
            label="Analytics"
            desc="Vues · Clics · Taux de conversion · Téléchargements"
          >
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
              <StatCard label="Vues totales" value="1 284" sub="30 derniers jours" icon={Eye} />
              <StatCard label="Clics liens" value="347" sub="Instagram, Site, WhatsApp…" icon={MousePointer} />
              <StatCard label="Taux de conversion" value="3.2%" sub="Vues → Interactions" icon={TrendingUp} />
              <StatCard label="Téléchargements .vcf" value="48" sub="Contacts enregistrés" icon={Download} />
            </div>
          </LockedFeature>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4">
            <StatCard label="Vues totales" value={String(views)} sub="Toutes les visites" icon={Eye} />
            <StatCard label="Clics liens" value={String(clicks)} sub="Instagram, Site, WhatsApp…" icon={MousePointer} />
            <StatCard label="Taux de conversion" value={`${conversionRate}%`} sub="Vues → Interactions" icon={TrendingUp} />
            <StatCard label="Téléchargements .vcf" value="—" sub="Contacts enregistrés" icon={Download} />
          </div>
        )}

        {/* Bloc Pro — tout le reste */}
        {isPro ? (
          <div className="flex flex-col gap-6">
            {/* Heure de pointe */}
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-orange-400" />
                <h3 className="text-sm font-semibold text-zinc-300">Heure de pointe</h3>
              </div>
              <div className="flex items-end gap-1 h-24">
                {MOCK_HOURLY.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-orange-500/80 rounded-t-sm transition-all"
                      style={{ height: `${(v / maxHourly) * 80}px` }} />
                    <span className="text-[9px] text-zinc-600">{HOURS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Évolution hebdo */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-orange-400" />
                  <h3 className="text-sm font-semibold text-zinc-300">Évolution 7 jours</h3>
                </div>
                <div className="flex items-end gap-2 h-28">
                  {weeklyStats.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col gap-0.5">
                        <div className="w-full bg-orange-500/30 rounded-t-sm"
                          style={{ height: `${(d.views / maxWeekly) * 80}px` }} />
                        <div className="w-full bg-orange-500 rounded-t-sm"
                          style={{ height: `${(d.leads / 12) * 24}px` }} />
                      </div>
                      <span className="text-[9px] text-zinc-600">{d.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500/30" />Vues</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />Leads</span>
                </div>
              </div>

              {/* Appareil */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Smartphone size={14} className="text-orange-400" />
                  <h3 className="text-sm font-semibold text-zinc-300">Appareil</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Mobile', icon: Smartphone, pct: 78, color: 'bg-orange-500' },
                    { label: 'Desktop', icon: Monitor, pct: 22, color: 'bg-zinc-600' },
                  ].map((d) => (
                    <div key={d.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-zinc-400"><d.icon size={11} />{d.label}</span>
                        <span className="font-semibold text-zinc-300">{d.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Liens les plus cliqués */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <MousePointer size={14} className="text-orange-400" />
                  <h3 className="text-sm font-semibold text-zinc-300">Liens les plus cliqués</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {MOCK_LINKS.map((l) => (
                    <div key={l.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">{l.label}</span>
                        <span className="font-semibold text-zinc-300">{l.clicks} clics</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${l.color} rounded-full opacity-80`}
                          style={{ width: `${(l.clicks / maxLinks) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Domaine des leads */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-orange-400" />
                  <h3 className="text-sm font-semibold text-zinc-300">Secteur des leads</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {MOCK_DOMAINS.map((d) => (
                    <div key={d.label} className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">{d.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500/60 rounded-full" style={{ width: `${d.pct}%` }} />
                        </div>
                        <span className="text-xs font-medium text-zinc-300 w-8 text-right">{d.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <LockedFeature
            plan="pro"
            label="Analytics avancés"
            desc="Heure de pointe · Évolution 7 jours · Appareil · Liens les plus cliqués · Secteur des leads"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Heure de pointe */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Heure de pointe</p>
                <div className="flex items-end gap-1 h-20">
                  {MOCK_HOURLY.map((v, i) => (
                    <div key={i} className="flex-1 bg-orange-500/70 rounded-t-sm" style={{ height: `${(v / maxHourly) * 72}px` }} />
                  ))}
                </div>
              </div>
              {/* Évolution hebdo */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Évolution 7 jours</p>
                <div className="flex items-end gap-2 h-20">
                  {weeklyStats.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="w-full bg-orange-500/30 rounded-t-sm" style={{ height: `${(d.views / maxWeekly) * 60}px` }} />
                      <span className="text-[9px] text-zinc-600">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Liens */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Liens les plus cliqués</p>
                <div className="flex flex-col gap-2">
                  {MOCK_LINKS.map((l) => (
                    <div key={l.label} className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 w-20">{l.label}</span>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${l.color} rounded-full opacity-80`} style={{ width: `${(l.clicks / maxLinks) * 100}%` }} />
                      </div>
                      <span className="text-xs text-zinc-400 w-8 text-right">{l.clicks}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Secteur */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Secteur des leads</p>
                <div className="flex flex-col gap-2">
                  {MOCK_DOMAINS.map((d) => (
                    <div key={d.label} className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 w-24">{d.label}</span>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500/60 rounded-full" style={{ width: `${d.pct}%` }} />
                      </div>
                      <span className="text-xs text-zinc-400 w-8 text-right">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </LockedFeature>
        )}

      </div>
    </DashboardLayout>
  );
}
