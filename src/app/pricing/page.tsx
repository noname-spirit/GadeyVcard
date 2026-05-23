'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

type Billing = 'monthly' | 'yearly';

interface PricingPlan {
  id: string;
  name: string;
  price: { monthly: number | null; yearly: number | null };
  description: string;
  features: string[];
  missing: string[];
  cta: string;
  highlight: boolean;
  comingSoon?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: 'Testez sans engagement, à vie',
    features: [
      '1 carte digitale en ligne à vie',
      'QR code partageable',
      '3 liens sociaux au choix',
      'URL publique vcard.app/votre-nom',
      'Mise à jour temps réel',
    ],
    missing: ['Stats & analytics', 'Export leads CSV', 'URL personnalisée', 'Templates Pro'],
    cta: 'Commencer gratuitement',
    highlight: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 5, yearly: 4 },
    description: 'L\'essentiel pour se lancer pro',
    features: [
      'Tout du plan Free, sans limite',
      'Liens sociaux illimités',
      'QR code HD téléchargeable (PNG/SVG)',
      '3 templates Freelance (Dark · Light · Color)',
      'Stats basiques (vues, clics, device)',
      '500 leads/mois + Export CSV',
      'Sans watermark — 100% à votre image',
      'Export .vcf (carnet de contacts)',
    ],
    missing: ['Calendly intégré', 'URL personnalisée', 'Template Influenceur'],
    cta: '14 jours offerts — sans CB',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 15, yearly: 12 },
    description: 'Pour les pros qui veulent convertir',
    features: [
      'Tout du plan Starter, boosté',
      'Tous les templates + Template Influenceur',
      'Couleur d\'accent personnalisée',
      'Calendly intégré — RDV en 1 clic',
      'Statut dispo en temps réel',
      'URL personnalisée (Vanity URL)',
      '2 000 leads/mois + Notifications instantanées',
      'Analytics avancés (géo · device · heure de pointe)',
      'Support NFC compatible',
      'Support prioritaire — réponse < 48h',
    ],
    missing: [],
    cta: '14 jours offerts — sans CB',
    highlight: true,
  },
  {
    id: 'micro-services',
    name: 'Micro services',
    price: { monthly: null, yearly: null },
    description: 'Photographe, coiffeur, resto, bien-être…',
    features: [
      'Tout du plan Pro inclus',
      'Galerie photos / portfolio pro',
      'Booking & prise de RDV directe',
      'Horaires + statut ouvert/fermé temps réel',
      'Avis clients intégrés',
      '5 000 leads/mois',
    ],
    missing: [],
    cta: 'Bientôt disponible',
    highlight: false,
    comingSoon: true,
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
      <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col items-center gap-10">

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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
              whileHover={!plan.comingSoon ? { y: -6, transition: { duration: 0.25 } } : undefined}
              className={[
                'relative flex flex-col rounded-2xl p-6 border transition-all duration-300',
                plan.comingSoon
                  ? 'bg-zinc-900/30 border-zinc-800/40 opacity-60 grayscale'
                  : plan.highlight
                  ? 'bg-linear-to-b from-zinc-900 to-zinc-900/80 border-orange-500/60 shadow-[0_0_60px_rgba(249,115,22,0.18)] hover:shadow-[0_0_80px_rgba(249,115,22,0.3)] scale-[1.02]'
                  : 'bg-zinc-900/60 border-zinc-800/60 hover:border-orange-500/30 hover:shadow-[0_0_40px_rgba(249,115,22,0.08)]',
              ].join(' ')}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-linear-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/40 px-4 py-1.5 rounded-full whitespace-nowrap">
                    <Zap size={11} className="fill-white" />
                    Recommandé
                  </span>
                </div>
              )}
              {plan.comingSoon && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700/60 px-3 py-1 rounded-full whitespace-nowrap">
                    Bientôt disponible
                  </span>
                </div>
              )}

              {/* Brand mark */}
              <div className="flex items-center justify-between mb-4">
                <Image
                  src="/logo/logo-horizontal-white.svg"
                  alt="vCard"
                  width={160}
                  height={42}
                  className={`h-10 w-auto ${plan.comingSoon ? 'opacity-50' : 'opacity-100'}`}
                />
                {plan.highlight && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-orange-400/80">Best</span>
                )}
              </div>

              <div className="flex flex-col gap-1 mb-6">
                <h3 className={`text-lg font-bold ${plan.comingSoon ? 'text-zinc-400' : 'text-white'}`}>{plan.name}</h3>
                <p className="text-xs text-zinc-500">{plan.description}</p>
              </div>

              <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-end gap-1">
                  {plan.comingSoon ? (
                    <span className="text-3xl font-bold text-zinc-500">Bientôt</span>
                  ) : (
                    <>
                      {billing === 'yearly' && plan.price.monthly !== null && plan.price.monthly > 0 && (
                        <span className="text-lg text-zinc-600 line-through mr-2 mb-1">{plan.price.monthly}€</span>
                      )}
                      <span className="text-4xl font-bold text-white">
                        {plan.price[billing] === 0 ? 'Gratuit' : `${plan.price[billing]}€`}
                      </span>
                      {plan.price[billing] !== null && plan.price[billing]! > 0 && (
                        <span className="text-zinc-500 text-sm mb-1">/mois</span>
                      )}
                    </>
                  )}
                </div>
                {billing === 'yearly' && !plan.comingSoon && plan.price.monthly !== null && plan.price.monthly > 0 && (
                  <span className={`text-xs font-semibold ${plan.highlight ? 'text-orange-400' : 'text-emerald-400'}`}>
                    Économie de {(plan.price.monthly - (plan.price.yearly ?? 0)) * 12}€/an · −20%
                  </span>
                )}
              </div>

              <Button
                variant={plan.highlight ? 'primary' : 'outline'}
                className="w-full mb-6"
                disabled={plan.comingSoon}
              >
                {plan.cta}
              </Button>

              <div className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <div key={f} className={`flex items-start gap-2 text-sm ${plan.comingSoon ? 'text-zinc-500' : 'text-zinc-300'}`}>
                    <Check size={14} className={`mt-0.5 shrink-0 ${plan.comingSoon ? 'text-zinc-600' : 'text-emerald-400'}`} />
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
