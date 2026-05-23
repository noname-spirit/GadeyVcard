'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check, Zap, ArrowRight, QrCode, BarChart3, Smartphone, Globe, Sparkles, Share2, TrendingUp, Plus, Minus, X, FileX, EyeOff, Recycle, Eye, Bell, Instagram, Youtube, Linkedin, Phone, Mail, MessageCircle, Music2, Download } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { AmbientBackground } from '@/components/AmbientBackground';
import Image from 'next/image';

type Billing = 'monthly' | 'yearly';

const FEATURES = [
  { icon: Smartphone, title: 'Une carte qui ne se perd jamais', desc: 'Plus de papier oublié au fond du portefeuille. Votre carte vit en ligne et se met à jour en 1 clic.' },
  { icon: QrCode, title: 'QR code intelligent', desc: 'Un seul QR pour la vie. Changez vos liens, votre photo, vos infos — le QR reste valable. Imprimez-le sur tout.' },
  { icon: BarChart3, title: 'Chaque rencontre devient un lead', desc: 'Formulaire intégré, notifications instantanées, export CSV. Vous savez qui vous a vu et qui vous a contacté.' },
  { icon: Globe, title: 'Votre marque, votre URL', desc: 'vcard.app/votre-nom. Partagez en SMS, mail, signature. URL custom dispo en Pro.' },
];

const STEPS = [
  { icon: Sparkles, title: 'Créez en 2 minutes', desc: 'Choisissez un template, ajoutez votre photo et vos liens. Pas de design à faire — tout est déjà beau.' },
  { icon: Share2, title: 'Partagez partout', desc: 'QR code, URL, NFC, signature mail. Vos contacts l\'ajoutent direct au répertoire en 1 tap.' },
  { icon: TrendingUp, title: 'Captez vos leads', desc: 'Formulaire intégré, stats temps réel, notifications. Transformez chaque vue en opportunité.' },
];

const FAQ = [
  {
    q: 'Faut-il un abonnement pour démarrer ?',
    a: 'Non. Le plan Free est gratuit à vie, sans carte bancaire. Vous montez en Starter ou Pro uniquement quand vous en avez besoin.',
  },
  {
    q: 'Comment ça marche concrètement ?',
    a: 'Vous créez votre compte, vous personnalisez votre carte (photo, liens, couleur), vous récupérez votre URL et votre QR code. Vous pouvez l\'imprimer, l\'envoyer par SMS ou la mettre dans votre signature mail.',
  },
  {
    q: 'Je peux annuler quand je veux ?',
    a: 'Oui, sans engagement. Annulation en 1 clic depuis votre dashboard. Vous gardez l\'accès jusqu\'à la fin de la période payée.',
  },
  {
    q: 'Est-ce compatible NFC ?',
    a: 'Oui. Le plan Pro est compatible avec les cartes NFC physiques (Tap to share). Vous pouvez commander des supports NFC programmés avec votre URL.',
  },
  {
    q: 'Qu\'est-ce qui se passe avec mes leads ?',
    a: 'Ils sont stockés dans votre dashboard, exportables en CSV. RGPD-compliant, hébergement européen. Vous restez propriétaire de vos données.',
  },
  {
    q: 'Je peux changer de template plus tard ?',
    a: 'Oui, à tout moment. Vos infos sont conservées, seul le design change. Vous pouvez tester tous les templates inclus dans votre plan.',
  },
];

