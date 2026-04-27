'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download, Instagram, Youtube, Globe, Linkedin, Phone, Mail, MessageCircle } from 'lucide-react';
import type { CardData, CardTheme, CardLanguage } from '@/types/card';

const LINE_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#06C755" />
    <path d="M12 6C8.13 6 5 8.61 5 11.77c0 1.47 1.02 2.77 2.62 3.67-.09.34-.54 2.04-.56 2.13-.09.36.14.36.29.33.12-.03 2.06-.66 2.87-.94.41.12.84.18 1.29.18 3.87 0 7-2.61 7-5.77S15.87 6 12 6z" fill="#fff" />
  </svg>
);

const labels = {
  fr: { save: 'Enregistrer Contact', phone: 'Téléphone', adding: 'Ajout en cours...' },
  en: { save: 'Save Contact', phone: 'Phone', adding: 'Adding...' },
  th: { save: 'บันทึกข้อมูลติดต่อ', phone: 'โทรศัพท์', adding: 'กำลังบันทึก...' },
};

interface CardFrontProps {
  card: CardData;
  theme: CardTheme;
  language: CardLanguage;
  isSaving?: boolean;
  freshnessBadge?: { label: string; color: string } | null;
  onSaveContact: () => void;
}

export function CardFront({ card, theme, language, isSaving, freshnessBadge, onSaveContact }: CardFrontProps) {
  const dark = theme === 'dark';
  const l = labels[language];

  const cardBg = dark
    ? 'from-zinc-900 via-zinc-900/95 to-black border-zinc-800/60'
    : 'from-white via-zinc-50 to-zinc-100 border-zinc-200/80';
  const cardShadow = dark ? 'shadow-2xl' : 'shadow-xl shadow-zinc-300/40';

  // Hover states via CSS classes referencing --accent (injected by VCard wrapper)
  const socialBtn = dark
    ? 'bg-zinc-800/50 card-social-btn border-zinc-700/30'
    : 'bg-zinc-100 card-social-btn border-zinc-200';
  const socialIcon = dark ? 'text-zinc-300 card-social-icon' : 'text-zinc-500 card-social-icon';
  const actionCall = dark
    ? 'bg-zinc-800/50 hover:bg-emerald-500/15 border-zinc-700/30 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400'
    : 'bg-zinc-100 hover:bg-emerald-500/10 border-zinc-200 hover:border-emerald-500/40 text-zinc-600 hover:text-emerald-500';
  const actionMail = dark
    ? 'bg-zinc-800/50 hover:bg-blue-500/15 border-zinc-700/30 hover:border-blue-500/40 text-zinc-300 hover:text-blue-400'
    : 'bg-zinc-100 hover:bg-blue-500/10 border-zinc-200 hover:border-blue-500/40 text-zinc-600 hover:text-blue-500';
  const actionWhatsapp = dark
    ? 'bg-zinc-800/50 hover:bg-green-500/15 border-zinc-700/30 hover:border-green-500/40 text-zinc-300 hover:text-green-400'
    : 'bg-zinc-100 hover:bg-green-500/10 border-zinc-200 hover:border-green-500/40 text-zinc-600 hover:text-green-500';
  const nameColor = dark ? 'text-white' : 'text-zinc-900';

  const socials = [
    card.socials.instagram && { href: card.socials.instagram, icon: Instagram, label: 'Instagram' },
    card.socials.youtube && { href: card.socials.youtube, icon: Youtube, label: 'YouTube' },
    card.socials.linkedin && { href: card.socials.linkedin, icon: Linkedin, label: 'LinkedIn' },
    card.socials.website && { href: card.socials.website, icon: Globe, label: 'Website' },
  ].filter(Boolean) as { href: string; icon: React.ElementType; label: string }[];

  const hasActions = card.contact.phone || card.contact.email || card.contact.whatsapp || card.contact.line;

  return (
    <div className={`w-full h-full bg-linear-to-br ${cardBg} rounded-3xl px-4 py-6 border backdrop-blur-2xl ${cardShadow} flex flex-col items-center justify-center gap-5 transition-colors duration-300 relative`}>

      {/* Decorative lines — accent dynamique */}
      <div
        className="absolute top-0 left-12 right-12 h-px"
        style={{ background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--accent) 30%, transparent), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-12 right-12 h-px"
        style={{ background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--accent) 30%, transparent), transparent)' }}
      />

      {/* Photo — ring accent dynamique */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative"
      >
        <div
          className="w-24 h-24 rounded-full p-0.5 relative"
          style={{
            background: 'linear-gradient(to bottom right, color-mix(in srgb, var(--accent) 70%, white), var(--accent), color-mix(in srgb, var(--accent) 70%, black))',
            boxShadow: '0 10px 30px color-mix(in srgb, var(--accent) 30%, transparent)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)' }}
          />
          {card.photo ? (
            <Image
              src={card.photo}
              alt={card.name}
              width={96}
              height={96}
              unoptimized
              className="w-full h-full rounded-full object-cover relative z-10"
            />
          ) : (
            <div className="w-full h-full rounded-full relative z-10 flex items-center justify-center bg-zinc-800 text-white text-2xl font-bold">
              {card.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </motion.div>

      {/* Name + badge */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col items-center gap-1 text-center"
      >
        <div className="flex items-center gap-2">
          <h2 className={`text-xl font-bold ${nameColor} tracking-tight`}>{card.name}</h2>
          {freshnessBadge && (
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${freshnessBadge.color}`}>
              {freshnessBadge.label}
            </span>
          )}
        </div>
        {/* Titre — couleur accent dynamique */}
        <p
          className="font-medium text-xs tracking-widest uppercase"
          style={{ color: 'color-mix(in srgb, var(--accent) 80%, transparent)' }}
        >
          {card.title}
        </p>
      </motion.div>

      {/* Socials */}
      {socials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center gap-3"
        >
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1.5 rounded-full ${socialBtn} border transition-all duration-300`}
            >
              <s.icon size={20} className={`${socialIcon} transition-colors`} />
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* Action buttons */}
      {hasActions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="flex justify-center gap-2 w-full"
        >
          {card.contact.phone && (
            <a href={`tel:${card.contact.phone}`} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl ${actionCall} border transition-all duration-300 text-xs font-medium`}>
              <Phone size={14} />
              {l.phone}
            </a>
          )}
          {card.contact.email && (
            <a href={`mailto:${card.contact.email}`} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl ${actionMail} border transition-all duration-300 text-xs font-medium`}>
              <Mail size={14} />
              Email
            </a>
          )}
          {card.contact.whatsapp && (
            <a href={`https://wa.me/${card.contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl ${actionWhatsapp} border transition-all duration-300 text-xs font-medium`}>
              <MessageCircle size={14} />
              WhatsApp
            </a>
          )}
          {card.contact.line && (
            <a href={card.contact.line} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-xs font-medium text-green-700 hover:bg-green-500/20 transition-all duration-300">
              {LINE_ICON}
              LINE
            </a>
          )}
        </motion.div>
      )}

      {/* Save contact — bouton accent dynamique */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        onClick={onSaveContact}
        disabled={isSaving}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2.5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        style={{
          background: 'linear-gradient(to right, var(--accent), color-mix(in srgb, var(--accent) 80%, black))',
          boxShadow: '0 10px 30px color-mix(in srgb, var(--accent) 25%, transparent)',
        }}
      >
        <Download size={16} className={`transition-transform ${isSaving ? 'animate-spin' : 'group-hover:translate-y-0.5'}`} />
        {isSaving ? l.adding : l.save}
      </motion.button>
    </div>
  );
}
