'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, Zap, ArrowRight, QrCode, BarChart3, Smartphone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

const FEATURES = [
  { icon: Smartphone, title: 'Carte digitale premium', desc: 'Flip card 3D, photo, liens, QR code. Design dark ou light selon votre style.' },
  { icon: QrCode, title: 'QR code dynamique', desc: 'Pointé sur votre carte. Change de contenu sans changer le QR. Export PNG inclus.' },
  { icon: BarChart3, title: 'Stats & leads', desc: 'Vues, clics, pays, OS. Formulaire de capture intégré. Export CSV.' },
  { icon: Globe, title: 'URL personnalisée', desc: 'vcard.app/votre-nom — ou votre propre domaine en plan Pro.' },
];

const PLANS = [
  { name: 'Free', price: 0, cta: 'Commencer', features: ['1 carte', 'QR code', 'Watermark'] },
  { name: 'Pro', price: 15, cta: 'Essai 14j gratuit', features: ['Stats complètes', 'Custom domain', 'Leads CSV', 'Sans watermark'], highlight: true },
  { name: 'Business', price: 30, cta: 'Essai 14j gratuit', features: ['5 cartes', 'Tout Pro', 'Support prioritaire'] },
];

const SECTORS = ['Freelance', 'Restaurant', 'Boutique', 'Médecin', 'Avocat', 'Influenceur', 'Agence', 'Hôtel'];

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/40">
        <button type="button" onClick={() => router.push('/')} className="flex items-center">
          <Image src="/logo/logo-horizontal-white.svg" alt="vCard" width={200} height={56} className="h-9 sm:h-14 w-auto" priority />
        </button>
        <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
          <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
          <button type="button" onClick={() => router.push('/demo')} className="hover:text-white transition-colors">Démo</button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>Connexion</Button>
          <Button size="sm" onClick={() => router.push('/register')}>Commencer</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center pt-20">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div {...fadeUp} className="flex flex-col items-center gap-6 max-w-3xl relative">
          <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full">
            Votre carte digitale en 2 minutes
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-linear-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            La carte de visite<br />qui travaille pour vous
          </h1>

          <p className="text-lg text-zinc-400 max-w-xl">
            Partagez vos coordonnées, captez des leads et analysez vos stats — depuis une URL unique. Zéro papier, 100% pro.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button size="lg" className="flex items-center gap-2" onClick={() => router.push('/register')}>
              Créer ma carte gratuitement
              <ArrowRight size={16} />
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push('/demo')}>
              Voir la démo
            </Button>
          </div>

          <p className="text-xs text-zinc-600">14 jours Pro gratuits · Sans CB · Annulation à tout moment</p>
        </motion.div>

        {/* Mock card preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative mt-16 w-full max-w-sm mx-auto"
        >
          <div className="bg-linear-to-br from-zinc-900 via-zinc-900/95 to-black rounded-3xl p-6 border border-zinc-800/60 shadow-2xl shadow-orange-500/5 flex flex-col items-center gap-4">
            <div className="absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-orange-400 via-orange-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/30">
              <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-2xl font-bold text-white">K</div>
            </div>
            <div className="text-center">
              <p className="font-bold text-white text-lg">Kevin Durand</p>
              <p className="text-orange-400/80 text-xs tracking-widest uppercase mt-0.5">Graphiste & Brand Designer</p>
            </div>
            <div className="flex gap-3">
              {['IG', 'YT', '🌐'].map((s) => (
                <div key={s} className="w-9 h-9 rounded-full bg-zinc-800/50 border border-zinc-700/30 flex items-center justify-center text-xs text-zinc-400">
                  {s}
                </div>
              ))}
            </div>
            <div className="w-full py-2 bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl text-sm font-semibold text-white text-center shadow-lg shadow-orange-500/25">
              Enregistrer Contact
            </div>
            <div className="absolute bottom-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />
          </div>
          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="hidden sm:block absolute -right-4 top-8 bg-zinc-900 border border-zinc-800/60 rounded-2xl px-3 py-2 text-xs shadow-xl"
          >
            <span className="text-emerald-400 font-semibold">+12</span>
            <span className="text-zinc-500 ml-1">leads ce mois</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="hidden sm:block absolute -left-4 bottom-12 bg-zinc-900 border border-zinc-800/60 rounded-2xl px-3 py-2 text-xs shadow-xl"
          >
            <span className="text-orange-400 font-semibold">1 284</span>
            <span className="text-zinc-500 ml-1">vues</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Sectors */}
      <section className="py-16 px-4 flex flex-col items-center gap-6">
        <motion.p {...fadeUp} className="text-sm text-zinc-500 uppercase tracking-widest">Pour tous les professionnels</motion.p>
        <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-2">
          {SECTORS.map((s) => (
            <span key={s} className="px-4 py-2 text-sm rounded-full bg-zinc-900 border border-zinc-800/60 text-zinc-400">
              {s}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-zinc-500 mt-3">Une carte. Des outils puissants. Zéro complexité.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 flex gap-4 hover:border-zinc-700/60 transition-colors"
            >
              <div className="p-2.5 bg-orange-500/10 rounded-xl shrink-0 h-fit">
                <f.icon size={18} className="text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-zinc-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 max-w-4xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Simple et transparent
          </h2>
          <p className="text-zinc-500 mt-3">Commencez gratuitement. Évoluez quand vous êtes prêt.</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={[
                'relative flex flex-col rounded-2xl p-6 border',
                plan.highlight
                  ? 'bg-zinc-900 border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.1)]'
                  : 'bg-zinc-900/60 border-zinc-800/60',
              ].join(' ')}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 text-xs font-semibold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-3 py-1 rounded-full whitespace-nowrap">
                    <Zap size={10} />
                    Populaire
                  </span>
                </div>
              )}
              <h3 className="font-bold text-white text-lg mb-1">{plan.name}</h3>
              <div className="mb-5">
                <span className="text-3xl font-bold text-white">{plan.price === 0 ? 'Gratuit' : `${plan.price}€`}</span>
                {plan.price > 0 && <span className="text-zinc-500 text-sm">/mois</span>}
              </div>
              <div className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={13} className="text-emerald-400 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <Button variant={plan.highlight ? 'primary' : 'outline'} className="w-full" onClick={() => router.push('/register')}>
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp} className="text-center text-zinc-600 text-sm mt-8">
          Besoin de plus ? <a href="mailto:hello@vcard.app" className="text-orange-500 hover:text-orange-400 transition-colors">Contactez-nous</a> pour un plan Agency.
        </motion.p>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 flex flex-col items-center gap-6 text-center">
        <motion.div {...fadeUp} className="flex flex-col items-center gap-4 max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Prêt à passer au digital ?
          </h2>
          <p className="text-zinc-500">Rejoignez les professionnels qui ont déjà remplacé leur carte papier.</p>
          <Button size="lg" className="flex items-center gap-2" onClick={() => router.push('/register')}>
            Créer ma carte gratuitement
            <ArrowRight size={16} />
          </Button>
          <p className="text-xs text-zinc-600">Aucune CB requise · 14 jours Pro offerts</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-10 px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-600">
        <Image src="/logo/logo-horizontal-white.svg" alt="vCard" width={280} height={80} className="h-10 sm:h-16 w-auto opacity-80" />
        <div className="flex gap-4">
          <button type="button" onClick={() => router.push('/pricing')} className="hover:text-zinc-400 transition-colors">Tarifs</button>
          <button type="button" onClick={() => router.push('/privacy')} className="hover:text-zinc-400 transition-colors">Confidentialité</button>
          <button type="button" onClick={() => router.push('/terms')} className="hover:text-zinc-400 transition-colors">CGU</button>
        </div>
        <span>© 2026</span>
      </footer>

    </div>
  );
}
