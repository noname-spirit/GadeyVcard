'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Check, AlertCircle, Lock } from 'lucide-react';
import type { CardData, CardTheme, CardLanguage } from '@/types/card';

const COLLAB_TYPES = {
  fr: ['Sponsored post', 'Reels sponsorisé', 'Story', 'Événement', 'Ambassadeur', 'Gifting', 'Autre'],
  en: ['Sponsored post', 'Sponsored Reel', 'Story', 'Event', 'Ambassador', 'Gifting', 'Other'],
  th: ['โพสต์สปอนเซอร์', 'รีลสปอนเซอร์', 'สตอรี่', 'อีเวนต์', 'แบรนด์แอมบาสซาเดอร์', 'กิฟติ้ง', 'อื่นๆ'],
};

const BUDGETS = {
  fr: ['< 500 €', '500 – 1 000 €', '1 000 – 3 000 €', '3 000 € +', 'À discuter'],
  en: ['< €500', '€500 – €1,000', '€1,000 – €3,000', '€3,000 +', 'To discuss'],
  th: ['< 500 €', '500 – 1,000 €', '1,000 – 3,000 €', '3,000 € +', 'ปรึกษาได้'],
};

const labels = {
  fr: {
    title: 'Proposer une collaboration',
    subtitle: 'Je reviens vers vous sous 48h',
    placeholderNom: 'Votre nom',
    placeholderEntreprise: 'Entreprise / Marque',
    placeholderType: 'Type de collaboration',
    placeholderBudget: 'Budget estimé (optionnel)',
    placeholderContact: 'Email ou WhatsApp',
    placeholderMessage: 'Décrivez votre projet (optionnel)',
    cta: 'Proposer une collaboration',
    loading: 'Envoi en cours...',
    success: 'Reçu ! Je vous réponds sous 48h.',
    errorRequired: 'Nom, entreprise et contact sont obligatoires.',
    errorServer: 'Une erreur est survenue. Réessayez.',
    proBadge: 'Pro',
  },
  en: {
    title: 'Propose a collaboration',
    subtitle: "I'll get back to you within 48h",
    placeholderNom: 'Your name',
    placeholderEntreprise: 'Company / Brand',
    placeholderType: 'Collaboration type',
    placeholderBudget: 'Estimated budget (optional)',
    placeholderContact: 'Email or WhatsApp',
    placeholderMessage: 'Describe your project (optional)',
    cta: 'Propose a collaboration',
    loading: 'Sending...',
    success: "Got it! I'll reply within 48h.",
    errorRequired: 'Name, company and contact are required.',
    errorServer: 'Something went wrong. Please retry.',
    proBadge: 'Pro',
  },
  th: {
    title: 'เสนอความร่วมมือ',
    subtitle: 'ผมจะตอบกลับภายใน 48 ชม.',
    placeholderNom: 'ชื่อของคุณ',
    placeholderEntreprise: 'บริษัท / แบรนด์',
    placeholderType: 'ประเภทความร่วมมือ',
    placeholderBudget: 'งบประมาณโดยประมาณ (ไม่บังคับ)',
    placeholderContact: 'อีเมลหรือ WhatsApp',
    placeholderMessage: 'อธิบายโปรเจกต์ของคุณ (ไม่บังคับ)',
    cta: 'เสนอความร่วมมือ',
    loading: 'กำลังส่ง...',
    success: 'ได้รับแล้ว! ผมจะตอบกลับภายใน 48 ชม.',
    errorRequired: 'กรุณากรอกชื่อ บริษัท และช่องทางติดต่อ',
    errorServer: 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง',
    proBadge: 'Pro',
  },
};

interface CollabFormData {
  nom: string;
  entreprise: string;
  typeCollab: string;
  budget: string;
  contact: string;
  message: string;
}

const EMPTY: CollabFormData = {
  nom: '', entreprise: '', typeCollab: '', budget: '', contact: '', message: '',
};

const lockedLabels = {
  fr: { message: 'Disponible à partir du plan Starter', cta: 'Passer au plan Starter' },
  en: { message: 'Available from the Starter plan', cta: 'Upgrade to Starter' },
  th: { message: 'ใช้ได้ตั้งแต่แพ็คเกจ Starter', cta: 'อัปเกรดเป็น Starter' },
};

interface Props {
  card: CardData;
  theme: CardTheme;
  language: CardLanguage;
  locked?: boolean;
}

