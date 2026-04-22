'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StripeModal } from '@/components/payment/StripeModal';

type Billing = 'monthly' | 'yearly';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 5, yearly: 4 },
    features: ['1 carte', 'QR code + export', 'Stats basiques', '3 templates', 'Sans watermark'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 15, yearly: 12 },
    features: ['1 carte', 'Toutes les stats', 'Agenda Calendar', 'Custom domain', 'Leads CSV', 'Support NFC'],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: { monthly: 30, yearly: 24 },
    features: ['5 cartes', 'Tout le plan Pro', 'CSV avancé', 'Support prioritaire'],
  },
];

export default function UpgradePage() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [selected, setSelected] = useState('pro');
  const [showModal, setShowModal] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === selected)!;
  const amount = billing === 'yearly'
    ? selectedPlan.price.yearly * 12
    : selectedPlan.price.monthly;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="p-2 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all">
            <ArrowLeft size={18} />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-white">Passer à un plan supérieur</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Plan actuel : <span className="text-zinc-300 font-medium">Free</span></p>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800/60 rounded-2xl p-1 self-start">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${billing === 'monthly' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Annuel
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">−20%</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <motion.button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={[
                'relative flex flex-col text-left rounded-2xl p-5 border transition-all duration-200',
                selected === plan.id
                  ? 'bg-zinc-800 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.1)]'
                  : 'bg-zinc-900/60 border-zinc-800/60 hover:border-zinc-700',
              ].join(' ')}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 text-xs font-semibold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-3 py-1 rounded-full whitespace-nowrap">
                    <Zap size={10} />
                    Recommandé
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-white">{plan.name}</span>
                <div className={`w-5 h-5 rounded-full border-2 transition-all ${selected === plan.id ? 'bg-orange-500 border-orange-500' : 'border-zinc-600'}`} />
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-white">{plan.price[billing]}€</span>
                <span className="text-zinc-500 text-sm">/mois</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                    <Check size={12} className="text-emerald-400 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Checkout summary */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-5">
          <h3 className="font-semibold text-white">Récapitulatif</h3>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Plan {selectedPlan.name} ({billing === 'monthly' ? 'mensuel' : 'annuel'})</span>
              <span className="text-white font-semibold">{selectedPlan.price[billing]}€/mois</span>
            </div>
            {billing === 'yearly' && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Économie annuelle</span>
                <span className="text-emerald-400 font-semibold">
                  −{((PLANS.find(p => p.id === selected)!.price.monthly - selectedPlan.price.yearly) * 12).toFixed(0)}€/an
                </span>
              </div>
            )}
            <div className="h-px bg-zinc-800 my-1" />
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-medium">Total</span>
              <span className="text-xl font-bold text-white">
                {billing === 'yearly'
                  ? `${(selectedPlan.price.yearly * 12).toFixed(0)}€/an`
                  : `${selectedPlan.price.monthly}€/mois`}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={() => setShowModal(true)} className="w-full flex items-center justify-center gap-2">
              <CreditCard size={15} />
              Payer avec Stripe
            </Button>
            <p className="text-xs text-zinc-600 text-center">
              Paiement sécurisé via Stripe · Annulation à tout moment · Sans engagement
            </p>
          </div>
        </div>

      </div>

      <StripeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        planName={selectedPlan.name}
        amount={amount}
        billing={billing}
      />
    </div>
  );
}
