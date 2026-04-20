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
  fr: {
    save: 'Enregistrer Contact',
    mediaKit: 'Media Kit',
    followers: 'Abonnés',
    engagement: 'Engagement',
    collabs: 'Collabs',
  },
  en: {
    save: 'Save Contact',
    mediaKit: 'Media Kit',
    followers: 'Followers',
    engagement: 'Engagement',
    collabs: 'Collabs',
  },
  th: {
    save: 'บันทึกข้อมูล',
    mediaKit: 'มีเดียคิท',
    followers: 'ผู้ติดตาม',
    engagement: 'เอนเกจ',
    collabs: 'คอลแลบ',
  },
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

  const cardBg = dark
    ? 'from-zinc-900 via-zinc-900/95 to-black border-zinc-800/60'
    : 'from-white via-zinc-50 to-zinc-100 border-zinc-200/80';
  const cardShadow = dark ? 'shadow-2xl' : 'shadow-xl shadow-zinc-300/40';
  const handleColor = dark ? 'text-zinc-500' : 'text-zinc-400';
  const nicheColor = dark ? 'text-zinc-400' : 'text-zinc-500';
  const statBg = dark ? 'bg-zinc-800/60 border-zinc-700/40' : 'bg-zinc-100 border-zinc-200';
  const statLabel = dark ? 'text-zinc-500' : 'text-zinc-400';
  const statValue = dark ? 'text-white' : 'text-zinc-900';
  const linkBtn = dark
    ? 'bg-zinc-800/50 border-zinc-700/30 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-600/60'
    : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200 hover:border-zinc-300';

  const socialLinks = [
    card.links.instagram && { href: card.links.instagram, icon: Instagram, label: 'Instagram' },
    card.links.youtube && { href: card.links.youtube, icon: Youtube, label: 'YouTube' },
    card.links.website && { href: card.links.website, icon: Globe, label: 'Site' },
  ].filter(Boolean) as { href: string; icon: React.ElementType; label: string }[];

  // Stats compilées pour gérer les colonnes dynamiquement
  const stats = [
    card.stats.followers && { value: card.stats.followers, label: l.followers },
    card.stats.engagement && {
      value: card.stats.engagement,
      label: l.engagement,
      icon: <TrendingUp size={11} className="text-emerald-400" />,
    },
    card.stats.collab && { value: card.stats.collab, label: l.collabs },
  ].filter(Boolean) as { value: string; label: string; icon?: React.ReactNode }[];

  return (
    <div className={`w-full bg-linear-to-br ${cardBg} rounded-3xl border backdrop-blur-2xl ${cardShadow} flex flex-col transition-colors duration-300 relative overflow-hidden`}>

      {/* Cover photo ou gradient accent */}
      <div className="relative w-full h-28 shrink-0">
        {card.coverPhoto ? (
          <>
            <Image src={card.coverPhoto} alt="cover" fill sizes="400px" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/50" />
          </>
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 80%, white 20%), color-mix(in srgb, var(--accent) 50%, black))',
            }}
          />
        )}
      </div>

      {/* Contenu */}
      <div className="px-5 pb-5 flex flex-col gap-3.5">

        {/* Photo + nom — chevauchement cover */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-end gap-3 -mt-10 relative z-10"
        >
          {/* Photo avec ring neutre — contraste avec la cover */}
          <div className="w-20 h-20 rounded-2xl p-0.5 shrink-0 shadow-xl bg-zinc-950/80">
            <Image
              src={card.photo}
              alt={card.name}
              width={76}
              height={76}
              className="w-full h-full rounded-[14px] object-cover"
            />
          </div>

          {/* Nom + handle */}
          <div className="pb-0.5 min-w-0">
            <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-zinc-900'} leading-tight truncate`}>
              {card.name}
            </h2>
            <p className={`text-xs font-medium ${handleColor} truncate`}>{card.handle}</p>
          </div>
        </motion.div>

        {/* Niche */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={`text-xs ${nicheColor} leading-relaxed`}
        >
          {card.niche}
        </motion.p>

        {/* Stats — colonnes dynamiques selon le nombre de stats disponibles */}
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
          >
            {stats.map((s) => (
              <div key={s.label} className={`flex flex-col items-center py-2.5 px-1 rounded-xl border ${statBg}`}>
                <span className={`text-sm font-bold ${statValue} flex items-center gap-0.5`}>
                  {s.icon}
                  {s.value}
                </span>
                <span className={`text-[10px] ${statLabel} mt-0.5`}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Liens sociaux */}
        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex gap-2"
          >
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${linkBtn}`}
              >
                <s.icon size={13} />
                {s.label}
              </a>
            ))}
          </motion.div>
        )}

        {/* Media Kit + Save */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="flex gap-2"
        >
          {card.links.mediaKit && (
            <a
              href={card.links.mediaKit}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${linkBtn}`}
            >
              📄 {l.mediaKit}
            </a>
          )}

          <motion.button
            onClick={onSaveContact}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${card.links.mediaKit ? 'flex-1' : 'w-full'} py-2 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-50`}
            style={{
              background: 'linear-gradient(to right, var(--accent), color-mix(in srgb, var(--accent) 80%, black))',
              boxShadow: '0 4px 20px color-mix(in srgb, var(--accent) 25%, transparent)',
            }}
          >
            <Download size={13} className={isSaving ? 'animate-spin' : ''} />
            {isSaving ? '...' : l.save}
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}
