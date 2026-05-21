'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { Sun, Moon, CalendarDays, X } from 'lucide-react';
import { VCard, CardFooter } from '@/components/card';
import { Watermark } from '@/components/card/Watermark';
import { LeadCaptureForm } from '@/components/card/LeadCaptureForm';
import { LeadCaptureFormInfluencer } from '@/components/card/LeadCaptureFormInfluencer';
import { CardFrontRestaurant, RestaurantMenuPanel } from '@/components/card/CardFrontRestaurant';
import { CardFrontInfluencer } from '@/components/card/CardFrontInfluencer';
import type { CardData, CardTheme, CardLanguage } from '@/types/card';
import { getCardBySlug, supabaseCardToCardData } from '@/lib/supabase/cards';
import { trackCardEvent } from '@/lib/supabase/events';
import Image from 'next/image';

const BASE_CARD: CardData = {
  id: 'demo',
  slug: 'demo',
  name: 'Noname Spirit',
  title: 'Graphiste Logo & Web | Branding',
  photo: '/noname-spirit.jpg',
  socials: {
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    website: 'https://noname-spirit.com',
  },
  contact: {
    phone: '+33 6 00 00 00 00',
    email: 'hello@noname-spirit.com',
    whatsapp: '+33600000000',
    line: 'https://line.me/ti/p/~noname-spirit',
  },
  accentColor: '#f97316',
  template: 'dark',
  updatedAt: new Date().toISOString(),
  plan: 'pro',
  calendlyUrl: 'https://calendly.com/demo',
  captureForm: {
    title: 'Travaillons ensemble',
    subtitle: 'Laissez vos coordonnées — je vous recontacte sous 24h',
    ctaLabel: 'Envoyer mes coordonnées',
  },
};

const LANGUAGES: CardLanguage[] = ['fr', 'en', 'th'];

const PAGE_SUBTITLE: Record<CardLanguage, string> = {
  fr: 'Scannez, enregistrez, restez en contact',
  en: 'Scan, save, stay connected',
  th: 'สแกน บันทึก และติดต่อกันได้เลย',
};

function CalendlyModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md h-[88vh] sm:h-175 overflow-hidden border border-zinc-800/60 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/60 shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <CalendarDays size={15} className="text-orange-400" />
            Prendre rendez-vous
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
          >
            <X size={16} />
          </button>
        </div>
        <iframe
          src={url}
          width="100%"
          height="100%"
          frameBorder={0}
          className="flex-1 min-h-0"
          title="Calendly — prise de rendez-vous"
        />
      </div>
    </div>
  );
}

