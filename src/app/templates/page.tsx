'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { VCard, CardFooter } from '@/components/card';
import { CardFrontRestaurant } from '@/components/card/CardFrontRestaurant';
import { CardFrontInfluencer } from '@/components/card/CardFrontInfluencer';
import { LeadCaptureForm } from '@/components/card/LeadCaptureForm';
import { LeadCaptureFormInfluencer } from '@/components/card/LeadCaptureFormInfluencer';
import { AmbientBackground } from '@/components/AmbientBackground';
import type { CardData } from '@/types/card';
import type { RestaurantCardData } from '@/components/card/CardFrontRestaurant';
import type { InfluencerCardData } from '@/components/card/CardFrontInfluencer';

// ─── Mock data ────────────────────────────────────────────────────────────────

const FREELANCE_DARK: CardData = {
  id: 'freelance-dark',
  slug: 'alex-bernard',
  name: 'Alex Bernard',
  title: 'Designer UI/UX · Direction Artistique',
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  socials: {
    instagram: 'https://instagram.com/alex.designs',
    linkedin: 'https://linkedin.com/in/alexbernard',
    website: 'https://alexbernard.studio',
  },
  contact: {
    phone: '+33 6 12 34 56 78',
    email: 'hello@alexbernard.studio',
    whatsapp: '+33612345678',
  },
  accentColor: '#f97316',
  template: 'dark',
  plan: 'pro',
  availabilityStatus: 'available',
  updatedAt: new Date().toISOString(),
};

const FREELANCE_LIGHT: CardData = {
  id: 'freelance-light',
  slug: 'sophie-laurent',
  name: 'Sophie Laurent',
  title: "Architecte d'intérieur · Maison & Bureaux",
  photo: 'https://randomuser.me/api/portraits/women/44.jpg',
  socials: {
    instagram: 'https://instagram.com/sophie.interieurs',
    linkedin: 'https://linkedin.com/in/sophielaurent',
    website: 'https://sophielaurent.fr',
  },
  contact: {
    phone: '+33 6 45 67 89 10',
    email: 'contact@sophielaurent.fr',
    whatsapp: '+33645678910',
  },
  accentColor: '#6366f1',
  template: 'light',
  plan: 'pro',
  availabilityStatus: 'available',
  updatedAt: new Date().toISOString(),
};

const FREELANCE_COLOR: CardData = {
  id: 'freelance-color',
  slug: 'marc-coaching',
  name: 'Marc Dubois',
  title: 'Coach Business · Entrepreneurs ambitieux',
  photo: 'https://randomuser.me/api/portraits/men/64.jpg',
  socials: {
    instagram: 'https://instagram.com/marc.coaching',
    linkedin: 'https://linkedin.com/in/marcdubois',
    website: 'https://marcdubois.coach',
  },
  contact: {
    phone: '+33 6 78 90 12 34',
    email: 'marc@marcdubois.coach',
    whatsapp: '+33678901234',
  },
  accentColor: '#ec4899',
  template: 'color',
  plan: 'pro',
  availabilityStatus: 'available',
  updatedAt: new Date().toISOString(),
};

const RESTAURANT: RestaurantCardData & { availabilityStatus?: string; availabilityText?: string } = {
  id: 'restaurant',
  slug: 'le-botaniste',
  name: 'Le Botaniste',
  tagline: 'Cuisine végane · Paris 11e',
  photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  contact: {
    phone: '+33 1 43 57 22 81',
    website: 'https://lebotaniste.fr',
    address: '14 rue Oberkampf, 75011 Paris',
    hours: '12h–22h · Lun–Sam',
  },
  availabilityStatus: 'available',
  availabilityText: 'Ouvert — service en cours',
  menu: [
    { id: '1', name: 'Buddha Bowl', price: 14, category: 'Plats', available: true, emoji: '🥗' },
    { id: '2', name: 'Burger Végé', price: 16, category: 'Plats', available: false, emoji: '🍔' },
    { id: '3', name: 'Soupe du jour', price: 8, category: 'Entrées', available: true, emoji: '🍲' },
    { id: '4', name: 'Tiramisu Coco', price: 7, category: 'Desserts', available: true, emoji: '🍮' },
    { id: '5', name: 'Kombucha', price: 5, category: 'Boissons', available: true, emoji: '🥤' },
  ],
  accentColor: '#22c55e',
  updatedAt: new Date().toISOString(),
};

const INFLUENCER: InfluencerCardData & { availabilityStatus?: string; availabilityText?: string } = {
  id: 'influencer',
  slug: 'emma-lifestyle',
  name: 'Emma Moreau',
  handle: '@emma.lifestyle',
  niche: 'Lifestyle · Food · Voyage · Bien-être',
  photo: 'https://randomuser.me/api/portraits/women/68.jpg',
  stats: { followers: '128K', engagement: '4.2%', collab: '50+' },
  links: {
    instagram: 'https://instagram.com/emma.lifestyle',
    youtube: 'https://youtube.com/@emmalifestyle',
    website: 'https://emmamoreau.com',
    mediaKit: 'https://emmamoreau.com/mediakit.pdf',
  },
  accentColor: '#a855f7',
  availabilityStatus: 'available',
  availabilityText: 'Ouverte aux collaborations',
  updatedAt: new Date().toISOString(),
};

