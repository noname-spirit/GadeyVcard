'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, Users, Zap, ExternalLink } from 'lucide-react';
import { AdminRoute } from '@/components/AdminRoute';
import { AdminSidebar } from '@/components/AdminSidebar';
import { StatCard } from '@/components/dashboard/StatCard';

const PLAN_COLORS: Record<string, string> = {
  free:     'text-zinc-400 bg-zinc-800 border-zinc-700/40',
  starter:  'text-blue-400 bg-blue-500/10 border-blue-500/20',
  pro:      'text-orange-400 bg-orange-500/10 border-orange-500/20',
  business: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
};

const PLAN_BAR_COLORS: Record<string, string> = {
  free:     'bg-zinc-600',
  starter:  'bg-blue-500',
  pro:      'bg-orange-500',
  business: 'bg-violet-500',
};

const PLAN_PRICES: Record<string, number> = {
  starter: 9,
  pro: 22,
  business: 49,
};

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  planId: string;
  billing: string;
  created: number;
}

interface RevenueData {
  mrr: number;
  arr: number;
  newPaidThisMonth: number;
  planCounts: Record<string, number>;
  transactions: Transaction[];
}

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/revenue')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalPlanUsers = data
    ? Object.entries(data.planCounts).reduce((s, [k, v]) => k !== 'free' ? s + v : s, 0)
    : 0;

  const totalUsers = data
    ? Object.values(data.planCounts).reduce((s, v) => s + v, 0)
    : 0;

  const fmtDate = (ts: number) =>
    new Date(ts * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

  const fmtEur = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
        <AdminSidebar />

        <main className="flex-1 ml-56 p-8 flex flex-col gap-8">

          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-white">Revenus</h2>
            <p className="text-zinc-500 text-sm mt-0.5">Estimations basées sur les plans actifs</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="MRR estimé"
              value={loading ? '…' : fmtEur(data?.mrr ?? 0)}
              sub="Revenu mensuel récurrent"
              icon={CreditCard}
              trend={{ value: 0, label: '' }}
            />
            <StatCard
              label="ARR estimé"
              value={loading ? '…' : fmtEur(data?.arr ?? 0)}
              sub="Revenu annuel récurrent"
              icon={TrendingUp}
              trend={{ value: 0, label: '' }}
            />
            <StatCard
              label="Abonnés payants"
              value={loading ? '…' : String(totalPlanUsers)}
              sub="Starter + Pro + Business"
              icon={Users}
              trend={{ value: 0, label: '' }}
            />
            <StatCard
              label="Nouveaux ce mois"
              value={loading ? '…' : String(data?.newPaidThisMonth ?? 0)}
              sub="Nouveaux payants"
              icon={Zap}
              trend={{ value: 0, label: '' }}
            />
          </div>

          {/* Plan breakdown */}
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Répartition par plan</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {(['free', 'starter', 'pro', 'business'] as const).map((plan) => {
                  const count = data?.planCounts?.[plan] ?? 0;
                  const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                  const planMrr = plan !== 'free' ? count * PLAN_PRICES[plan] : 0;
                  return (
                    <div key={plan} className="flex items-center gap-4">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize w-20 text-center shrink-0 ${PLAN_COLORS[plan]}`}>
                        {plan}
                      </span>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.1 }}
                          className={`h-full ${PLAN_BAR_COLORS[plan]} rounded-full`}
                        />
                      </div>
                      <div className="flex items-center gap-4 shrink-0 min-w-[200px] justify-end text-xs">
                        <span className="text-zinc-400">{count} utilisateur{count > 1 ? 's' : ''}</span>
                        <span className="text-zinc-600">{pct}%</span>
                        {plan !== 'free' && (
                          <span className="text-emerald-400 font-semibold w-16 text-right">{fmtEur(planMrr)}/mois</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Transactions */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
              Dernières transactions <span className="text-zinc-600 normal-case font-normal">(via Stripe)</span>
            </h3>
            <div className="rounded-2xl border border-zinc-800/60 overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-800/60 bg-zinc-900/60">
                    {['Plan', 'Montant', 'Facturation', 'Date', 'Stripe'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                        </div>
                      </td>
                    </tr>
                  ) : !data?.transactions?.length ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-zinc-600 text-xs">
                        Aucune transaction trouvée.
                      </td>
                    </tr>
                  ) : data.transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${PLAN_COLORS[tx.planId] ?? PLAN_COLORS.free}`}>
                          {tx.planId}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-white">
                        {tx.amount.toFixed(2)}{tx.currency === 'eur' ? '€' : tx.currency.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 capitalize text-xs">
                        {tx.billing === 'yearly' ? 'Annuel' : 'Mensuel'}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400 whitespace-nowrap">
                        {fmtDate(tx.created)}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`https://dashboard.stripe.com/payments/${tx.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-zinc-500 hover:text-orange-400 transition-colors"
                        >
                          <ExternalLink size={11} />
                          Voir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </AdminRoute>
  );
}
