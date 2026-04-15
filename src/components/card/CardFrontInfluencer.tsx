'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download, Instagram, Youtube, Globe, TrendingUp } from 'lucide-react';
import type { CardTheme, CardLanguage } from '@/types/card';

export interface InfluencerCardData {
  id: string;
  slug: string;
  name: string;
  handle: string;         // @username
  niche: string;          // Ex : "Lifestyle · Food · Travel"
  photo: string;
  coverPhoto?: string;    // Bannière optionnelle
  stats: {
    followers?: string;   // Ex : "128K"
    engagement?: string;  // Ex : "4.2%"
    collab?: string;      // Ex : "50+ marques"
  };
  links: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    website?: string;
    mediaKit?: string;    // PDF press kit
  };
  accentColor?: string;
  updatedAt?: string;
}

const labels = {
  fr: { save: 'Enregistrer Contact', collab: 'Collaboration', mediaKit: 'Media Kit' },
  en: { save: 'Save Contact', collab: 'Collab', mediaKit: 'Media Kit' },
  th: { save: 'บันทึกข้อมูล', collab: 'ร่วมงาน', mediaKit: 'มีเดียคิท' },
};

interface CardFrontInfluencerProps {
  card: InfluencerCardData;
  theme: CardTheme;
  language: CardLanguage;
  isSaving?: boolean;
  onSaveContact: () => void;
}

export function CardFrontInfluencer({ card, theme, language, isSaving, onSaveContact }: CardFrontInfluencerProps) {
  const dark = theme === 'dark';
  const l = labels[language];

  const cardBg = dark ? 'from-zinc-900 via-zinc-900/95 to-black border-zinc-800/60' : 'from-white via-zinc-50 to-zinc-100 border-zinc-200/80';
  const cardShadow = dark ? 'shadow-2xl' : 'shadow-xl shadow-zinc-300/40';
  const handleColor = dark ? 'text-zinc-500' : 'text-zinc-400';
  const nicheColor = dark ? 'text-zinc-400' : 'text-zinc-500';
  const statBg = dark ? 'bg-zinc-800/60 border-zinc-700/40' : 'bg-zinc-100 border-zinc-200';
  const statLabel = dark ? 'text-zinc-500' : 'text-zinc-400';
  const statValue = dark ? 'text-white' : 'text-zinc-900';
  const linkBtn = dark
    ? 'bg-zinc-800/50 border-zinc-700/30 text-zinc-300 hover:border-zinc-600'
    : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:border-zinc-300';

  const socialLinks = [
    card.links.instagram && { href: card.links.instagram, icon: Instagram, label: 'Instagram' },
    card.links.youtube && { href: card.links.youtube, icon: Youtube, label: 'YouTube' },
    card.links.website && { href: card.links.website, icon: Globe, label: 'Site' },
  ].filter(Boolean) as { href: string; icon: React.ElementType; label: string }[];

  const hasStats = card.stats.followers || card.stats.engagement || card.stats.collab;

  return (
    <div className={`w-full bg-linear-to-br ${cardBg} rounded-3xl border backdrop-blur-2xl ${cardShadow} flex flex-col transition-colors duration-300 relative overflow-hidden`}>

      {/* Cover photo ou gradient */}
      <div className="relative w-full h-28 overflow-hidden">
        {card.coverPhoto ? (
          <Image src={card.coverPhoto} alt="cover" fill className="object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 40%, black))' }} />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60" />
      </div>

      {/* Photo + nom */}
      <div className="px-5 pb-5 flex flex-col gap-4">
        <div className="flex items-end gap-3 -mt-10">
          <div
            className="w-20 h-20 rounded-2xl p-0.5 shrink-0 shadow-xl"
            style={{ background: 'linear-gradient(to bottom right, color-mix(in srgb, var(--accent) 70%, white), var(--accent))' }}
          >
            <Image
              src={card.photo}
              alt={card.name}
              width={80}
              height={80}
              className="w-full h-full rounded-xl object-cover"
            />
          </div>
          <div className="pb-1">
            <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-zinc-900'} leading-tight`}>{card.name}</h2>
            <p className={`text-xs font-medium ${handleColor}`}>{card.handle}</p>
          </div>
        </div>

        <p className={`text-xs ${nicheColor}`}>{card.niche}</p>

        {/* Stats */}
        {hasStats && (
          <div className="grid grid-cols-3 gap-2">
            {card.stats.followers && (
              <div className={`flex flex-col items-center py-2 px-1 rounded-xl border ${statBg}`}>
                <span className={`text-sm font-bold ${statValue}`}>{card.stats.followers}</span>
                <span className={`text-[10px] ${statLabel}`}>Abonnés</span>
              </div>
            )}
            {card.stats.engagement && (
              <div className={`flex flex-col items-center py-2 px-1 rounded-xl border ${statBg}`}>
                <span className={`text-sm font-bold ${statValue} flex items-center gap-0.5`}>
                  <TrendingUp size={11} className="text-emerald-400" />
                  {card.stats.engagement}
                </span>
                <span className={`text-[10px] ${statLabel}`}>Engagement</span>
              </div>
            )}
            {card.stats.collab && (
              <div className={`flex flex-col items-center py-2 px-1 rounded-xl border ${statBg}`}>
                <span className={`text-sm font-bold ${statValue}`}>{card.stats.collab}</span>
                <span className={`text-[10px] ${statLabel}`}>Collabs</span>
              </div>
            )}
          </div>
        )}

        {/* Links */}
        {socialLinks.length > 0 && (
          <div className="flex gap-2">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${linkBtn}`}
              >
                <s.icon size={13} />
                {s.label}
              </a>
            ))}
          </div>
        )}

        {/* Media Kit + Save */}
        <div className="flex gap-2">
          {card.links.mediaKit && (
            <a
              href={card.links.mediaKit}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all ${linkBtn}`}
            >
              📄 {l.mediaKit}
            </a>
          )}
          <motion.button
            onClick={onSaveContact}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(to right, var(--accent), color-mix(in srgb, var(--accent) 80%, black))',
              boxShadow: '0 4px 20px color-mix(in srgb, var(--accent) 25%, transparent)',
            }}
          >
            <Download size={13} className={isSaving ? 'animate-spin' : ''} />
            {isSaving ? '...' : l.save}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