const INFLUENCER_CARD: CardData = {
  id: 'influencer',
  slug: 'emma-lifestyle',
  name: 'Emma Moreau',
  title: 'Lifestyle · Food · Voyage · Bien-être',
  photo: 'https://randomuser.me/api/portraits/women/68.jpg',
  socials: {
    instagram: 'https://instagram.com/emma.lifestyle',
    website: 'https://emmamoreau.com',
  },
  contact: { email: 'hello@emmamoreau.com' },
  accentColor: '#a855f7',
  plan: 'pro',
  template: 'influencer',
  updatedAt: new Date().toISOString(),
};

// ─── Availability badge ───────────────────────────────────────────────────────

function AvailabilityBadge({ status, text }: { status?: string; text?: string }) {
  if (!status) return null;
  const tone =
    status === 'available' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
    status === 'busy' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
    'bg-zinc-800/60 border-zinc-700/40 text-zinc-400';
  const dot =
    status === 'available' ? 'bg-emerald-400' :
    status === 'busy' ? 'bg-amber-400' : 'bg-zinc-500';
  const fallback =
    status === 'available' ? 'Disponible pour de nouveaux projets' :
    status === 'busy' ? 'Occupé — contactez-moi quand même' :
    'Indisponible pour le moment';
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium w-fit mx-auto ${tone}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {text || fallback}
    </div>
  );
}

// ─── Template cards ───────────────────────────────────────────────────────────

interface TemplateEntry {
  id: string;
  label: string;
  badge: string;
  badgeColor: string;
  comingSoon?: boolean;
}

