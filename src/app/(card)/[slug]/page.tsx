'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import { VCard } from '@/components/card';
import { Watermark } from '@/components/card/Watermark';
import { LeadCaptureForm } from '@/components/card/LeadCaptureForm';
import { LeadCaptureFormInfluencer } from '@/components/card/LeadCaptureFormInfluencer';
import type { CardData, CardTheme, CardLanguage } from '@/types/card';
import { getCardBySlug, supabaseCardToCardData } from '@/lib/supabase/cards';
import { trackCardEvent } from '@/lib/supabase/events';
import Link from 'next/link';
import { useAuth } from '@/lib/supabase/AuthProvider';
import { getProfile } from '@/lib/supabase/profile';

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

export default function CardPage() {
  const { slug } = useParams<{ slug: string }>();
  const [card, setCard] = useState<CardData>(BASE_CARD);
  const [theme, setTheme] = useState<CardTheme>('dark');
  const [language, setLanguage] = useState<CardLanguage>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [cardLoading, setCardLoading] = useState(true);
  const dark = theme === 'dark';
  const[plan, setPlan] = useState<CardData['plan']>(undefined);

  useEffect(() => {

    // if (!uid) { setCardLoading(false); return; }
    const formatName = (str : string) =>
  decodeURIComponent(str).toLowerCase().replace(/\s+/g, '-');
    const slugFomatted = formatName(slug);
    console.log(slugFomatted, "slug formatted");


    Promise.all([
      getCardBySlug(slugFomatted),
      getProfile(),
    ]).then(([match, profile]) => {
      if (match) {
        setCard(supabaseCardToCardData(match));
        setTheme(match.template === 'light' ? 'light' : 'dark');
        trackCardEvent(match.id, 'view');
      }
      if (profile) {
        setPlan(profile.plan as CardData['plan'] || undefined);
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
          <Link
            href="/dashboard"
            className={`absolute left-0 text-xs font-medium transition-colors ${dark ? 'text-zinc-600 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'}`}
          >
            ← Accueil
          </Link>
          <h1 className={`text-xl font-bold bg-linear-to-r ${titleGradient} bg-clip-text text-transparent tracking-tight`}>
            Smart vCard
          </h1>
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

        {/* VCard + formulaire groupés avec le même écart que le bouton interne (mt-2) */}
        <div className="flex flex-col w-full max-w-md gap-2">
          <VCard
            card={card}
            theme={theme}
            language={language}
            onSaveContact={handleSaveContact}
            isSaving={isSaving}
          />

          {card.template === 'influencer' ? (
            <LeadCaptureFormInfluencer
              card={card}
              theme={theme}
              language={language}
              locked={!card.plan}
            />
          ) : (
            <LeadCaptureForm
              card={card}
              theme={theme}
              language={language}
              locked={plan === 'free' ? true : false}
            />
          )}
        </div>

        <Watermark plan={card.template === 'dark' ? 'free' : 'pro'} />
      </div>
    </div>
  );
}
