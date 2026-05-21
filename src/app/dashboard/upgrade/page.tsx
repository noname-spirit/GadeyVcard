'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Zap, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StripeModal } from '@/components/payment/StripeModal';
import Link from 'next/link';
import { getProfile } from '@/lib/supabase/profile';

type Billing = 'monthly' | 'yearly';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 9, yearly: 7, yearlyTotal: 84 },
    features: [
      '1 vCard',
      'QR code HD téléchargeable',
      'Liens sociaux illimités',
      '500 leads / mois inclus',
      'Export CSV leads',
      'Stats basiques (vues, clics, appareil)',
      '3 templates au choix',
      'Sans branding app',
      'Export .vcf',
      'Essai 14 jours sans CB',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 22, yearly: 16.58, yearlyTotal: 199 },
    features: [
      '1 vCard',
      'QR code HD + NFC ready',
      'URL personnalisée + Vanity URL courte',
      'Liens sociaux illimités',
      'Tous les templates + couleur accent perso',
      '2 000 leads / mois inclus',
      'Export CSV leads',
      'Analytics avancés (vues · clics · géo · device · heure de pointe)',
      'Calendly intégré — prise de RDV depuis la carte',
      'Notification temps réel nouveau lead',
      'Support prioritaire — réponse 48h',
      'Essai 14 jours sans CB',
    ],
    popular: true,
  },
];

export default function UpgradePage() {
  const router = useRouter();
  const [billing, setBilling] = useState<Billing>('monthly');
  const [selected, setSelected] = useState('pro');
  const [currPlan, setCurrPlan] = useState<'free' | 'starter' | 'pro' | 'business'>('free');
  const [showModal, setShowModal] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === selected)!;
  const amount = billing === 'yearly' ? selectedPlan.price.yearlyTotal : selectedPlan.price.monthly;

  useEffect(() => {
    // Reset selection when billing changes
   getProfile().then((p) => {
      if (p) {
        setCurrPlan(p.plan ?? 'free');
        if (p.plan === 'free') {
          setSelected('pro');
        } else if (p.plan === 'starter') {
          setSelected('pro');
        } else if (p.plan === 'pro') {
          setSelected('pro');
        } else if (p.plan === 'business') {
          setSelected('business');
        }

      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => router.push('/dashboard')} className="p-2 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Passer à un plan supérieur</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Plan actuel : <span className="text-zinc-300 font-medium">{currPlan}</span></p>
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
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">−2 mois offerts</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
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

              <div className="mb-1">
                <span className="text-3xl font-bold text-white">
                  {billing === 'yearly' ? plan.price.yearly.toFixed(2) : plan.price.monthly}€
                </span>
                <span className="text-zinc-500 text-sm">/mois</span>
              </div>
              {billing === 'yearly' && (
                <p className="text-xs text-zinc-600 mb-4">{plan.price.yearlyTotal}€ facturés annuellement</p>
              )}
              {billing === 'monthly' && <div className="mb-4" />}

              <div className="flex flex-col gap-1.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                    <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
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
              <span className="text-white font-semibold">
                {billing === 'yearly'
                  ? `${selectedPlan.price.yearly.toFixed(2)}€/mois`
                  : `${selectedPlan.price.monthly}€/mois`}
              </span>
            </div>
            {billing === 'yearly' && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Économie annuelle</span>
                <span className="text-emerald-400 font-semibold">
                  −{(selectedPlan.price.monthly * 12 - selectedPlan.price.yearlyTotal)}€/an
                </span>
              </div>
            )}
            <div className="h-px bg-zinc-800 my-1" />
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-medium">Total</span>
              <span className="text-xl font-bold text-white">
                {billing === 'yearly'
                  ? `${selectedPlan.price.yearlyTotal}€/an`
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
        planId={selectedPlan.id}
        amount={amount}
        billing={billing}
      />
    </div>
  );
}
