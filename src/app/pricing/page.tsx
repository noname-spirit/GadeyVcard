'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

type Billing = 'monthly' | 'yearly';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Pour tester sans engagement',
    features: [
      '1 carte digitale',
      'Template de base',
      'QR code',
      'Watermark vCard SaaS',
    ],
    missing: ['Stats & analytics', 'Agenda intégré', 'Custom domain', 'Export leads CSV'],
    cta: 'Commencer gratuitement',
    highlight: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 5, yearly: 4 },
    description: 'L\'essentiel pour se lancer',
    features: [
      '1 carte digitale',
      'QR code + export',
      'Stats basiques',
      '3 templates',
      'Sans watermark',
    ],
    missing: ['Agenda intégré', 'Custom domain', 'Export leads CSV'],
    cta: 'Essai gratuit 14j',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 15, yearly: 12 },
    description: 'Pour les pros qui veulent tout',
    features: [
      '1 carte digitale',
      'Toutes les stats & analytics',
      'Agenda Google Calendar',
      'Custom domain',
      'Tous les templates',
      'Leads dashboard + CSV',
      'Support NFC',
    ],
    missing: [],
    cta: 'Essai gratuit 14j',
    highlight: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: { monthly: 30, yearly: 24 },
    description: 'Pour les équipes et agences',
    features: [
      '5 cartes digitales',
      'Tout le plan Pro',
      'Export CSV avancé',
      'Support prioritaire',
      'Statistiques comparatives',
    ],
    missing: [],
    cta: 'Essai gratuit 14j',
    highlight: false,
  },
];

const EVENT_PLAN = {
  name: 'Event',
  price: 29,
  description: 'Carte active 30 jours — parfait pour les salons et événements',
  features: ['1 carte 30 jours', 'QR code + stats', 'Leads dashboard', 'Pas d\'abonnement'],
};

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('monthly');

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center gap-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col items-center gap-4"
        >
          <Image
            src="/logo/logo-vertical-white.svg"
            alt="vCard"
            width={200}
            height={200}
            className="h-20 sm:h-32 w-auto mb-2"
            priority
          />
          <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full">
            Tarifs simples
          </span>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
            Choisissez votre plan
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl">
            Commencez gratuitement. Passez Pro quand vous êtes prêt. Annulez à tout moment.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800/60 rounded-2xl p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={[
              'px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              billing === 'monthly' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200',
            ].join(' ')}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={[
              'px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2',
              billing === 'yearly' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200',
            ].join(' ')}
          >
            Annuel
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              −20%
            </span>
          </button>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={[
                'relative flex flex-col rounded-2xl p-6 border transition-all duration-300',
                plan.highlight
                  ? 'bg-zinc-900 border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.12)]'
                  : 'bg-zinc-900/60 border-zinc-800/60 hover:border-zinc-700/60',
              ].join(' ')}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 text-xs font-semibold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-3 py-1 rounded-full">
                    <Zap size={10} />
                    Populaire
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-1 mb-6">
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-zinc-500">{plan.description}</p>
              </div>

              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price[billing] === 0 ? 'Gratuit' : `${plan.price[billing]}€`}
                </span>
                {plan.price[billing] > 0 && (
                  <span className="text-zinc-500 text-sm mb-1">/mois</span>
                )}
              </div>

              <Button
                variant={plan.highlight ? 'primary' : 'outline'}
                className="w-full mb-6"
              >
                {plan.cta}
              </Button>

              <div className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    {f}
                  </div>
                ))}
                {plan.missing.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-zinc-600 line-through">
                    <div className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Event plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{EVENT_PLAN.name}</h3>
              <span className="text-xs font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700/40 px-2 py-0.5 rounded-full">
                Ponctuel
              </span>
            </div>
            <p className="text-zinc-400 text-sm">{EVENT_PLAN.description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
              {EVENT_PLAN.features.map((f) => (
                <div key={f} className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Check size={12} className="text-emerald-400" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-right">
              <span className="text-3xl font-bold text-white">{EVENT_PLAN.price}€</span>
              <span className="text-zinc-500 text-sm block">30 jours</span>
            </div>
            <Button variant="outline">Choisir Event</Button>
          </div>
        </motion.div>

        {/* Agency note */}
        <p className="text-zinc-600 text-sm text-center">
          Vous êtes une agence ?{' '}
          <a href="mailto:hello@vcard.app" className="text-orange-500 hover:text-orange-400 transition-colors">
            Contactez-nous
          </a>{' '}
          pour un plan Agency sur mesure avec white-label.
        </p>

      </div>
    </div>
  );
}
