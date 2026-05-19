'use client';

import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import type { CardTheme, CardLanguage } from '@/types/card';

const labels = {
  fr: { scan: 'Scanner QR', verified: '✓ URL disponible et vérifiée' },
  en: { scan: 'Scan QR', verified: '✓ Valid and verified URL' },
  th: { scan: 'สแกน QR', verified: '✓ URL ที่ตรวจสอบแล้ว' },
};

interface CardBackProps {
  qrUrl: string;
  theme: CardTheme;
  language: CardLanguage;
}

export function CardBack({ qrUrl, theme, language }: CardBackProps) {
  const dark = theme === 'dark';
  const l = labels[language];

  const cardBg = dark
    ? 'from-zinc-900 via-zinc-900/95 to-black border-zinc-800/60'
    : 'from-white via-zinc-50 to-zinc-100 border-zinc-200/80';
  const cardShadow = dark ? 'shadow-2xl shadow-orange-500/5' : 'shadow-xl shadow-zinc-300/40';
  const qrText = dark ? 'text-zinc-300' : 'text-zinc-600';
  const qrSubtext = dark ? 'text-zinc-500' : 'text-zinc-400';

  return (
    <div className={`w-full h-full bg-linear-to-br ${cardBg} rounded-3xl p-10 border backdrop-blur-2xl ${cardShadow} flex flex-col items-center justify-center gap-6 transition-colors duration-300 relative`}>

      {/* Logo brand discret en coin (sceau) */}
      <Image
        src={dark ? '/logo/logo-icon-white.svg' : '/logo/logo-icon-black.svg'}
        alt="vCard"
        width={80}
        height={80}
        className="absolute top-3 right-3 w-20 h-20 opacity-50 hover:opacity-90 transition-opacity"
      />

      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`${qrText} font-medium text-sm`}
      >
        {l.scan}
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {qrUrl && <QRCodeSVG value={qrUrl} size={200} level="H" />}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className={`text-center ${qrSubtext} text-xs`}
      >
        {l.verified}
      </motion.p>
    </div>
  );
}
