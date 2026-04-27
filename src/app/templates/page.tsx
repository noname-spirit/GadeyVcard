'use client';

import { useState } from 'react';
import { VCard } from '@/components/card';
import { CardFrontRestaurant } from '@/components/card/CardFrontRestaurant';
import { CardFrontInfluencer } from '@/components/card/CardFrontInfluencer';
import { LeadCaptureForm } from '@/components/card/LeadCaptureForm';
import { LeadCaptureFormInfluencer } from '@/components/card/LeadCaptureFormInfluencer';
import type { CardData } from '@/types/card';
import type { RestaurantCardData } from '@/components/card/CardFrontRestaurant';
import type { InfluencerCardData } from '@/components/card/CardFrontInfluencer';

// ─── Mock data ────────────────────────────────────────────────────────────────

const FREELANCE_DARK: CardData = {
  id: 'freelance-dark',
  slug: 'kevin',
  name: 'Kevin Durand',
  title: 'Graphiste & Brand Designer',
  photo: '/noname-spirit.jpg',
  socials: { instagram: '#', linkedin: '#', website: '#' },
  contact: { phone: '+33 6 00 00 00 00', email: 'kevin@studio.fr', whatsapp: '+33600000000' },
  accentColor: '#f97316',
  template: 'dark',
  plan: 'pro',
  updatedAt: new Date().toISOString(),
};

const FREELANCE_LIGHT: CardData = {
  ...FREELANCE_DARK,
  id: 'freelance-light',
  accentColor: '#6366f1',
  template: 'light',
};

const FREELANCE_COLOR: CardData = {
  ...FREELANCE_DARK,
  id: 'freelance-color',
  accentColor: '#ec4899',
  template: 'color',
};

const RESTAURANT: RestaurantCardData = {
  id: 'restaurant',
  slug: 'le-botaniste',
  name: 'Le Botaniste',
  tagline: 'Cuisine végane · Paris 11e',
  photo: '/noname-spirit.jpg',
  contact: { phone: '+33 1 23 45 67 89', website: 'https://lebotaniste.fr', address: '14 rue Oberkampf', hours: '12h–22h · Lun–Sam' },
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

const INFLUENCER: InfluencerCardData = {
  id: 'influencer',
  slug: 'emma-lifestyle',
  name: 'Emma Moreau',
  handle: '@emma.lifestyle',
  niche: 'Lifestyle · Food · Voyage · Bien-être',
  photo: '/noname-spirit.jpg',
  stats: { followers: '128K', engagement: '4.2%', collab: '50+' },
  links: { instagram: '#', youtube: '#', website: '#', mediaKit: '#' },
  accentColor: '#a855f7',
  updatedAt: new Date().toISOString(),
};

const INFLUENCER_CARD: CardData = {
  id: 'influencer',
  slug: 'emma-lifestyle',
  name: 'Emma Moreau',
  title: 'Lifestyle · Food · Voyage · Bien-être',
  photo: '/noname-spirit.jpg',
  socials: { instagram: '#', website: '#' },
  contact: { email: 'emma@lifestyle.fr' },
  accentColor: '#a855f7',
  plan: 'pro',
  template: 'influencer',
  updatedAt: new Date().toISOString(),
};

// ─── Template cards ───────────────────────────────────────────────────────────

const TEMPLATES = [
  { id: 'freelance-dark', label: 'Freelance — Dark', badge: 'Défaut', badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { id: 'freelance-light', label: 'Freelance — Light', badge: 'Light', badgeColor: 'text-zinc-400 bg-zinc-800 border-zinc-700/40' },
  { id: 'freelance-color', label: 'Freelance — Color', badge: 'Accent perso', badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  { id: 'restaurant', label: 'Restaurant', badge: 'Pro', badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'influencer', label: 'Influenceur', badge: 'Pro', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
];

export default function TemplatesPage() {
  const [active, setActive] = useState('freelance-dark');
  const current = TEMPLATES.find((t) => t.id === active)!;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* Header */}
      <div className="px-6 py-6 border-b border-zinc-800/60 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Templates</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Sélectionne un template pour le prévisualiser</p>
        </div>
        <a href="/" className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors">← Accueil</a>
      </div>

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">

        {/* Sidebar — liste des templates */}
        <aside className="lg:w-72 border-b lg:border-b-0 lg:border-r border-zinc-800/60 p-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={[
                'flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all text-left shrink-0 lg:shrink',
                active === t.id
                  ? 'bg-zinc-800 border-zinc-700/60 text-white'
                  : 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900 hover:border-zinc-800',
              ].join(' ')}
            >
              <span className="text-sm font-medium whitespace-nowrap">{t.label}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${t.badgeColor}`}>
                {t.badge}
              </span>
            </button>
          ))}
        </aside>

        {/* Preview */}
        <main className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-start p-6 gap-4 bg-zinc-950">
          <div className="flex items-center gap-3 self-start">
            <h2 className="text-lg font-semibold text-white">{current.label}</h2>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>

          {/* Wrapper reproduisant le contexte exact de /demo */}
          <div className={[
            'w-full rounded-2xl overflow-hidden py-8 flex flex-col items-center transition-colors duration-300',
            active === 'freelance-light'
              ? 'bg-linear-to-br from-zinc-50 via-white to-zinc-50'
              : 'bg-linear-to-br from-zinc-950 via-black to-zinc-950',
          ].join(' ')}>
            <div className="w-full max-w-md px-4 flex flex-col items-center gap-2">
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

              {/* Formulaires — exactement comme /demo */}
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
            </div>
          </div>

          {/* Infos du template */}
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800/60 rounded-2xl p-4 flex flex-col gap-2">
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
          </div>
        </main>

      </div>
    </div>
  );
}