const TEMPLATES: TemplateEntry[] = [
  { id: 'freelance-dark', label: 'Freelance — Dark', badge: 'Défaut', badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { id: 'freelance-light', label: 'Freelance — Light', badge: 'Light', badgeColor: 'text-zinc-400 bg-zinc-800 border-zinc-700/40' },
  { id: 'freelance-color', label: 'Freelance — Color', badge: 'Accent perso', badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  { id: 'restaurant', label: 'Micro — Restaurant', badge: 'Bientôt', badgeColor: 'text-zinc-400 bg-zinc-800 border-zinc-700/60', comingSoon: true },
  { id: 'influencer', label: 'Influenceur', badge: 'Pro', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
];

const ACCENT_BY_ID: Record<string, string> = {
  'freelance-dark': '#f97316',
  'freelance-light': '#6366f1',
  'freelance-color': '#ec4899',
  'restaurant': '#22c55e',
  'influencer': '#a855f7',
};

export default function TemplatesPage() {
  const router = useRouter();
  const [active, setActive] = useState('freelance-dark');
  const current = TEMPLATES.find((t) => t.id === active)!;
  const accent = ACCENT_BY_ID[active] || '#f97316';

  return (
    <div className="relative isolate min-h-screen text-white flex flex-col">
      <AmbientBackground accent={accent} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative px-6 py-6 border-b border-zinc-800/40 backdrop-blur-xs bg-zinc-950/40 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Templates</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Sélectionne un template pour le prévisualiser</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800/60">
            <span className="relative flex h-2 w-2">
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: accent }}
                animate={{ scale: [1, 2.2], opacity: [0.75, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: accent }}
              />
            </span>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400">Live preview</span>
          </div>
        </div>
        <button type="button" onClick={() => router.push('/')} className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">← Accueil</button>
      </motion.div>

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">

        {/* Sidebar — liste des templates */}
        <aside className="relative lg:w-72 border-b lg:border-b-0 lg:border-r border-zinc-800/40 p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible backdrop-blur-xs bg-zinc-950/30">
          {TEMPLATES.map((t, idx) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={!t.comingSoon ? { x: 2 } : undefined}
              whileTap={!t.comingSoon ? { scale: 0.98 } : undefined}
              onClick={() => !t.comingSoon && setActive(t.id)}
              disabled={t.comingSoon}
              className={[
                'relative flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all text-left shrink-0 lg:shrink overflow-hidden',
                t.comingSoon
                  ? 'bg-transparent border-transparent text-zinc-500 opacity-60 grayscale cursor-not-allowed'
                  : active === t.id
                  ? 'bg-zinc-800/80 border-zinc-700/60 text-white shadow-lg'
                  : 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/60 hover:border-zinc-800',
              ].join(' ')}
            >
              {active === t.id && !t.comingSoon && (
                <motion.span
                  layoutId="active-template-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r-full"
                  style={{ background: ACCENT_BY_ID[t.id] }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="text-sm font-medium truncate min-w-0">{t.label}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${t.badgeColor}`}>
                {t.badge}
              </span>
            </motion.button>
          ))}
        </aside>

        {/* Preview */}
        <main className="relative flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-start p-6 gap-4">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 self-start"
          >
            <h2 className="text-lg font-semibold text-white">{current.label}</h2>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${current.badgeColor}`}>
              {current.badge}
            </span>
          </motion.div>

          {/* Wrapper reproduisant le contexte exact de /demo */}
          <div className={[
            'relative w-full rounded-2xl overflow-hidden py-8 flex flex-col items-center transition-colors duration-500 border',
            active === 'freelance-light'
              ? 'bg-linear-to-br from-zinc-50 via-white to-zinc-50 border-zinc-200/60 shadow-2xl shadow-black/40'
              : 'bg-linear-to-br from-zinc-950/80 via-black/80 to-zinc-950/80 border-zinc-800/60 backdrop-blur-sm shadow-2xl shadow-black/40',
          ].join(' ')}>
            {/* Accent ring glow */}
            <motion.div
              key={`ring-${active}`}
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                boxShadow: `inset 0 0 80px ${accent}1a`,
              }}
            />
            <div className="relative w-full max-w-md px-4 flex flex-col items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex flex-col items-center gap-2"
                >
                  {/* Badge disponibilité */}
                  {active === 'freelance-dark' && <AvailabilityBadge status={FREELANCE_DARK.availabilityStatus} text={FREELANCE_DARK.availabilityText} />}
                  {active === 'freelance-light' && <AvailabilityBadge status={FREELANCE_LIGHT.availabilityStatus} text={FREELANCE_LIGHT.availabilityText} />}
                  {active === 'freelance-color' && <AvailabilityBadge status={FREELANCE_COLOR.availabilityStatus} text={FREELANCE_COLOR.availabilityText} />}
                  {active === 'restaurant' && <AvailabilityBadge status={RESTAURANT.availabilityStatus} text={RESTAURANT.availabilityText} />}
                  {active === 'influencer' && <AvailabilityBadge status={INFLUENCER.availabilityStatus} text={INFLUENCER.availabilityText} />}

                  {active === 'freelance-dark' && (
                    <VCard card={FREELANCE_DARK} theme="dark" language="fr" onSaveContact={() => {}} />
                  )}
                  {active === 'freelance-light' && (
                    <VCard card={FREELANCE_LIGHT} theme="light" language="fr" onSaveContact={() => {}} />
                  )}
                  {active === 'freelance-color' && (
                    <VCard card={FREELANCE_COLOR} theme="dark" language="fr" onSaveContact={() => {}} />
                  )}
                  {active === 'restaurant' && (
                    <div
                      style={{ '--accent': RESTAURANT.accentColor || '#22c55e' } as React.CSSProperties}
                      className="w-full"
                    >
                      <CardFrontRestaurant card={RESTAURANT} theme="dark" language="fr" onSaveContact={() => {}} />
                    </div>
                  )}
                  {active === 'influencer' && (
                    <div
                      style={{ '--accent': INFLUENCER.accentColor || '#a855f7' } as React.CSSProperties}
                      className="w-full"
                    >
                      <CardFrontInfluencer card={INFLUENCER} theme="dark" language="fr" onSaveContact={() => {}} />
                    </div>
                  )}

                  {/* Formulaires */}
                  {active === 'influencer' && (
                    <LeadCaptureFormInfluencer card={INFLUENCER_CARD} theme="dark" language="fr" />
                  )}
                  {active !== 'influencer' && active !== 'restaurant' && (
                    <LeadCaptureForm
                      card={active === 'freelance-light' ? FREELANCE_LIGHT : active === 'freelance-color' ? FREELANCE_COLOR : FREELANCE_DARK}
                      theme={active === 'freelance-light' ? 'light' : 'dark'}
                      language="fr"
                    />
                  )}

                  <CardFooter
                    theme={active === 'freelance-light' ? 'light' : 'dark'}
                    accentColor={
                      active === 'freelance-light' ? FREELANCE_LIGHT.accentColor
                      : active === 'freelance-color' ? FREELANCE_COLOR.accentColor
                      : active === 'restaurant' ? RESTAURANT.accentColor
                      : active === 'influencer' ? INFLUENCER.accentColor
                      : FREELANCE_DARK.accentColor
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Infos du template */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${active}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative w-full max-w-sm rounded-2xl p-4 flex flex-col gap-2 overflow-hidden bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/60"
            >
              <div
                className="absolute top-0 left-0 h-full w-0.5"
                style={{ background: accent }}
              />
              <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Infos</p>
              {active.startsWith('freelance') && (
                <>
                  <p className="text-sm text-zinc-300">Flip card 3D · Photo · Liens sociaux · Actions (tel, email, WhatsApp) · QR code · Formulaire leads</p>
                  <p className="text-xs text-zinc-600">Couleur accent personnalisable dans les settings</p>
                </>
              )}
              {active === 'restaurant' && (
                <>
                  <p className="text-sm text-zinc-300">Photo hero · Menu par catégorie · Badge épuisé temps réel · Horaires · Adresse</p>
                  <p className="text-xs text-zinc-600">Statut épuisé mis à jour en temps réel · Plan Pro</p>
                </>
              )}
              {active === 'influencer' && (
                <>
                  <p className="text-sm text-zinc-300">Cover photo · Stats (followers, engagement, collabs) · Liens réseaux · Media Kit PDF</p>
                  <p className="text-xs text-zinc-600">Press kit et brand kit · Plan Pro</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