export default function CardPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [card, setCard] = useState<CardData>(BASE_CARD);
  const [theme, setTheme] = useState<CardTheme>('dark');
  const [language, setLanguage] = useState<CardLanguage>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [cardLoading, setCardLoading] = useState(true);
  const [showCalendly, setShowCalendly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dark = theme === 'dark';

  useEffect(() => {
    const formatName = (str: string) =>
      decodeURIComponent(str).toLowerCase().replace(/\s+/g, '-');
    const slugFormatted = formatName(slug);

    getCardBySlug(slugFormatted).then((match) => {
      if (match) {
        console.log('Card found for slug:', slugFormatted, match);
        setCard(supabaseCardToCardData(match));
        setTheme(match.template === 'light' ? 'light' : 'dark');
        trackCardEvent(match.id, 'view');
      }
    }).finally(() => setCardLoading(false));
  }, [slug]);

  const handleSaveContact = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/cards/${card.slug}/vcf`);
      if (!res.ok) throw new Error('VCF non disponible');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${card.slug}.vcf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silencieux
    } finally {
      setIsSaving(false);
    }
  };
// plus
  const pageBg = dark ? 'from-zinc-950 via-black to-zinc-950' : 'from-zinc-50 via-white to-zinc-50';
  const langBg = dark ? 'bg-zinc-900/60 border-zinc-800/40' : 'bg-zinc-100/80 border-zinc-300/40';
  const titleGradient = dark ? 'from-white via-white to-zinc-400' : 'from-zinc-900 via-zinc-800 to-zinc-500';
  const subtitle = dark ? 'text-zinc-500' : 'text-zinc-400';
  const toggleBtn = dark
    ? 'bg-zinc-900/60 border-zinc-800/40 text-zinc-400 hover:text-orange-400'
    : 'bg-zinc-100/80 border-zinc-300/40 text-zinc-500 hover:text-orange-500';

  if (cardLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className={`bg-linear-to-br ${pageBg} min-h-screen w-full transition-colors duration-300 flex flex-col items-center`}>
      <div className="flex flex-col items-center w-full max-w-md px-4 py-8 gap-6">

        <div className="flex items-center gap-3 justify-center w-full relative">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className={`absolute left-0 text-xs font-medium transition-colors ${dark ? 'text-zinc-600 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'}`}
          >
            ← Accueil
          </button>
          <Image
            src={dark ? '/logo/logo-horizontal-white.svg' : '/logo/logo-horizontal-color.svg'}
            alt="vCard"
            width={260}
            height={84}
            className="h-12 sm:h-16 w-auto"
            priority
          />
          <div className={`flex gap-1 ${langBg} rounded-full px-1.5 py-1 border backdrop-blur-xl transition-colors duration-300`}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as CardLanguage)}
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border-none outline-none ${dark ? 'bg-zinc-900 text-zinc-200' : 'bg-zinc-100 text-zinc-700'}`}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
            <button
              onClick={() => setTheme(dark ? 'light' : 'dark')}
              className={`px-2 py-1 rounded-full transition-all duration-200 border ${toggleBtn}`}
            >
              {dark ? <Sun size={12} /> : <Moon size={12} />}
            </button>
          </div>
        </div>

        <p className={`text-sm ${subtitle} font-medium tracking-wide`}>
          {PAGE_SUBTITLE[language]}
        </p>

        {/* Badge disponibilité */}
        {card.availabilityStatus && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium w-fit mx-auto ${
            card.availabilityStatus === 'available' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            card.availabilityStatus === 'busy' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
            'bg-zinc-800/60 border-zinc-700/40 text-zinc-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              card.availabilityStatus === 'available' ? 'bg-emerald-400' :
              card.availabilityStatus === 'busy' ? 'bg-amber-400' : 'bg-zinc-500'
            }`} />
            {card.availabilityText || (
              card.availabilityStatus === 'available' ? 'Disponible pour de nouveaux projets' :
              card.availabilityStatus === 'busy' ? 'Occupé — contactez-moi quand même' :
              'Indisponible pour le moment'
            )}
          </div>
        )}

        {/* Rendu selon le template */}
        <div className="flex flex-col w-full max-w-md gap-2">
          {card.template === 'restaurant' ? (
            <div style={{ '--accent': card.accentColor || '#22c55e' } as React.CSSProperties} className="flex flex-col gap-2 w-full">
              <CardFrontRestaurant
                card={{
                  id: card.id,
                  slug: card.slug,
                  name: card.name,
                  tagline: card.title || 'Cuisine · Ambiance · Saveurs',
                  photo: card.photo || '/noname-spirit.jpg',
                  contact: {
                    phone: card.contact?.phone,
                    website: card.socials?.website,
                    address: undefined,
                    hours: undefined,
                  },
                  socials: {
                    instagram: card.socials?.instagram,
                    youtube: card.socials?.youtube,
                    tiktok: card.socials?.tiktok,
                    linkedin: card.socials?.linkedin,
                    twitter: card.socials?.twitter,
                  },
                  menu: [
                    { id: '1', name: 'Soupe du jour', price: 8, category: 'Entrées', available: true, emoji: '🍲' },
                    { id: '2', name: 'Buddha Bowl', price: 14, category: 'Plats', available: true, emoji: '🥗' },
                    { id: '3', name: 'Burger Végé', price: 16, category: 'Plats', available: false, emoji: '🍔' },
                    { id: '4', name: 'Tiramisu Coco', price: 7, category: 'Desserts', available: true, emoji: '🍮' },
                    { id: '5', name: 'Kombucha', price: 5, category: 'Boissons', available: true, emoji: '🥤' },
                  ],
                  accentColor: card.accentColor,
                }}
                theme={theme}
                language={language}
                isSaving={isSaving}
                onSaveContact={handleSaveContact}
                onMenuOpen={() => setMenuOpen(!menuOpen)}
              />
              <AnimatePresence>
                {menuOpen && (
                  <RestaurantMenuPanel
                    card={{
                      id: card.id,
                      slug: card.slug,
                      name: card.name,
                      tagline: card.title || '',
                      photo: card.photo || '/noname-spirit.jpg',
                      contact: { phone: card.contact?.phone, website: card.socials?.website },
                      menu: [
                        { id: '1', name: 'Soupe du jour', price: 8, category: 'Entrées', available: true, emoji: '🍲' },
                        { id: '2', name: 'Buddha Bowl', price: 14, category: 'Plats', available: true, emoji: '🥗' },
                        { id: '3', name: 'Burger Végé', price: 16, category: 'Plats', available: false, emoji: '🍔' },
                        { id: '4', name: 'Tiramisu Coco', price: 7, category: 'Desserts', available: true, emoji: '🍮' },
                        { id: '5', name: 'Kombucha', price: 5, category: 'Boissons', available: true, emoji: '🥤' },
                      ],
                      accentColor: card.accentColor,
                    }}
                    theme={theme}
                    language={language}
                  />
                )}
              </AnimatePresence>
              <CardFooter theme={theme} accentColor={card.accentColor} />
            </div>
          ) : card.template === 'influencer' ? (
            <div
              style={{ '--accent': card.accentColor || '#a855f7' } as React.CSSProperties}
              className="flex flex-col gap-2 w-full"
            >
              <CardFrontInfluencer
                card={{
                  id: card.id,
                  slug: card.slug,
                  name: card.name,
                  handle: `@${card.slug}`,
                  niche: card.title || '',
                  photo: card.photo || '/noname-spirit.jpg',
                  stats: {
                    followers: card.stats?.followers || '—',
                    engagement: card.stats?.engagement || '—',
                    collab: card.stats?.collab || '—',
                  },
                  links: {
                    instagram: card.socials?.instagram,
                    youtube: card.socials?.youtube,
                    tiktok: card.socials?.tiktok,
                    linkedin: card.socials?.linkedin,
                    twitter: card.socials?.twitter,
                    website: card.socials?.website,
                  },
                  accentColor: card.accentColor,
                  updatedAt: card.updatedAt,
                }}
                theme={theme}
                language={language}
                isSaving={isSaving}
                onSaveContact={handleSaveContact}
              />
              <LeadCaptureFormInfluencer
                card={card}
                theme={theme}
                language={language}
                locked={!card.plan || card.plan === 'free'}
              />
              <CardFooter theme={theme} accentColor={card.accentColor} />
            </div>
          ) : (
            <>
              <VCard
                card={card}
                theme={theme}
                language={language}
                onSaveContact={handleSaveContact}
                isSaving={isSaving}
                onCalendlyClick={card.calendlyUrl && (card.plan === 'pro' || card.plan === 'business') ? () => { trackCardEvent(card.id, 'calendly'); setShowCalendly(true); } : undefined}
              />
              <LeadCaptureForm
                card={card}
                theme={theme}
                language={language}
                locked={!card.plan || card.plan === 'free'}
              />
              <CardFooter theme={theme} accentColor={card.accentColor} />
            </>
          )}
        </div>

        {/* Modal Calendly */}
        {showCalendly && card.calendlyUrl && (
          <CalendlyModal url={card.calendlyUrl} onClose={() => setShowCalendly(false)} />
        )}

        <Watermark plan={!card.plan || card.plan === 'free' ? 'free' : 'pro'} />
      </div>
    </div>
  );
}
