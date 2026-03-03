'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Instagram, Youtube, Globe, Send, Check, AlertCircle, RotateCw, Heart } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Type declaration for Meta Pixel
declare global {
  interface Window {
    fbq: (action: string, event: string, data?: Record<string, unknown>) => void;
  }
}

type Language = 'fr' | 'en';

const translations = {
  fr: {
    title: 'Smart vCard',
    subtitle: 'Partager mes coordonnées élégamment',
    viewQR: 'Voir QR Code',
    saveContact: 'Enregistrer le contact',
    exchangeTitle: 'Échangeons nos contacts',
    exchangeSubtitle: 'Restez connecté',
    formName: 'Votre nom',
    formContact: 'Email ou Line ID',
    formSubmit: 'Envoyer',
    successMessage: 'Merci ! Vos informations ont été enregistrées.',
    errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
    loading: 'Envoi en cours...',
  },
  en: {
    title: 'Smart vCard',
    subtitle: 'Share my contact information elegantly',
    viewQR: 'See QR Code',
    saveContact: 'Save Contact',
    exchangeTitle: "Let's Connect",
    exchangeSubtitle: 'Stay connected',
    formName: 'Your Name',
    formContact: 'Email or Line ID',
    formSubmit: 'Send',
    successMessage: 'Thank you! Your information has been saved.',
    errorMessage: 'An error occurred. Please try again.',
    loading: 'Sending...',
  },
};