interface Plan {
  name: string;
  price: { monthly: number | null; yearly: number | null };
  cta: string;
  template: string;
  features: string[];
  highlight?: boolean;
  comingSoon?: boolean;
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    cta: 'Créer ma carte',
    template: 'Freelance — Dark / Light / Color',
    features: [
      '1 carte digitale en ligne à vie',
      'QR code partageable instantanément',
      '3 liens sociaux au choix',
      'URL publique vcard.app/votre-nom',
    ],
  },
  {
    name: 'Starter',
    price: { monthly: 9, yearly: 7 },
    cta: '14 jours offerts — sans CB',
    template: 'Freelance — Dark / Light / Color',
    features: [
      'Tout du plan Free, sans limite',
      'Liens sociaux illimités',
      'QR code HD téléchargeable (PNG/SVG)',
      '500 leads/mois + Export CSV',
      'Stats basiques (vues, clics, device)',
      'Sans watermark — 100% à votre image',
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 22, yearly: 17 },
    cta: '14 jours offerts — sans CB',
    template: 'Tous templates + Influenceur',
    highlight: true,
    features: [
      'Tout du plan Starter, boosté',
      'Template Influenceur + couleur accent perso',
      'Calendly intégré — RDV en 1 clic',
      'Statut dispo en temps réel',
      '2 000 leads/mois + Notifications instantanées',
      'Analytics avancés (géo · device · heures de pointe)',
      'Support prioritaire — réponse < 48h',
    ],
  },
  {
    name: 'Micro services',
    price: { monthly: null, yearly: null },
    cta: 'Bientôt disponible',
    template: 'Photographe · Coiffeur · Resto · Bien-être',
    comingSoon: true,
    features: [
      'Tout du plan Pro inclus',
      'Galerie photos / portfolio pro',
      'Booking & prise de RDV directe',
      'Horaires + statut ouvert/fermé',
      '5 000 leads/mois',
    ],
  },
];

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

type MockVariant = 'freelance-dark' | 'influencer' | 'freelance-light';

interface Persona {
  variant: MockVariant;
  template: string;
  name: string;
  avatarText: string;
  accent: {
    color: string;
    text: string;
    bg: string;
    badge: string;
  };
  // Freelance fields
  role?: string;
  socials?: { icon: React.ElementType; label: string }[];
  actions?: { icon: React.ElementType; label: string; color: string }[];
  // Influencer fields
  handle?: string;
  niche?: string;
  stats?: { value: string; label: string }[];
}

const PERSONAS: Persona[] = [
  {
    variant: 'freelance-dark',
    template: 'Freelance Dark',
    name: 'Kevin Durand',
    avatarText: 'K',
    role: 'Graphiste & Brand Designer',
    socials: [
      { icon: Instagram, label: 'Instagram' },
      { icon: Youtube, label: 'YouTube' },
      { icon: Globe, label: 'Site' },
    ],
    actions: [
      { icon: Phone, label: 'Tél', color: 'emerald' },
      { icon: Mail, label: 'Mail', color: 'blue' },
      { icon: MessageCircle, label: 'WA', color: 'green' },
    ],
    accent: {
      color: '#f97316',
      text: 'text-orange-400',
      bg: 'from-orange-500 to-orange-600',
      badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    },
  },
  {
    variant: 'influencer',
    template: 'Influenceur',
    name: 'Léa Martin',
    avatarText: 'L',
    handle: '@lea.lifestyle',
    niche: 'Lifestyle · Food · Travel',
    stats: [
      { value: '128K', label: 'Abonnés' },
      { value: '4.2%', label: 'Engagement' },
      { value: '50+', label: 'Collabs' },
    ],
    socials: [
      { icon: Instagram, label: 'Instagram' },
      { icon: Music2, label: 'TikTok' },
      { icon: Youtube, label: 'YouTube' },
    ],
    accent: {
      color: '#ec4899',
      text: 'text-pink-400',
      bg: 'from-pink-500 to-fuchsia-600',
      badge: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    },
  },
  {
    variant: 'freelance-light',
    template: 'Freelance Light',
    name: 'Thomas Dubois',
    avatarText: 'T',
    role: 'Coach Business',
    socials: [
      { icon: Linkedin, label: 'LinkedIn' },
      { icon: Globe, label: 'Site' },
    ],
    actions: [
      { icon: Phone, label: 'Tél', color: 'emerald' },
      { icon: Mail, label: 'Mail', color: 'blue' },
    ],
    accent: {
      color: '#10b981',
      text: 'text-emerald-600',
      bg: 'from-emerald-500 to-teal-600',
      badge: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/30',
    },
  },
];