export function LeadCaptureFormInfluencer({ card, theme, language, locked = false }: Props) {
  const [form, setForm] = useState<CollabFormData>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const dark = theme === 'dark';
  const l = labels[language];
  const accent = card.accentColor || '#a855f7';

  const cardBg = dark
    ? 'from-zinc-900/70 via-zinc-900/50 to-black/80 border-zinc-800/40'
    : 'from-white/90 via-zinc-50/70 to-zinc-100/60 border-zinc-200/80';
  const cardShadow = dark ? 'shadow-2xl shadow-black/40' : 'shadow-xl shadow-zinc-300/40';
  const titleColor = dark ? 'text-white' : 'text-zinc-900';
  const subtitleColor = dark ? 'text-zinc-500' : 'text-zinc-400';
  const inputCls = dark
    ? 'bg-zinc-900/60 text-white placeholder-zinc-600 border-zinc-800/40 focus:ring-2'
    : 'bg-white/80 text-zinc-900 placeholder-zinc-400 border-zinc-200 focus:ring-2';

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const set = (key: keyof CollabFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nom.trim() || !form.entreprise.trim() || !form.contact.trim()) {
      showFeedback('error', l.errorRequired);
      return;
    }

    setIsLoading(true);
    try {
      const message = [
        form.typeCollab && `Type : ${form.typeCollab}`,
        form.budget && `Budget : ${form.budget}`,
        form.message && `Projet : ${form.message}`,
      ].filter(Boolean).join(' | ');

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_slug: card.slug,
          nom: `${form.nom} — ${form.entreprise}`,
          contact: form.contact,
          domaine: form.typeCollab || 'Collaboration',
          message,
          source: 'formulaire',
          language,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showFeedback('error', data.error || l.errorServer);
        return;
      }

      showFeedback('success', l.success);
      setForm(EMPTY);
    } catch {
      showFeedback('error', l.errorServer);
    } finally {
      setIsLoading(false);
    }
  };

  const ll = lockedLabels[language];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 }}
      className="w-full max-w-md"
    >
      <div
        className={`relative bg-linear-to-br ${cardBg} rounded-3xl p-5 border backdrop-blur-2xl ${cardShadow} transition-colors duration-300 ${locked ? 'select-none' : ''}`}
      >
        {/* Overlay plan locked */}
        {locked && (
          <div className="absolute inset-0 rounded-3xl z-10 flex flex-col items-center justify-center gap-3 backdrop-blur-sm bg-zinc-950/70">
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center">
                <Lock size={18} className="text-zinc-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-200">{ll.message}</p>
              <a
                href="/dashboard/upgrade"
                className="mt-1 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                style={{ background: `linear-gradient(to right, ${accent}, color-mix(in srgb, ${accent} 75%, black))` }}
              >
                {ll.cta}
              </a>
            </div>
          </div>
        )}

        {/* Ligne décorative haut */}
        <div
          className="absolute top-0 left-12 right-12 h-px"
          style={{ background: `linear-gradient(to right, transparent, color-mix(in srgb, ${accent} 30%, transparent), transparent)` }}
        />

        {/* En-tête */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className={`text-base font-bold ${titleColor} tracking-tight flex items-center gap-2`}
            >
              <Briefcase size={15} style={{ color: accent }} />
              {l.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`text-xs ${subtitleColor} mt-0.5 tracking-wide`}
            >
              {l.subtitle}
            </motion.p>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0"
            style={{
              background: `color-mix(in srgb, ${accent} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
              color: accent,
            }}
          >
            {l.proBadge}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">

          {/* Ligne 1 : Nom + Entreprise */}
          <div className="flex gap-2">
            <motion.input
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.42, duration: 0.45 }}
              type="text"
              placeholder={l.placeholderNom}
              value={form.nom}
              onChange={set('nom')}
              autoComplete="name"
              className={`flex-1 min-w-0 px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 ${inputCls}`}
            />
            <motion.input
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.46, duration: 0.45 }}
              type="text"
              placeholder={l.placeholderEntreprise}
              value={form.entreprise}
              onChange={set('entreprise')}
              autoComplete="organization"
              className={`flex-1 min-w-0 px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 ${inputCls}`}
            />
          </div>

          {/* Ligne 2 : Type de collab + Budget */}
          <div className="flex gap-2">
            <motion.select
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.45 }}
              value={form.typeCollab}
              onChange={set('typeCollab')}
              className={`flex-1 min-w-0 px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 ${inputCls}`}
            >
              <option value="">{l.placeholderType}</option>
              {COLLAB_TYPES[language].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </motion.select>
            <motion.select
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.54, duration: 0.45 }}
              value={form.budget}
              onChange={set('budget')}
              className={`flex-1 min-w-0 px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 ${inputCls}`}
            >
              <option value="">{l.placeholderBudget}</option>
              {BUDGETS[language].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </motion.select>
          </div>

          {/* Contact */}
          <motion.input
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.45 }}
            type="text"
            placeholder={l.placeholderContact}
            value={form.contact}
            onChange={set('contact')}
            autoComplete="email"
            className={`w-full px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 ${inputCls}`}
          />

          {/* Message optionnel */}
          <motion.textarea
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.61, duration: 0.45 }}
            placeholder={l.placeholderMessage}
            value={form.message}
            onChange={set('message')}
            rows={2}
            className={`w-full px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 resize-none ${inputCls}`}
          />

          {/* Bouton submit */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.64, duration: 0.45 }}
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            style={{
              background: `linear-gradient(to right, ${accent}, color-mix(in srgb, ${accent} 75%, black))`,
              boxShadow: `0 8px 24px color-mix(in srgb, ${accent} 25%, transparent)`,
            }}
          >
            <Briefcase
              size={15}
              className={`transition-transform duration-300 ${isLoading ? 'animate-spin' : 'group-hover:scale-110'}`}
            />
            {isLoading ? l.loading : l.cta}
          </motion.button>
        </form>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className={`mt-3 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium border ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {feedback.type === 'success'
                ? <Check size={15} className="shrink-0" />
                : <AlertCircle size={15} className="shrink-0" />}
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ligne décorative bas */}
        <div
          className="absolute bottom-0 left-12 right-12 h-px"
          style={{ background: `linear-gradient(to right, transparent, color-mix(in srgb, ${accent} 20%, transparent), transparent)` }}
        />
      </div>
    </motion.div>
  );
}
