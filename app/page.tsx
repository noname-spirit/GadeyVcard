'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Instagram, Youtube, Globe, Send, Check, AlertCircle, RotateCw, ScanLine, X, Phone, Mail, MessageCircle, Sun, Moon } from 'lucide-react';
import { useDeviceDetection, getDeviceClasses, getImageSize } from '@/lib/useDeviceDetection';

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
    scanQR: 'Scanner un QR',
    scanTitle: 'Scanner le QR Code',
    scanHint: 'Placez le QR code devant la caméra',
    scanSuccess: 'QR détecté ! Contact enregistré.',
    scanError: 'Impossible d\'accéder à la caméra',
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
    scanQR: 'Scan a QR',
    scanTitle: 'Scan QR Code',
    scanHint: 'Place the QR code in front of the camera',
    scanSuccess: 'QR detected! Contact saved.',
    scanError: 'Unable to access camera',
    successMessage: 'Thank you! Your information has been saved.',
    errorMessage: 'An error occurred. Please try again.',
    loading: 'Sending...',
  },
};

export default function SmartVCard() {
  const [language, setLanguage] = useState<Language>('en');
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({ nom: '', email: '', telephone: '', domaine: '', domaineCustom: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [contactData, setContactData] = useState<Record<string, string>>({});
  const [showScanner, setShowScanner] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrScannerRef = useRef<any>(null);
  const [isDark, setIsDark] = useState(true);

  // Device detection
  const device = useDeviceDetection();

  const t = translations[language];

  // Compute freshness badge based on contact data
  const getFreshnessBadge = () => {
    if (!contactData.updatedAt) return null;
    const days = Math.floor((Date.now() - new Date(contactData.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 7) return { label: language === 'fr' ? 'à jour' : 'up to date', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    if (days <= 30) return { label: language === 'fr' ? 'récent' : 'recent', color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' };
    return { label: language === 'fr' ? 'obsolète' : 'outdated', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' };
  };
  const freshnessBadge = getFreshnessBadge();

  // Detect browser language on mount
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang === 'fr') {
      setLanguage('fr');
    }
  }, []);

  // Theme: detect from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Theme: sync to document background
  useEffect(() => {
    const bg = isDark ? '#09090b' : '#fafafa';
    document.documentElement.style.background = bg;
    document.body.style.background = isDark
      ? 'linear-gradient(to bottom right, #09090b, #0a0a0a, #09090b)'
      : '#fafafa';
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  // Fetch contact data for dynamic links
  useEffect(() => {
    fetch('/api/contact')
      .then(res => res.json())
      .then(json => { if (json.data) setContactData(json.data); })
      .catch(() => { });
  }, []);

  // QR Scanner
  const stopScanner = useCallback(async () => {
    if (html5QrScannerRef.current) {
      try {
        await html5QrScannerRef.current.stop();
        html5QrScannerRef.current.clear();
      } catch { /* ignore */ }
      html5QrScannerRef.current = null;
    }
    setScannerReady(false);
  }, []);

  const startScanner = useCallback(async () => {
    setShowScanner(true);
    setScannerReady(false);
    // Dynamic import to avoid SSR issues
    const { Html5Qrcode } = await import('html5-qrcode');

    // Wait for DOM element
    await new Promise(r => setTimeout(r, 300));

    const scannerId = 'qr-scanner-region';
    const el = document.getElementById(scannerId);
    if (!el) return;

    const scanner = new Html5Qrcode(scannerId);
    html5QrScannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText: string) => {
          // QR detected — stop scanner and save as lead
          await scanner.stop();
          scanner.clear();
          html5QrScannerRef.current = null;
          setShowScanner(false);
          setScannerReady(false);

          // Save scanned QR as lead
          try {
            await fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: '[QR Scan]',
                contact: decodedText,
                language: language,
              }),
            });
            setFeedback({ type: 'success', message: t.scanSuccess });
          } catch {
            setFeedback({ type: 'error', message: t.errorMessage });
          }
          setTimeout(() => setFeedback({ type: null, message: '' }), 4000);
        },
        () => { /* ignore scan errors */ }
      );
      setScannerReady(true);
    } catch {
      setFeedback({ type: 'error', message: t.scanError });
      setShowScanner(false);
      setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
    }
  }, [language, t]);

  const closeScanner = useCallback(async () => {
    await stopScanner();
    setShowScanner(false);
  }, [stopScanner]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom.trim() || !formData.email.trim() || !formData.telephone.trim() || (!formData.domaine.trim() && !formData.domaineCustom.trim())) {
      setFeedback({
        type: 'error',
        message: language === 'fr' ? 'Tous les champs sont requis.' : 'All fields are required.',
      });
      setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
      return;
    }

    setIsLoading(true);

    try {
      // Save lead via API
      const domaineValue = formData.domaine === 'autre' ? formData.domaineCustom : formData.domaine;
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          domaine: domaineValue,
          source: 'formulaire',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setFeedback({ type: 'error', message: errorData.error || t.errorMessage });
        setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
        return;
      }

      setFeedback({ type: 'success', message: t.successMessage });
      setFormData({ nom: '', email: '', telephone: '', domaine: '', domaineCustom: '' });

      // Trigger Meta Pixel event (if configured)
      if (window.fbq) {
        window.fbq('track', 'Lead');
      }

      setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
    } catch (err) {
      setFeedback({ type: 'error', message: t.errorMessage });
      setTimeout(() => setFeedback({ type: null, message: '' }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Download vCard / Open Contact
  const downloadVCard = async () => {
    setIsSavingContact(true);

    // Detect platform using userAgent (more reliable than device hook for this)
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    try {
      if (isIOS) {
        // iOS: window.location.href with inline VCF opens Contacts directly
        window.location.href = '/api/contact/vcf';
      } else if (isAndroid) {
        // Android: Download the file, user must tap notification to import
        const response = await fetch('/api/contact/vcf');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'Contact.vcf';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show feedback message for Android users
        setFeedback({
          type: 'success',
          message: language === 'fr'
            ? '📥 Fichier téléchargé ! Appuyez sur la notification pour ajouter le contact.'
            : '📥 File downloaded! Tap the notification to add contact.',
        });
        setTimeout(() => setFeedback({ type: null, message: '' }), 5000);
      } else {
        // Desktop: simple download
        const a = document.createElement('a');
        a.href = '/api/contact/vcf';
        a.download = 'Contact.vcf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading vCard:', error);
      // Fallback
      window.location.href = '/api/contact/vcf';
    }

    // Reset loading state
    setTimeout(() => {
      setIsSavingContact(false);
    }, 500);

    // Trigger Meta Pixel event
    if (window.fbq) {
      window.fbq('track', 'Download');
    }
  };

  // Get QR Code URL (pointing to the current domain)
  const [qrUrl, setQrUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setQrUrl(window.location.href);
    }
  }, []);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };



  // Theme color tokens
  const c = {
    pageBg: isDark ? 'from-zinc-950 via-black to-zinc-950' : 'from-zinc-50 via-white to-zinc-50',
    pageText: isDark ? 'text-white' : 'text-zinc-900',
    titleGradient: isDark ? 'from-white via-white to-zinc-400' : 'from-zinc-900 via-zinc-800 to-zinc-500',
    langBg: isDark ? 'bg-zinc-900/60 border-zinc-800/40' : 'bg-zinc-100/80 border-zinc-300/40',
    langInactive: isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700',
    subtitle: isDark ? 'text-zinc-500' : 'text-zinc-400',
    cardBg: isDark ? 'from-zinc-900 via-zinc-900/95 to-black border-zinc-800/60' : 'from-white via-zinc-50 to-zinc-100 border-zinc-200/80',
    cardShadow: isDark ? 'shadow-2xl shadow-orange-500/5' : 'shadow-xl shadow-zinc-300/40',
    nameColor: isDark ? 'text-white' : 'text-zinc-900',
    socialBtn: isDark
      ? 'bg-zinc-800/50 hover:bg-orange-500/15 border-zinc-700/30 hover:border-orange-500/40'
      : 'bg-zinc-100 hover:bg-orange-500/10 border-zinc-200 hover:border-orange-500/40',
    socialIcon: isDark ? 'text-zinc-300 hover:text-orange-400' : 'text-zinc-500 hover:text-orange-500',
    actionCall: isDark
      ? 'bg-zinc-800/50 hover:bg-emerald-500/15 border-zinc-700/30 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400'
      : 'bg-zinc-100 hover:bg-emerald-500/10 border-zinc-200 hover:border-emerald-500/40 text-zinc-600 hover:text-emerald-500',
    actionMail: isDark
      ? 'bg-zinc-800/50 hover:bg-blue-500/15 border-zinc-700/30 hover:border-blue-500/40 text-zinc-300 hover:text-blue-400'
      : 'bg-zinc-100 hover:bg-blue-500/10 border-zinc-200 hover:border-blue-500/40 text-zinc-600 hover:text-blue-500',
    actionWhatsapp: isDark
      ? 'bg-zinc-800/50 hover:bg-green-500/15 border-zinc-700/30 hover:border-green-500/40 text-zinc-300 hover:text-green-400'
      : 'bg-zinc-100 hover:bg-green-500/10 border-zinc-200 hover:border-green-500/40 text-zinc-600 hover:text-green-500',
    qrText: isDark ? 'text-zinc-300' : 'text-zinc-600',
    qrSubtext: isDark ? 'text-zinc-500' : 'text-zinc-400',
    flipBtn: isDark
      ? 'text-zinc-400 hover:text-white border-zinc-800/40 hover:border-zinc-700/60 hover:bg-zinc-900/30'
      : 'text-zinc-500 hover:text-zinc-900 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100',
    formBg: isDark ? 'from-zinc-900/60 via-zinc-900/40 to-black/80 border-zinc-800/40' : 'from-white/90 via-zinc-50/70 to-zinc-100/60 border-zinc-200/80',
    formTitle: isDark ? 'text-white' : 'text-zinc-900',
    formSubtitle: isDark ? 'text-zinc-500' : 'text-zinc-400',
    inputBg: isDark
      ? 'bg-zinc-900/60 text-white placeholder-zinc-600 border-zinc-800/40'
      : 'bg-white/80 text-zinc-900 placeholder-zinc-400 border-zinc-200',
    scanBtn: isDark
      ? 'bg-zinc-800/60 hover:bg-zinc-700/60 border-zinc-700/40 hover:border-orange-500/30 text-zinc-300 hover:text-orange-400'
      : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 hover:border-orange-500/30 text-zinc-500 hover:text-orange-500',
    scanOverlay: isDark ? 'bg-black/80' : 'bg-black/50',
    scanModal: isDark ? 'bg-zinc-900 border-zinc-800/60' : 'bg-white border-zinc-200',
    scanTitle: isDark ? 'text-white' : 'text-zinc-900',
    scanClose: isDark ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100',
    scanHint: isDark ? 'text-zinc-500' : 'text-zinc-400',
    footerText: isDark ? 'text-zinc-600' : 'text-zinc-400',
    footerLink: isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-zinc-400 hover:text-zinc-600',
    toggleBtn: isDark
      ? 'bg-zinc-900/60 border-zinc-800/40 text-zinc-400 hover:text-orange-400'
      : 'bg-zinc-100/80 border-zinc-300/40 text-zinc-500 hover:text-orange-500',
  };

  return (
    <div className={`bg-linear-to-br ${c.pageBg} ${c.pageText} h-screen w-screen overflow-hidden transition-colors duration-300 flex flex-col`}>
      {/* Meta Pixel Script — ID validated to prevent XSS */}
      {/^[0-9]+$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID || '') && (
        <script
          dangerouslySetInnerHTML={{
            __html: [
              '!function(f,b,e,v,n,t,s)',
              '{if(f.fbq)return;n=f.fbq=function(){n.callMethod?',
              'n.callMethod.apply(n,arguments):n.queue.push(arguments)};',
              'if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";',
              'n.queue=[];t=b.createElement(e);t.async=!0;',
              't.src=v;s=b.getElementsByTagName(e)[0];',
              's.parentNode.insertBefore(t,s)}(window, document,"script",',
              '"https://connect.facebook.net/en_US/fbevents.js");',
              `fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');`,
              "fbq('track', 'PageView');",
            ].join('\n'),
          }}
        />
      )}

      <div className={`flex flex-col items-center w-full h-screen overflow-y-auto ${getDeviceClasses(device.screenSize, 'container')} ${getDeviceClasses(device.screenSize, 'gap')} transition-all duration-300`}>
        {/* Header - 12% */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-center ${getDeviceClasses(device.screenSize, 'header')} flex flex-col items-center transition-all`}
        >
          <div className="flex items-center gap-2 sm:gap-4 justify-center">
            <h1 className={`${getDeviceClasses(device.screenSize, 'titleSize')} font-bold bg-linear-to-r ${c.titleGradient} bg-clip-text text-transparent tracking-tight transition-all`}>
              {t.title}
            </h1>
            {/* Language Selector */}
            <div className={`flex gap-1 ${c.langBg} rounded-full px-1.5 py-1 border backdrop-blur-xl transition-colors duration-300`}>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${language === 'fr' ? 'bg-orange-500/15 text-orange-400' : c.langInactive
                  }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${language === 'en' ? 'bg-orange-500/15 text-orange-400' : c.langInactive
                  }`}
              >
                EN
              </button>
              <button
                onClick={toggleTheme}
                className={`px-2 py-1 rounded-full transition-all duration-200 ${c.toggleBtn}`}
                title={isDark ? 'Mode clair' : 'Mode sombre'}
              >
                {isDark ? <Sun size={12} /> : <Moon size={12} />}
              </button>
            </div>
          </div>
          <p className={`text-sm ${c.subtitle} font-medium tracking-wide`}>{t.subtitle}</p>
        </motion.div>

        {/* 3D Flip Card */}
        <motion.div
          initial={cardVariants.initial}
          animate={cardVariants.animate}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-md"
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
              className="w-full h-full relative min-h-100"
            >
              {/* Front Face - Identity */}
              <motion.div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className="absolute w-full h-full"
              >
                <div className={`w-full h-full bg-linear-to-br ${c.cardBg} rounded-3xl px-2 sm:px-4 py-2 sm:pb-0 border backdrop-blur-2xl ${c.cardShadow} flex flex-col items-center justify-center transition-colors duration-300`}>
                  {/* Decorative Top Line */}
                  <div className="absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent mt-2" />

                  {/* Decorative Top Line */}
                  <div className="absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent mt-2" />

                  {/* Content Wrapper with Gap */}
                  <div className={`flex flex-col items-center w-full ${getDeviceClasses(device.screenSize, 'gap')} transition-all duration-300`}>
                    {/* Profile Photo */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="relative"
                    >
                      <div className={`${getDeviceClasses(device.screenSize, 'photoSize')} rounded-full                      git add . && git commit -m "fix: use text/x-vcard for better iOS compatibility" && git push bg-linear-to-br from-orange-400 via-orange-500 to-orange-600 p-0.75 flex items-center justify-center shadow-lg shadow-orange-500/30 relative`}>
                        <div className="absolute inset-0 rounded-full bg-linear-to-br from-orange-500/20 to-transparent blur-xl" />
                        <Image
                          src="/noname-spirit.jpg"
                          alt="Profile"
                          width={getImageSize(device.screenSize)}
                          height={getImageSize(device.screenSize)}
                          className="w-full h-full rounded-full object-cover relative z-10"
                        />
                      </div>
                    </motion.div>

                    {/* Name & Title */}
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <h2 className={`${getDeviceClasses(device.screenSize, 'titleSize')} font-bold ${c.nameColor} tracking-tight transition-all`}>Nonames-spirit</h2>
                      {freshnessBadge && (
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${freshnessBadge.color}`}>
                          {freshnessBadge.label}
                        </span>
                      )}
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                      className="text-center text-orange-400/80 font-medium text-xs tracking-widest uppercase"
                    >
                      {contactData.title || (language === 'fr' ? 'Titre / Poste non spécifié' : 'Title / Position not specified')}
                    </motion.p>

                    {/* Social Icons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="flex justify-center gap-3"
                    >
                      {[
                        { href: contactData.instagram || 'https://instagram.com', icon: Instagram, label: 'Instagram' },
                        { href: contactData.youtube || 'https://youtube.com', icon: Youtube, label: 'YouTube' },
                        { href: contactData.url || '#', icon: Globe, label: 'Website' },
                      ].filter(s => s.href && s.href !== '#').map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.15, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-1.5 rounded-full ${c.socialBtn} border transition-all duration-300`}
                        >
                          <social.icon size={20} className={`${c.socialIcon} transition-colors`} />
                        </motion.a>
                      ))}
                    </motion.div>

                    {/* Quick Action Buttons */}
                    {(contactData.tel_mobile || contactData.email_personal || contactData.email_work || contactData.whatsapp) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.32, duration: 0.5 }}
                        className="flex justify-center gap-2 w-full"
                      >
                        {contactData.tel_mobile && (
                          <a
                            href={`tel:${contactData.tel_mobile}`}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl ${c.actionCall} border transition-all duration-300 text-xs font-medium`}
                          >
                            <Phone size={14} />
                            {language === 'fr' ? 'Appeler' : 'Call'}
                          </a>
                        )}
                        {(contactData.email_personal || contactData.email_work) && (
                          <a
                            href={`mailto:${contactData.email_personal || contactData.email_work}`}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl ${c.actionMail} border transition-all duration-300 text-xs font-medium`}
                          >
                            <Mail size={14} />
                            Email
                          </a>
                        )}
                        {contactData.whatsapp && (
                          <a
                            href={`https://wa.me/${contactData.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl ${c.actionWhatsapp} border transition-all duration-300 text-xs font-medium`}
                          >
                            <MessageCircle size={14} />
                            WhatsApp
                          </a>
                        )}
                      </motion.div>
                    )}

                    {/* Save Contact Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      onClick={downloadVCard}
                      disabled={isSavingContact}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download size={19} className={`transition-transform ${isSavingContact ? 'animate-spin' : 'group-hover:translate-y-0.5'}`} />
                      {isSavingContact ? (language === 'fr' ? 'Ajout en cours...' : 'Adding...') : t.saveContact}
                    </motion.button>

                    {/* Mobile instruction hint - hidden on desktop */}
                    <p className={`text-center text-[10px] ${c.subtitle} mt-1 md:hidden`}>
                      {language === 'fr'
                        ? '📱 Après téléchargement, ouvrez le fichier pour ajouter le contact'
                        : '📱 After download, open the file to add contact'}
                    </p>
                  </div>

                  {/* Decorative Bottom Line */}
                  <div className="absolute bottom-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent mb-6" />
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
                <div className={`w-full h-full bg-linear-to-br ${c.cardBg} rounded-3xl p-10 border backdrop-blur-2xl ${c.cardShadow} flex flex-col items-center justify-center transition-colors duration-300`}>

                  {/* QR Content Wrapper with Gap */}
                  <div className="flex flex-col items-center w-full gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-center"
                    >
                      <p className={`${c.qrText} font-medium text-sm mb-1`}>
                        {language === 'fr' ? '📱 Scannez avec votre appareil' : '📱 Scan with your device'}
                      </p>
                      <p className={`${c.qrSubtext} text-xs`}>
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
                      {qrUrl && <QRCodeSVG value={qrUrl} size={200} level="H" />}
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className={`text-center ${c.qrSubtext} text-xs`}
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
            className={`w-full py-1 rounded-2xl font-medium text-sm ${c.flipBtn} transition-all duration-300 flex items-center justify-center gap-2 border`}
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
          className="w-full max-w-md"
        >
          <div className={`relative bg-linear-to-br ${c.formBg} rounded-3xl ${getDeviceClasses(device.screenSize, 'formContainer')} border backdrop-blur-2xl ${c.cardShadow} transition-colors duration-300`}>
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />

            <motion.h3
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`${getDeviceClasses(device.screenSize, 'formTitle')} font-bold text-center ${c.formTitle} tracking-tight transition-all`}
            >
              {t.exchangeTitle}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className={`text-center ${c.formSubtitle} mb-4 text-xs tracking-wide`}
            >
              {t.exchangeSubtitle}
            </motion.p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 relative">
              {/* Ligne 1 : nom et email */}
              <div className="flex gap-2 w-full">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="flex-1">
                  <motion.input
                    type="text"
                    placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(234, 88, 12, 0.2)' }}
                    className={`w-full px-5 py-1 ${c.inputBg} text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 font-medium`}
                  />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.5 }} className="flex-1">
                  <motion.input
                    type="email"
                    placeholder={language === 'fr' ? 'Votre email' : 'Your email'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(234, 88, 12, 0.2)' }}
                    className={`w-full px-5 py-1 ${c.inputBg} text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 font-medium`}
                  />
                </motion.div>
              </div>
              {/* Ligne 2 : domaine et téléphone */}
              <div className="flex gap-2 w-full">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="flex-1">
                  <select
                    value={formData.domaine}
                    onChange={e => setFormData({ ...formData, domaine: e.target.value })}
                    className={`w-full px-5 py-1 ${c.inputBg} text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 font-medium`}
                  >
                    <option value="">{language === 'fr' ? 'Sélectionnez un domaine' : 'Select a domain'}</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Santé">Santé</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Immobilier">Immobilier</option>
                    <option value="Art">Art</option>
                    <option value="Tourisme">Tourisme</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Autre">Autre</option>
                  </select>
                  {formData.domaine === 'Autre' && (
                    <input
                      type="text"
                      placeholder={language === 'fr' ? 'Votre domaine' : 'Your domain'}
                      value={formData.domaineCustom}
                      onChange={e => setFormData({ ...formData, domaineCustom: e.target.value })}
                      className={`mt-2 w-full px-5 py-1 ${c.inputBg} text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 font-medium`}
                    />
                  )}
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.5 }} className="flex-1">
                  <motion.input
                    type="tel"
                    placeholder={language === 'fr' ? 'Votre téléphone' : 'Your phone'}
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(234, 88, 12, 0.2)' }}
                    className={`w-full px-5 py-1 ${c.inputBg} text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 font-medium`}
                  />
                </motion.div>
              </div>
              {/* Nom Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.input
                  type="text"
                  placeholder={language === 'fr' ? 'Votre nom' : 'Your name'}
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(234, 88, 12, 0.2)' }}
                  className={`w-full px-5 py-1 ${c.inputBg} text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 font-medium`}
                />
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <motion.input
                  type="email"
                  placeholder={language === 'fr' ? 'Votre email' : 'Your email'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(234, 88, 12, 0.2)' }}
                  className={`w-full px-5 py-1 ${c.inputBg} text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 font-medium`}
                />
              </motion.div>

              {/* Téléphone Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.input
                  type="tel"
                  placeholder={language === 'fr' ? 'Votre téléphone' : 'Your phone'}
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(234, 88, 12, 0.2)' }}
                  className={`w-full px-5 py-1 ${c.inputBg} text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all duration-300 font-medium`}
                />
              </motion.div>

              {/* Buttons Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-full flex gap-2 mt-1"
              >
                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none group"
                >
                  <Send size={17} className={`transition-transform duration-300 ${isLoading ? 'animate-spin' : 'group-hover:translate-x-1'}`} />
                  {isLoading ? t.loading : t.formSubmit}
                </motion.button>

                {/* Scan QR Button */}
                <motion.button
                  type="button"
                  onClick={startScanner}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`py-2 px-3 ${c.scanBtn} border rounded-xl font-medium text-sm flex items-center justify-center gap-1.5 transition-all duration-300`}
                  title={t.scanQR}
                >
                  <ScanLine size={17} />
                  <span className="hidden sm:inline text-xs">{t.scanQR}</span>
                </motion.button>
              </motion.div>
              {/* Confirmation visuelle */}
              <AnimatePresence>
                {feedback.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute left-0 right-0 -top-10 mx-auto w-full flex items-center justify-center z-10`}
                  >
                    <div
                      className={`px-4 py-2 rounded-xl font-semibold text-sm shadow-lg border transition-all duration-300
                        ${feedback.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-600' : 'bg-red-500/90 text-white border-red-600'}`}
                    >
                      {feedback.type === 'success' ? <Check size={16} className="inline mr-2" /> : <AlertCircle size={16} className="inline mr-2" />}
                      {feedback.message}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* QR Scanner Modal */}
            <AnimatePresence>
              {showScanner && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`fixed inset-0 z-50 ${c.scanOverlay} backdrop-blur-sm flex items-center justify-center p-6`}
                  onClick={closeScanner}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className={`${c.scanModal} rounded-2xl border p-5 w-full max-w-sm`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-sm font-bold ${c.scanTitle}`}>{t.scanTitle}</h3>
                      <button
                        onClick={closeScanner}
                        className={`p-1 rounded-lg ${c.scanClose} transition-all`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div
                      id="qr-scanner-region"
                      ref={scannerRef}
                      className="w-full rounded-xl overflow-hidden bg-black"
                    />
                    <p className={`${c.scanHint} text-xs text-center mt-3`}>
                      {scannerReady ? t.scanHint : (language === 'fr' ? 'Chargement de la caméra...' : 'Loading camera...')}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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
                    <Check size={20} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
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
          <p className={`${c.footerText} text-xs font-medium tracking-wider`}>
            {language === 'fr'
              ? '© 2026 Noname-spirit. Tous droits réservés.'
              : '© 2026 Noname-spirit. All rights reserved.'}
          </p>
          <a
            href="/admin"
            className={`inline-block mt-2 ${c.footerLink} text-xs transition-colors duration-200`}
          >
            {language === 'fr' ? 'Accéder à mon compte' : 'Access my account'}
          </a>
        </motion.div>
      </div>
    </div>
  );
}

