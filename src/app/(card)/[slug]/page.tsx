'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import { VCard } from '@/components/card';
import { Watermark } from '@/components/card/Watermark';
import type { CardData, CardTheme, CardLanguage } from '@/types/card';
import { useAuth } from '@/lib/firebase/AuthProvider';
import { getCardsByUid } from '@/lib/firebase/get-cards';

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
  },
  accentColor: '#f97316',
  template: 'dark',
  updatedAt: new Date().toISOString(),
};

const LANGUAGES: CardLanguage[] = ['fr', 'en', 'th'];

export default function CardPage() {
  const { slug } = useParams<{ slug: string }>();
  const { uid } = useAuth();
  const [card, setCard] = useState<CardData>(BASE_CARD);
  const [theme, setTheme] = useState<CardTheme>('dark');
  const [language, setLanguage] = useState<CardLanguage>('en');
  const [isSaving, setIsSaving] = useState(false);
  const dark = theme === 'dark';

  useEffect(() => {
    if (!uid) return;
    getCardsByUid(uid).then((cards) => {
      const match = cards.find((c) => c.slug === slug) ?? cards[0];
      if (!match) return;

      setCard({
        id: match.slug,
        slug: match.slug,
        name: match.name ?? '',
        title: match.title ?? '',
        photo: match.photo ?? '',
        contact: {
          phone: match.contact?.phone ?? undefined,
          email: match.contact?.email ?? undefined,
          whatsapp: match.contact?.whatsapp ?? undefined,
          line: match.contact?.line ?? undefined,
        },
        socials: {
          instagram: match.socials?.instagram ?? undefined,
          youtube: match.socials?.youtube ?? undefined,
          linkedin: match.socials?.linkedin ?? undefined,
          website: match.socials?.website ?? undefined,
        },
        accentColor: match.accentColor ?? '#f97316',
        template: (match.template as CardData['template']) ?? 'dark',
      });

      if (match.template === 'light') setTheme('light');
    }).catch(() => {});
  }, [uid, slug]);

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

  return (
    <div className={`bg-linear-to-br ${pageBg} min-h-screen w-full transition-colors duration-300 flex flex-col items-center`}>
      <div className="flex flex-col items-center w-full max-w-md px-4 py-8 gap-6">

        <div className="flex items-center gap-3 justify-center w-full">
          <h1 className={`text-xl font-bold bg-linear-to-r ${titleGradient} bg-clip-text text-transparent tracking-tight`}>
            Smart vCard
          </h1>
          <div className={`flex gap-1 ${langBg} rounded-full px-1.5 py-1 border backdrop-blur-xl transition-colors duration-300`}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as CardLanguage)}
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-transparent border-none outline-none text-inherit"
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
          3 strategic tips delivered within 24h
        </p>

        <VCard
          card={card}
          theme={theme}
          language={language}
          onSaveContact={handleSaveContact}
          isSaving={isSaving}
        />

        <Watermark plan={card.template === 'dark' ? 'free' : 'pro'} />
      </div>
    </div>
  );
}
