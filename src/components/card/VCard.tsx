'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';
import type { CardData, CardTheme, CardLanguage } from '@/types/card';

const flipLabels = {
  fr: { qrCode: 'Voir QR Code', back: 'Retour au profil' },
  en: { qrCode: 'Show QR Code', back: 'Back to Profile' },
  th: { qrCode: 'ดู QR โค้ด', back: 'กลับหน้าโปรไฟล์' },
};

interface VCardProps {
  card: CardData;
  theme: CardTheme;
  language: CardLanguage;
  onSaveContact: () => void;
  isSaving?: boolean;
}

export function VCard({ card, theme, language, onSaveContact, isSaving }: VCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const dark = theme === 'dark';
  const l = flipLabels[language];
  const accent = card.accentColor || '#f97316';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrUrl(`${window.location.origin}/${card.slug}`);
    }
  }, [card.slug]);

  const freshnessBadge = (() => {
    if (!card.updatedAt) return null;
    const days = Math.floor((Date.now() - new Date(card.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 7) return { label: language === 'fr' ? 'à jour' : 'up to date', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    if (days <= 30) return { label: language === 'fr' ? 'récent' : 'recent', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' };
    return { label: language === 'fr' ? 'obsolète' : 'outdated', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' };
  })();

  const flipBtn = dark
    ? 'text-zinc-400 hover:text-white border-zinc-800/40 hover:border-zinc-700/60 hover:bg-zinc-900/30'
    : 'text-zinc-500 hover:text-zinc-900 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="w-full max-w-md"
      // Injection de --accent pour toute la carte
      style={{
        perspective: '1200px',
        '--accent': accent,
      } as React.CSSProperties}
    >
      {/* Styles hover scopés à cette carte */}
      <style>{`
        .vcard-${card.id} .card-social-btn:hover {
          background: color-mix(in srgb, var(--accent) 15%, transparent);
          border-color: color-mix(in srgb, var(--accent) 40%, transparent);
        }
        .vcard-${card.id} .card-social-icon:hover {
          color: var(--accent);
        }
      `}</style>

      <div className={`vcard-${card.id}`}>
        {/* Flip container — min-h assez grand pour tout le contenu CardFront */}
        <div className="relative w-full min-h-107.5">
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'center' }}
            className="w-full h-full relative min-h-107.5"
          >
            {/* Front */}
            <motion.div
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
              className="absolute w-full h-full"
            >
              <CardFront
                card={card}
                theme={theme}
                language={language}
                isSaving={isSaving}
                freshnessBadge={freshnessBadge}
                onSaveContact={onSaveContact}
              />
            </motion.div>

            {/* Back */}
            <motion.div
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}
              className="absolute w-full h-full"
            >
              <CardBack qrUrl={qrUrl} theme={theme} language={language} />
            </motion.div>
          </motion.div>
        </div>

        {/* Flip button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onClick={() => setIsFlipped(!isFlipped)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full mt-2 py-1 rounded-2xl font-medium text-sm ${flipBtn} transition-all duration-300 flex items-center justify-center gap-2 border`}
        >
          <RotateCw size={18} className={`transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
          {isFlipped ? l.back : l.qrCode}
        </motion.button>
      </div>
    </motion.div>
  );
}