export default function SmartVCard() {
  const [language, setLanguage] = useState<Language>('en');
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const t = translations[language];

  // Detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang === 'fr') {
      setLanguage('fr');
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      setFeedback({
        type: 'error',
        message: language === 'fr' ? 'Tous les champs sont requis.' : 'All fields are required.',
      });
      setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
      return;
    }

    setIsLoading(true);

    try {
      // Save to Firebase Firestore
      await addDoc(collection(db, 'leads'), {
        name: formData.name,
        contact: formData.contact,
        timestamp: serverTimestamp(),
        language: language,
      });

      setFeedback({ type: 'success', message: t.successMessage });
      setFormData({ name: '', contact: '' });

      // Trigger Meta Pixel event (if configured)
      if (window.fbq) {
        window.fbq('track', 'Lead');
      }

      setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
    } catch (error) {
      setFeedback({ type: 'error', message: t.errorMessage });
      setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Download vCard
  const downloadVCard = () => {
    // Download dynamically generated VCF from API
    const link = document.createElement('a');
    link.href = '/api/contact/vcf';
    link.download = 'Contact.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Trigger Meta Pixel event
    if (window.fbq) {
      window.fbq('track', 'Download');
    }
  };

  // Get QR Code URL (pointing to the current domain)
  const qrUrl = typeof window !== 'undefined' ? window.location.href : 'https://smart-vcard.vercel.app';

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const flipVariants = {
    flipToQR: {
      rotateY: 180,
      transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
    },
    flipToFront: {
      rotateY: 0,
      transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
    },
  };

  return (
    <div className="bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white min-h-screen overflow-x-hidden">
      {/* Meta Pixel Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID || ''}');
            fbq('track', 'PageView');
          `,
        }}
      />

      <div className="flex flex-col items-center w-full px-6 pt-2 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-3 flex flex-col items-center gap-1"
        >
          <div className="flex items-center gap-4 justify-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
              {t.title}
            </h1>
            {/* Language Selector */}
            <div className="flex gap-1 bg-zinc-900/60 rounded-full px-1.5 py-1 border border-zinc-800/40 backdrop-blur-xl">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${language === 'fr' ? 'bg-orange-500/15 text-orange-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${language === 'en' ? 'bg-orange-500/15 text-orange-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                EN
              </button>
            </div>
          </div>
          <p className="text-sm text-zinc-500 font-medium tracking-wide">{t.subtitle}</p>
        </motion.div>

        {/* 3D Flip Card */}
        <motion.div
          initial={cardVariants.initial}
          animate={cardVariants.animate}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-0 w-full max-w-md"
          style={{
            perspective: '1200px',
          }}
        >
          <div className="relative w-full min-h-96">
            {/* 3D Card Transform */}
            <motion.div
              animate={{
                rotateY: isFlipped ? 180 : 0,
              }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center',
              }}
              className="w-full h-full relative [min-height:400px]"
            >
              {/* Front Face - Identity */}
              <motion.div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className="absolute w-full h-full"
              >
                <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-black rounded-3xl px-4 pb-0 border border-zinc-800/60 backdrop-blur-2xl shadow-2xl shadow-orange-500/5 flex flex-col items-center justify-center">
                  {/* Decorative Top Line */}
                  <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent mt-2" />

                  {/* Content Wrapper with Gap */}
                  <div className="flex flex-col items-center w-full gap-5">
                    {/* Profile Photo */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="relative"
                    >
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 p-[3px] flex items-center justify-center shadow-lg shadow-orange-500/30 relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/20 to-transparent blur-xl" />
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative z-10">
                          <span className="text-5xl font-bold bg-gradient-to-br from-orange-400 to-orange-300 bg-clip-text text-transparent">L</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-zinc-900 shadow-lg" />
                    </motion.div>

                    {/* Name & Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-2xl font-bold text-white text-center tracking-tight"
                    >
                      Nonames-spirit
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                      className="text-center text-orange-400/80 font-medium text-xs tracking-widest uppercase"
                    >
                      Designer & Stratège Marketing
                    </motion.p>

                    {/* Social Icons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="flex justify-center gap-3"
                    >
                      {[
                        { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
                        { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
                        { href: 'https://example.com', icon: Globe, label: 'Website' },
                      ].map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.15, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1.5 rounded-full bg-zinc-800/50 hover:bg-orange-500/15 border border-zinc-700/30 hover:border-orange-500/40 transition-all duration-300"
                        >
                          <social.icon size={20} className="text-zinc-300 hover:text-orange-400 transition-colors" />
                        </motion.a>
                      ))}
                    </motion.div>

                    {/* Save Contact Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      onClick={downloadVCard}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 group"
                    >
                      <Download size={19} className="group-hover:translate-y-0.5 transition-transform" />
                      {t.saveContact}
                    </motion.button>
                  </div>

                  {/* Decorative Bottom Line */}
                  <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent mb-6" />
                </div>
              </motion.div>

              {/* Back Face - QR Code */}
              <motion.div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className="absolute w-full h-full"
              >
                <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-black rounded-3xl p-10 border border-zinc-800/60 backdrop-blur-2xl shadow-2xl shadow-orange-500/5 flex flex-col items-center justify-center">

                  {/* QR Content Wrapper with Gap */}
                  <div className="flex flex-col items-center w-full gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-center"
                    >
                      <p className="text-zinc-300 font-medium text-sm mb-1">
                        {language === 'fr' ? '📱 Scannez avec votre appareil' : '📱 Scan with your device'}
                      </p>
                      <p className="text-zinc-500 text-xs">
                        {language === 'fr' ? 'Accès instantané au profil' : 'Instant profile access'}
                      </p>
                    </motion.div>

                    {/* QR Code Container */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mx-auto w-11/12 flex justify-center"
                    >
                      <QRCodeSVG value={qrUrl} size={200} level="H" />
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-center text-zinc-500 text-xs"
                    >
                      {language === 'fr' ? '✓ URL disponible et vérifiée' : '✓ Valid and verified URL'}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Flip Button with Icon */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onClick={() => setIsFlipped(!isFlipped)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-1 rounded-2xl font-medium text-sm text-zinc-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 border border-zinc-800/40 hover:border-zinc-700/60 hover:bg-zinc-900/30 "
          >
            <RotateCw size={18} className={`transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
            {isFlipped ? (language === 'fr' ? 'Retour au profil' : 'Back to Profile') : t.viewQR}
          </motion.button>
        </motion.div>

        {/* Lead Capture Form */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md "
        >
          <div className="relative bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-black/80 rounded-3xl px-6 border border-zinc-800/40 backdrop-blur-2xl shadow-2xl shadow-orange-500/5 pt-5 pb-2">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl font-bold mb-2 text-center text-white tracking-tight"
            >
              {t.exchangeTitle}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-center text-zinc-500 mb-4 text-xs tracking-wide"
            >
              {t.exchangeSubtitle}
            </motion.p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.input
                  type="text"
                  placeholder={t.formName}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(234, 88, 12, 0.2)' }}
                  className="w-full px-5 py-1 bg-zinc-900/60 text-white text-sm placeholder-zinc-600 rounded-xl border border-zinc-800/40 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 font-medium"
                />
              </motion.div>

              {/* Contact Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <motion.input
                  type="text"
                  placeholder={t.formContact}
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(234, 88, 12, 0.2)' }}
                  className="w-full px-5 py-1 bg-zinc-900/60 text-white text-sm placeholder-zinc-600 rounded-xl border border-zinc-800/40 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 font-medium"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none group mt-1"
              >
                <Send size={19} className={`transition-transform duration-300 ${isLoading ? 'animate-spin' : 'group-hover:translate-x-1'}`} />
                {isLoading ? t.loading : t.formSubmit}
              </motion.button>
            </form>

            {/* Feedback Message */}
            {feedback.type && (
              <motion.div
                initial={{ opacity: 0, y: -15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`mt-6 mx-6 p-4 rounded-xl flex items-start gap-3 border backdrop-blur-sm text-sm ${feedback.type === 'success'
                  ? 'bg-green-500/10 border-green-500/40 text-green-300 shadow-lg shadow-green-500/10'
                  : 'bg-red-500/10 border-red-500/40 text-red-300 shadow-lg shadow-red-500/10'
                  }`}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  {feedback.type === 'success' ? (
                    <Check size={20} className="mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                  )}
                </motion.div>
                <span className="text-sm font-medium leading-relaxed flex-1">{feedback.message}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-0.2 text-center"
        >
          <p className="text-zinc-600 text-xs font-medium tracking-wider">
            {language === 'fr'
              ? '© 2026 Noname-spirit. Tous droits réservés.'
              : '© 2026 Noname-spirit. All rights reserved.'}
          </p>
          <a
            href="/admin"
            className="inline-block mt-2 text-zinc-600 hover:text-zinc-400 text-xs transition-colors duration-200"
          >
            {language === 'fr' ? 'Accéder à mon compte' : 'Access my account'}
          </a>
        </motion.div>
      </div>
    </div>
  );
}

