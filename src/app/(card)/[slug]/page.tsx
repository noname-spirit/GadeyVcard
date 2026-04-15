'use client';

import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { VCard } from '@/components/card';
import type { CardData, CardTheme, CardLanguage } from '@/types/card';

// Données mock — remplacées par un fetch Supabase quand G est prêt
const MOCK_CARD: CardData = {
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
  const [theme, setTheme] = useState<CardTheme>('dark');
  const [language, setLanguage] = useState<CardLanguage>('en');
  const [isSaving, setIsSaving] = useState(false);
  const dark = theme === 'dark';

  const handleSaveContact = async () => {
    setIsSaving(true);
    // TODO : fetch /api/cards/[slug]/vcf quand G a créé la route
    setTimeout(() => setIsSaving(false), 800);
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

        {/* Header */}
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

        {/* VCard */}
        <VCard
          card={MOCK_CARD}
          theme={theme}
          language={language}
          onSaveContact={handleSaveContact}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