const COUNTERS = [
  { value: 2, suffix: ' min', label: 'Pour créer votre carte' },
  { value: 1, suffix: '', label: 'QR code à vie' },
  { value: 100, suffix: '%', label: 'Mobile, NFC & web' },
  { value: 0, suffix: '€', label: 'Pour démarrer' },
];

function MockCard({ persona }: { persona: Persona }) {
  const isLight = persona.variant === 'freelance-light';

  if (persona.variant === 'influencer') {
    return (
      <div className="w-full bg-linear-to-br from-zinc-900 via-zinc-900/95 to-black rounded-3xl border border-zinc-800/60 shadow-2xl overflow-hidden flex flex-col" style={{ ['--accent' as string]: persona.accent.color }}>
        {/* Cover gradient */}
        <div
          className="relative w-full h-20 sm:h-24 shrink-0"
          style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${persona.accent.color} 80%, white 20%), color-mix(in srgb, ${persona.accent.color} 50%, black))` }}
        />
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col gap-3">
          {/* Photo + name */}
          <div className="flex items-end gap-3 -mt-8 relative z-10">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 shrink-0 shadow-xl bg-zinc-950/80`}>
              <div className={`w-full h-full rounded-[14px] bg-linear-to-br ${persona.accent.bg} flex items-center justify-center text-xl sm:text-2xl font-bold text-white`}>
                {persona.avatarText}
              </div>
            </div>
            <div className="pb-0.5 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight truncate">{persona.name}</h3>
              <p className="text-[11px] sm:text-xs font-medium text-zinc-500 truncate">{persona.handle}</p>
            </div>
          </div>

          {/* Niche */}
          <p className="text-[11px] sm:text-xs text-zinc-400">{persona.niche}</p>

          {/* Stats */}
          {persona.stats && (
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {persona.stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center py-2 px-1 rounded-xl border bg-zinc-800/60 border-zinc-700/40">
                  <span className="text-xs sm:text-sm font-bold text-white">{s.value}</span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Social icons */}
          {persona.socials && (
            <div className="flex gap-1.5">
              {persona.socials.map((s) => (
                <div key={s.label} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl border bg-zinc-800/50 border-zinc-700/30 text-zinc-300">
                  <s.icon size={12} />
                  <span className="text-[10px] sm:text-[11px] font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div
            className="w-full py-2 rounded-xl text-xs font-semibold text-white text-center flex items-center justify-center gap-1.5 shadow-lg"
            style={{
              background: `linear-gradient(to right, ${persona.accent.color}, color-mix(in srgb, ${persona.accent.color} 80%, black))`,
              boxShadow: `0 4px 20px color-mix(in srgb, ${persona.accent.color} 25%, transparent)`,
            }}
          >
            <Download size={12} />
            Enregistrer Contact
          </div>
        </div>
      </div>
    );
  }

  // Freelance Dark / Light
  const cardBg = isLight ? 'from-white via-zinc-50 to-zinc-100 border-zinc-200/80' : 'from-zinc-900 via-zinc-900/95 to-black border-zinc-800/60';
  const textColor = isLight ? 'text-zinc-900' : 'text-white';
  const socialBg = isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-500' : 'bg-zinc-800/50 border-zinc-700/30 text-zinc-300';
  const actionBg = isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-zinc-800/50 border-zinc-700/30 text-zinc-300';
  const lineColor = isLight ? '#d4d4d8' : persona.accent.color;

  return (
    <div className={`w-full bg-linear-to-br ${cardBg} rounded-3xl px-4 py-6 sm:px-5 sm:py-7 border shadow-2xl flex flex-col items-center gap-4 sm:gap-5 relative`} style={{ ['--accent' as string]: persona.accent.color }}>
      {/* Logo icon discret top-right */}
      <Image
        src={isLight ? '/logo/logo-icon-black.svg' : '/logo/logo-icon-white.svg'}
        alt="vCard"
        width={64}
        height={64}
        className="absolute top-3 right-3 w-12 h-12 sm:w-14 sm:h-14 opacity-40"
      />

      {/* Top line */}
      <div
        className="absolute top-0 left-12 right-12 h-px"
        style={{ background: `linear-gradient(to right, transparent, color-mix(in srgb, ${lineColor} 30%, transparent), transparent)` }}
      />

      {/* Photo avec ring accent */}
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 relative"
        style={{
          background: `linear-gradient(to bottom right, color-mix(in srgb, ${persona.accent.color} 70%, white), ${persona.accent.color}, color-mix(in srgb, ${persona.accent.color} 70%, black))`,
          boxShadow: `0 10px 30px color-mix(in srgb, ${persona.accent.color} 30%, transparent)`,
        }}
      >
        <div className={`w-full h-full rounded-full ${isLight ? 'bg-zinc-200' : 'bg-zinc-800'} flex items-center justify-center text-2xl sm:text-3xl font-bold ${textColor}`}>
          {persona.avatarText}
        </div>
      </div>

      {/* Name + role */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className={`text-lg sm:text-xl font-bold ${textColor} tracking-tight`}>{persona.name}</h3>
        <p className="font-medium text-[10px] sm:text-xs tracking-widest uppercase" style={{ color: `color-mix(in srgb, ${persona.accent.color} 80%, transparent)` }}>
          {persona.role}
        </p>
      </div>

      {/* Socials */}
      {persona.socials && (
        <div className="flex justify-center gap-2 sm:gap-3">
          {persona.socials.map((s) => (
            <div key={s.label} className={`p-1.5 rounded-full ${socialBg} border`}>
              <s.icon size={16} />
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {persona.actions && (
        <div className="flex gap-1.5 sm:gap-2 w-full">
          {persona.actions.map((a) => (
            <div key={a.label} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl ${actionBg} border text-[10px] sm:text-xs font-medium`}>
              <a.icon size={12} />
              {a.label}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div
        className="w-full py-2 sm:py-2.5 rounded-2xl font-semibold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-lg"
        style={{
          background: `linear-gradient(to right, ${persona.accent.color}, color-mix(in srgb, ${persona.accent.color} 80%, black))`,
          boxShadow: `0 10px 30px color-mix(in srgb, ${persona.accent.color} 25%, transparent)`,
        }}
      >
        <Download size={14} />
        Enregistrer Contact
      </div>

      {/* Bottom line */}
      <div
        className="absolute bottom-0 left-12 right-12 h-px"
        style={{ background: `linear-gradient(to right, transparent, color-mix(in srgb, ${lineColor} 30%, transparent), transparent)` }}
      />
    </div>
  );
}

function CountUp({ to, suffix = '', duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  return (
    <motion.span
      onViewportEnter={() => {
        if (started) return;
        setStarted(true);
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(to * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }}
      viewport={{ once: true }}
    >
      {value.toLocaleString('fr-FR')}{suffix}
    </motion.span>
  );
}

function FaqItem({ q, a, delay = 0 }: { q: string; a: string; delay?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-zinc-900/80 transition-colors"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        {open ? <Minus size={16} className="text-orange-400 shrink-0" /> : <Plus size={16} className="text-zinc-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">
          {a}
        </div>
      )}
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<Billing>('monthly');
  const [personaIndex, setPersonaIndex] = useState(0);
  const [slug, setSlug] = useState('');

  useEffect(() => {
    const id = setInterval(() => setPersonaIndex((i) => (i + 1) % PERSONAS.length), 3800);
    return () => clearInterval(id);
  }, []);

  const persona = PERSONAS[personaIndex];

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    router.push(cleaned ? `/register?slug=${cleaned}` : '/register');
  };

  return (
    <div className="relative isolate min-h-screen text-white overflow-x-hidden">
      <AmbientBackground accent="#f97316" />

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
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 text-center pt-28 sm:pt-36 pb-12">
        {/* Glow animé */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"
        />

        <motion.div {...fadeUp} className="flex flex-col items-center gap-6 max-w-5xl relative">
          <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full">
            Carte digitale + capture de leads
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-linear-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            <span className="block">Transformez chaque rencontre</span>
            <span className="block">en opportunité business</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-xl">
            Votre carte digitale qui partage vos coordonnées, capte les leads automatiquement, et vous dit qui vous a vu. En 2 minutes, sans carte bancaire.
          </p>

          {/* URL reservation form */}
          <form
            onSubmit={handleReserve}
            className="w-full max-w-md flex flex-col sm:flex-row items-stretch gap-2 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-1.5 backdrop-blur-md focus-within:border-orange-500/50 transition-colors"
          >
            <div className="flex items-center flex-1 gap-1 px-3 py-2 sm:py-1">
              <span className="text-zinc-500 text-sm shrink-0 select-none">vcard.app/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="votre-nom"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-zinc-600 focus:outline-none min-w-0"
                autoComplete="off"
              />
            </div>
            <Button type="submit" size="md" className="flex items-center justify-center gap-1.5 shrink-0">
              Réserver
              <ArrowRight size={14} />
            </Button>
          </form>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button size="lg" className="flex items-center gap-2" onClick={() => router.push('/register')}>
              Créer ma carte gratuitement
              <ArrowRight size={16} />
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push('/demo')}>
              Voir la démo
            </Button>
          </div>

          <p className="text-xs text-zinc-600 px-2">14 jours Pro offerts · Sans CB · Annulation en 1 clic</p>
        </motion.div>

        {/* Mock card preview — cycling personas */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="relative mt-12 sm:mt-16 w-full max-w-xs sm:max-w-sm mx-auto"
          style={{ perspective: '1000px' }}
        >
          {/* Template indicator */}
          <div className="flex justify-center mb-3 h-6">
            <AnimatePresence mode="wait">
              <motion.span
                key={persona.template}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.3 }}
                className={`text-[10px] font-semibold tracking-widest uppercase ${persona.accent.text} bg-zinc-900/80 border border-zinc-800/60 px-3 py-1 rounded-full`}
              >
                Template · {persona.template}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={personaIndex}
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -16 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                <MockCard persona={persona} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-1.5 mt-4">
            {PERSONAS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPersonaIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === personaIndex ? 'w-6 bg-orange-500' : 'w-1.5 bg-zinc-700'
                }`}
                aria-label={`Voir persona ${i + 1}`}
              />
            ))}
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="hidden sm:block absolute -right-4 top-8 bg-zinc-900 border border-zinc-800/60 rounded-2xl px-3 py-2 text-xs shadow-xl"
          >
            <Bell size={11} className="text-emerald-400" />
            <span className="text-emerald-400 font-semibold">+12</span>
            <span className="text-zinc-500">leads</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="hidden sm:block absolute -left-4 bottom-12 bg-zinc-900 border border-zinc-800/60 rounded-2xl px-3 py-2 text-xs shadow-xl"
          >
            <Eye size={11} className="text-orange-400" />
            <span className="text-orange-400 font-semibold">1 284</span>
            <span className="text-zinc-500">vues</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Compteurs animés */}
      <section className="py-10 sm:py-12 px-4 border-y border-zinc-800/40 bg-zinc-900/20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {COUNTERS.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center flex flex-col items-center gap-1"
            >
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                <CountUp to={c.value} suffix={c.suffix} />
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-500 uppercase tracking-wider text-balance">{c.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Avant / Après */}
      <section className="py-12 sm:py-16 px-4 max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-8 sm:mb-10">
          <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase">La différence</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Carte papier vs vCard
          </h2>
          <p className="text-zinc-500 mt-3 text-sm sm:text-base px-2">Ce que vous perdez avec une carte classique. Ce que vous gagnez avec vCard.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Carte papier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 sm:p-6 grayscale opacity-80 hover:opacity-100 transition-opacity"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase bg-zinc-800/60 px-2.5 py-1 rounded-full">Avant</span>
              <span className="text-sm sm:text-base font-semibold text-zinc-400">Carte papier</span>
            </div>
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {[
                { icon: FileX, text: 'Oubliée au fond du portefeuille' },
                { icon: EyeOff, text: 'Aucune stat — vous ne savez pas qui vous a contacté' },
                { icon: Recycle, text: 'Périmée à chaque changement de tel, mail, job' },
                { icon: X, text: '50 à 200€ de réimpression à chaque update' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 text-sm text-zinc-500">
                  <Icon size={15} className="text-zinc-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* vCard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-linear-to-br from-zinc-900 to-zinc-900/60 border border-orange-500/40 rounded-2xl p-5 sm:p-6 shadow-[0_0_40px_rgba(249,115,22,0.1)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold tracking-widest text-orange-400 uppercase bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">Après</span>
              <span className="text-sm sm:text-base font-semibold text-white">vCard digitale</span>
            </div>
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {[
                'Toujours dans le téléphone — vous ne perdez plus jamais un contact',
                'Stats temps réel : qui vous a vu, cliqué, contacté',
                'Mise à jour 1 clic — votre QR reste valable à vie',
                '0€ de réimpression. Modifications illimitées.',
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 text-sm text-zinc-200">
                  <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Templates disponibles */}
      <section className="py-10 px-4 flex flex-col items-center gap-5">
        <motion.p {...fadeUp} className="text-sm text-zinc-500 uppercase tracking-widest">Templates disponibles</motion.p>
        <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-2">
          {[
            { label: 'Freelance Dark', color: 'text-orange-400 border-orange-500/20 bg-orange-500/5' },
            { label: 'Freelance Light', color: 'text-zinc-300 border-zinc-700/60 bg-zinc-800/40' },
            { label: 'Freelance Color', color: 'text-pink-400 border-pink-500/20 bg-pink-500/5' },
            { label: 'Micro services — Bientôt', color: 'text-zinc-500 border-zinc-700/40 bg-zinc-800/20 opacity-60', comingSoon: true },
            { label: 'Influenceur', color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
          ].map((t) => (
            <span key={t.label} className={`px-4 py-2 text-sm rounded-full border ${t.color}`}>
              {t.label}
            </span>
          ))}
        </motion.div>
        <button type="button" onClick={() => router.push('/templates')} className="text-xs text-zinc-500 hover:text-orange-400 transition-colors">
          Voir les aperçus →
        </button>
      </section>

      {/* Comment ça marche */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-8">
          <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase">En 3 étapes</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Comment ça marche
          </h2>
          <p className="text-zinc-500 mt-3">De zéro à votre première carte partagée en moins de 5 minutes.</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 relative">
          {/* Ligne connectrice desktop */}
          <div className="hidden sm:block absolute top-7 left-[16%] right-[16%] h-px bg-linear-to-r from-transparent via-orange-500/30 to-transparent pointer-events-none" />

          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative flex flex-col items-center text-center gap-3 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 hover:border-orange-500/30 transition-colors duration-300"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center">
                  <s.icon size={22} className="text-orange-400" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-orange-500/40">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-white">{s.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 px-4 max-w-5xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-8">
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
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 flex gap-4 hover:border-orange-500/30 hover:bg-zinc-900/80 transition-all duration-300"
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
      <section id="pricing" className="py-12 px-4 max-w-6xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-6 flex flex-col items-center gap-3">
          <Image src="/logo/logo-vertical-white.svg" alt="vCard" width={140} height={140} className="h-24 w-auto opacity-100" />
          <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase">Tarifs vCard</span>
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Simple et transparent
          </h2>
          <p className="text-zinc-500">Commencez gratuitement. Évoluez quand vous êtes prêt.</p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div {...fadeUp} className="flex justify-center mb-6">
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800/60 rounded-2xl p-1">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                billing === 'monthly' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBilling('yearly')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                billing === 'yearly' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Annuel
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                −20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
              whileHover={!plan.comingSoon ? { y: -6, transition: { duration: 0.25 } } : undefined}
              className={[
                'relative flex flex-col rounded-2xl p-6 border transition-shadow duration-300',
                plan.comingSoon
                  ? 'bg-zinc-900/30 border-zinc-800/40 opacity-60 grayscale'
                  : plan.highlight
                  ? 'bg-linear-to-b from-zinc-900 to-zinc-900/80 border-orange-500/60 shadow-[0_0_60px_rgba(249,115,22,0.18)] hover:shadow-[0_0_80px_rgba(249,115,22,0.3)] sm:scale-[1.03]'
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
                <Image src="/logo/logo-horizontal-white.svg" alt="vCard" width={150} height={40} className={`h-9 w-auto ${plan.comingSoon ? 'opacity-50' : 'opacity-100'}`} />
                {plan.highlight && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Best</span>
                )}
              </div>

              <h3 className={`font-bold text-xl mb-1 ${plan.comingSoon ? 'text-zinc-400' : 'text-white'}`}>{plan.name}</h3>
              <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-3">{plan.template}</p>
              <div className="mb-5 flex flex-col gap-1">
                {plan.comingSoon ? (
                  <span className="text-2xl font-bold text-zinc-500">Bientôt</span>
                ) : (
                  <>
                    <div className="flex items-end gap-1">
                      {billing === 'yearly' && plan.price.monthly !== null && plan.price.monthly > 0 && (
                        <span className="text-base text-zinc-600 line-through mr-2 mb-0.5">{plan.price.monthly}€</span>
                      )}
                      <span className="text-3xl font-bold text-white">
                        {plan.price[billing] === 0 ? 'Gratuit' : `${plan.price[billing]}€`}
                      </span>
                      {plan.price[billing] !== null && plan.price[billing]! > 0 && (
                        <span className="text-zinc-500 text-sm mb-0.5">/mois</span>
                      )}
                    </div>
                    {billing === 'yearly' && plan.price.monthly !== null && plan.price.monthly > 0 && (
                      <span className={`text-[11px] font-semibold ${plan.highlight ? 'text-orange-400' : 'text-emerald-400'}`}>
                        Économie {(plan.price.monthly - (plan.price.yearly ?? 0)) * 12}€/an
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <div key={f} className={`flex items-center gap-2 text-sm ${plan.comingSoon ? 'text-zinc-500' : 'text-zinc-300'}`}>
                    <Check size={13} className={`shrink-0 ${plan.comingSoon ? 'text-zinc-600' : 'text-emerald-400'}`} />
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
          Chaque plan inclut son template dédié. Autre métier (Artiste, Immo, Photo…) ? <a href="mailto:hello@vcard.app" className="text-orange-500 hover:text-orange-400 transition-colors">Contactez-nous</a>.
        </motion.p>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 max-w-3xl mx-auto">
        <motion.div {...fadeUp} className="text-center mb-6">
          <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            On répond à tout
          </h2>
          <p className="text-zinc-500 mt-3">Pas le temps de chercher ? Les questions qu&apos;on nous pose le plus.</p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {FAQ.map((item, i) => (
            <FaqItem key={item.q} q={item.q} a={item.a} delay={i * 0.05} />
          ))}
        </div>

        <motion.p {...fadeUp} className="text-center text-zinc-600 text-sm mt-10">
          Une autre question ? <a href="mailto:hello@vcard.app" className="text-orange-500 hover:text-orange-400 transition-colors">Écrivez-nous</a> — on répond sous 48h.
        </motion.p>
      </section>

      {/* CTA final */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div {...fadeUp} className="relative flex flex-col items-center gap-6 max-w-2xl mx-auto text-center">
          <Image src="/logo/logo-vertical-white.svg" alt="vCard" width={180} height={180} className="h-28 w-auto mb-2 opacity-100" />

          <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Votre première carte<br />en 2 minutes chrono
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
