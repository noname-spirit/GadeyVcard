'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, AlertCircle, ScanLine, X, Lock } from 'lucide-react';
import type { CardData, CardTheme, CardLanguage } from '@/types/card';
import type { LeadFormData } from '@/types/lead';
import Link from 'next/link';

const SECTEURS = [
  'Café', 'Villa', 'E-commerce', 'Marketing', 'Coaching',
  'Finance', 'Santé', 'Éducation', 'Immobilier', 'Art',
  'Tourisme', 'Commerce', 'Informatique', 'Autre',
];

const labels = {
  fr: {
    defaultTitle: 'Restons en contact',
    defaultSubtitle: 'Laissez vos coordonnées — je reviens vers vous sous 24h',
    defaultCta: 'Envoyer mes coordonnées',
    placeholderNom: 'Votre nom',
    placeholderContact: 'WhatsApp, LINE ou Email',
    placeholderTelephone: 'Téléphone',
    placeholderDomaine: 'Votre secteur',
    placeholderDomaineCustom: 'Précisez votre secteur',
    placeholderMessage: 'Votre demande (optionnel)',
    loading: 'Envoi en cours...',
    success: 'Reçu ! Je vous recontacte très vite.',
    successScan: 'Contact scanné et enregistré !',
    errorRequired: 'Nom et contact sont obligatoires.',
    errorServer: 'Une erreur est survenue. Réessayez.',
    errorCamera: 'Impossible d\'accéder à la caméra.',
    proBadge: 'Starter',
    scanBtn: 'Scanner QR',
    scanTitle: 'Scanner une vCard',
    scanHintLoading: 'Chargement de la caméra...',
    scanHint: 'Pointez la caméra vers un QR code ou une vCard',
    industryPopupTitle: 'Secteur manquant',
    industryPopupMessage: 'Veuillez sélectionner votre secteur d\'activité avant d\'envoyer.',
    industryPopupCta: 'Sélectionner',
  },
  en: {
    defaultTitle: "Let's stay in touch",
    defaultSubtitle: "Leave your details — I'll get back to you within 24h",
    defaultCta: 'Send my details',
    placeholderNom: 'Your name',
    placeholderContact: 'WhatsApp, LINE or Email',
    placeholderTelephone: 'Phone',
    placeholderDomaine: 'Your industry',
    placeholderDomaineCustom: 'Specify your industry',
    placeholderMessage: 'Your request (optional)',
    loading: 'Sending...',
    success: "Got it! I'll reach out to you shortly.",
    successScan: 'Contact scanned and saved!',
    errorRequired: 'Name and contact are required.',
    errorServer: 'Something went wrong. Please retry.',
    errorCamera: 'Could not access the camera.',
    proBadge: 'Starter',
    scanBtn: 'Scan QR',
    scanTitle: 'Scan a vCard',
    scanHintLoading: 'Loading camera...',
    scanHint: 'Point the camera at a QR code or vCard',
    industryPopupTitle: 'Industry missing',
    industryPopupMessage: 'Please select your industry before sending.',
    industryPopupCta: 'Select',
  },
  th: {
    defaultTitle: 'ติดต่อกันไว้นะ',
    defaultSubtitle: 'ฝากข้อมูลไว้ — ผมจะติดต่อกลับภายใน 24 ชม.',
    defaultCta: 'ส่งข้อมูลของฉัน',
    placeholderNom: 'ชื่อของคุณ',
    placeholderContact: 'WhatsApp, LINE หรือ อีเมล',
    placeholderTelephone: 'โทรศัพท์',
    placeholderDomaine: 'ประเภทธุรกิจ',
    placeholderDomaineCustom: 'ระบุประเภทธุรกิจ',
    placeholderMessage: 'คำถาม / ข้อความ (ไม่บังคับ)',
    loading: 'กำลังส่ง...',
    success: 'ได้รับแล้ว! ผมจะติดต่อกลับโดยเร็วที่สุด',
    successScan: 'สแกนและบันทึกข้อมูลแล้ว!',
    errorRequired: 'กรุณากรอกชื่อและช่องทางติดต่อ',
    errorServer: 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง',
    errorCamera: 'ไม่สามารถเข้าถึงกล้องได้',
    proBadge: 'Starter',
    scanBtn: 'สแกน QR',
    scanTitle: 'สแกน vCard',
    scanHintLoading: 'กำลังโหลดกล้อง...',
    scanHint: 'ชี้กล้องไปที่ QR โค้ดหรือ vCard',
    industryPopupTitle: 'ไม่ได้เลือกประเภทธุรกิจ',
    industryPopupMessage: 'กรุณาเลือกประเภทธุรกิจก่อนส่งข้อมูล',
    industryPopupCta: 'เลือก',
  },
};

const EMPTY_FORM: LeadFormData = {
  nom: '', contact: '', telephone: '', domaine: '', domaineCustom: '', message: '',
};

// Parse vCard text → extraire nom, contact, telephone, domaine, message
function parseQrPayload(raw: string): { nom: string; contact: string; telephone: string; domaine: string; message: string } {
  let nom = '', contact = '', telephone = '', domaine = '', message = '';

  if (raw.startsWith('BEGIN:VCARD')) {
    for (const line of raw.split(/\r?\n/)) {
      if (line.startsWith('FN:')) nom = line.slice(3).trim();
      else if (line.startsWith('EMAIL')) contact = line.split(':')[1]?.trim() || contact;
      else if (line.startsWith('TEL')) telephone = line.split(':')[1]?.trim() || telephone;
      else if (line.startsWith('ORG:')) domaine = line.slice(4).trim();
      else if (line.startsWith('NOTE:')) message = line.slice(5).trim();
    }
  } else {
    try {
      const obj = JSON.parse(raw);
      nom = obj.nom || obj.name || '';
      contact = obj.contact || obj.email || '';
      telephone = obj.telephone || obj.phone || '';
      domaine = obj.domaine || '';
      message = obj.message || obj.note || '';
    } catch {
      nom = '[QR Scan]';
      message = /^https?:\/\//.test(raw) ? raw : '';
    }
  }

  return { nom, contact, telephone, domaine, message };
}

const lockedLabels = {
  fr: { message: 'Disponible à partir du plan Starter', cta: 'Passer au plan Starter' },
  en: { message: 'Available from the Starter plan', cta: 'Upgrade to Starter' },
  th: { message: 'ใช้ได้ตั้งแต่แพ็คเกจ Starter', cta: 'อัปเกรดเป็น Starter' },
};

interface LeadCaptureFormProps {
  card: CardData;
  theme: CardTheme;
  language: CardLanguage;
  locked?: boolean;
}

export function LeadCaptureForm({ card, theme, language, locked = false }: LeadCaptureFormProps) {
  const [form, setForm] = useState<LeadFormData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showIndustryPopup, setShowIndustryPopup] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html5QrRef = useRef<any>(null);

  const dark = theme === 'dark';
  const l = labels[language];
  const accent = card.accentColor || '#f97316';
  const planBadgeLabel = card.plan === 'business' ? 'Business' : card.plan === 'pro' ? 'Pro' : l.proBadge;

  const title = card.captureForm?.title || l.defaultTitle;
  const subtitle = card.captureForm?.subtitle || l.defaultSubtitle;
  const ctaLabel = card.captureForm?.ctaLabel || l.defaultCta;

  const cardBg = dark
    ? 'from-zinc-900/70 via-zinc-900/50 to-black/80 border-zinc-800/40'
    : 'from-white/90 via-zinc-50/70 to-zinc-100/60 border-zinc-200/80';
  const cardShadow = dark ? 'shadow-2xl shadow-black/40' : 'shadow-xl shadow-zinc-300/40';
  const titleColor = dark ? 'text-white' : 'text-zinc-900';
  const subtitleColor = dark ? 'text-zinc-500' : 'text-zinc-400';
  const inputCls = dark
    ? 'bg-zinc-900/60 text-white placeholder-zinc-600 border-zinc-800/40 focus:ring-2'
    : 'bg-white/80 text-zinc-900 placeholder-zinc-400 border-zinc-200 focus:ring-2';
  const scanBtnCls = dark
    ? 'bg-zinc-800/60 hover:bg-zinc-700/60 border-zinc-700/40 text-zinc-300 hover:text-white'
    : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-500 hover:text-zinc-900';
  const modalBg = dark ? 'bg-zinc-900 border-zinc-800/60' : 'bg-white border-zinc-200';
  const modalTitle = dark ? 'text-white' : 'text-zinc-900';
  const modalHint = dark ? 'text-zinc-500' : 'text-zinc-400';
  const closeBtn = dark ? 'text-zinc-500 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100';

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // ── SCANNER ──────────────────────────────────────────────────────────
  const stopScanner = useCallback(async () => {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch { /* ignore */ }
      html5QrRef.current = null;
    }
    setScannerReady(false);
  }, []);

  const closeScanner = useCallback(async () => {
    await stopScanner();
    setShowScanner(false);
  }, [stopScanner]);

  const startScanner = useCallback(async () => {
    setShowScanner(true);
    setScannerReady(false);

    const { Html5Qrcode } = await import('html5-qrcode');
    await new Promise((r) => setTimeout(r, 300));

    const el = document.getElementById('vcard-qr-scanner');
    if (!el) return;

    const scanner = new Html5Qrcode('vcard-qr-scanner');
    html5QrRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decodedText: string) => {
          await scanner.stop();
          scanner.clear();
          html5QrRef.current = null;
          setShowScanner(false);
          setScannerReady(false);

          const parsed = parseQrPayload(decodedText);
               console.log(parsed, "parsed QR data");
          try {
            await fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                card_id: card.id,
                ...parsed,
              }),
            });
            showFeedback('success', l.successScan);
          } catch {
            showFeedback('error', l.errorServer);
          }
        },
        () => { /* ignore frame errors */ }
      );
      setScannerReady(true);
    } catch {
      showFeedback('error', l.errorCamera);
      setShowScanner(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.slug, language, l]);

  // ── SUBMIT FORM ───────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nom.trim() || !form.contact.trim()) {
      showFeedback('error', l.errorRequired);
      return;
    }

    if (!form.domaine.trim()) {
      setShowIndustryPopup(true);
      return;
    }

    setIsLoading(true);
    try {
      const domaineValue = form.domaine === 'Autre' ? form.domaineCustom : form.domaine;
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: card.id,
          nom: form.nom,
          contact: form.contact,
          telephone: form.telephone,
          domaine: domaineValue,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showFeedback('error', data.error || l.errorServer);
        return;
      }

      showFeedback('success', l.success);
      setForm(EMPTY_FORM);
    } catch {
      showFeedback('error', l.errorServer);
    } finally {
      setIsLoading(false);
    }
  };

  const set = (key: keyof LeadFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const ll = lockedLabels[language];

  // ── RENDER ────────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 }}
      className="w-full max-w-md"
      style={{ '--accent': accent } as React.CSSProperties}
    >
      <div className={`relative bg-linear-to-br ${cardBg} rounded-3xl p-5 border backdrop-blur-2xl ${cardShadow} transition-colors duration-300 ${locked ? 'select-none' : ''}`}>

        {/* Overlay plan locked */}
        {locked && (
          <div className="absolute inset-0 rounded-3xl z-10 flex flex-col items-center justify-center gap-3 backdrop-blur-sm bg-zinc-950/70">
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center">
                <Lock size={18} className="text-zinc-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-200">{ll.message}</p>
              <Link
                href="/dashboard/upgrade"
                className="mt-1 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                style={{ background: `linear-gradient(to right, ${accent}, color-mix(in srgb, ${accent} 75%, black))` }}
              >
                {ll.cta}
              </Link>
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
              className={`text-base font-bold ${titleColor} tracking-tight`}
            >
              {title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`text-xs ${subtitleColor} mt-0.5 tracking-wide`}
            >
              {subtitle}
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
            {planBadgeLabel}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">

          {/* Ligne 1 : Nom + Contact */}
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
              placeholder={l.placeholderContact}
              value={form.contact}
              onChange={set('contact')}
              autoComplete="email"
              className={`flex-1 min-w-0 px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 ${inputCls}`}
            />
          </div>

          {/* Ligne 2 : Secteur + Téléphone */}
          <div className="flex gap-2">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.45 }}
              className="flex-1 min-w-0 flex flex-col gap-1"
            >
              <select
                value={form.domaine}
                onChange={set('domaine')}
                className={`w-full px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 ${inputCls}`}
              >
                <option value="">{l.placeholderDomaine}</option>
                {SECTEURS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {form.domaine === 'Autre' && (
                <input
                  type="text"
                  placeholder={l.placeholderDomaineCustom}
                  value={form.domaineCustom}
                  onChange={set('domaineCustom')}
                  className={`w-full px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 ${inputCls}`}
                />
              )}
            </motion.div>
            <motion.input
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.54, duration: 0.45 }}
              type="tel"
              placeholder={l.placeholderTelephone}
              value={form.telephone}
              onChange={set('telephone')}
              autoComplete="tel"
              className={`flex-1 min-w-0 px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 ${inputCls}`}
            />
          </div>

          {/* Message optionnel */}
          <motion.textarea
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.45 }}
            placeholder={l.placeholderMessage}
            value={form.message}
            onChange={set('message')}
            rows={2}
            className={`w-full px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none transition-all duration-300 resize-none ${inputCls}`}
          />

          {/* Boutons : Submit + Scanner QR */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.45 }}
            className="flex gap-2"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              style={{
                background: `linear-gradient(to right, ${accent}, color-mix(in srgb, ${accent} 75%, black))`,
                boxShadow: `0 8px 24px color-mix(in srgb, ${accent} 25%, transparent)`,
              }}
            >
              <Send size={15} className={`transition-transform duration-300 ${isLoading ? 'animate-spin' : 'group-hover:translate-x-0.5'}`} />
              {isLoading ? l.loading : ctaLabel}
            </button>

            <button
              type="button"
              onClick={startScanner}
              title={l.scanBtn}
              className={`px-3.5 py-2.5 rounded-2xl border text-sm font-medium flex items-center gap-1.5 transition-all duration-300 ${scanBtnCls}`}
            >
              <ScanLine size={17} />
              <span className="hidden sm:inline text-xs">{l.scanBtn}</span>
            </button>
          </motion.div>
        </form>

        {/* Feedback toast */}
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

      {/* Modal industrie manquante */}
      <AnimatePresence>
        {showIndustryPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowIndustryPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className={`${modalBg} rounded-2xl border p-6 w-full max-w-xs shadow-2xl`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className={`text-sm font-bold ${modalTitle} flex items-center gap-2`}>
                  <AlertCircle size={16} style={{ color: accent }} />
                  {l.industryPopupTitle}
                </h3>
                <button
                  onClick={() => setShowIndustryPopup(false)}
                  className={`p-1.5 rounded-lg transition-all ${closeBtn}`}
                >
                  <X size={16} />
                </button>
              </div>
              <p className={`${modalHint} text-sm mb-5`}>{l.industryPopupMessage}</p>
              <button
                onClick={() => setShowIndustryPopup(false)}
                className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
                style={{
                  background: `linear-gradient(to right, ${accent}, color-mix(in srgb, ${accent} 75%, black))`,
                  boxShadow: `0 6px 20px color-mix(in srgb, ${accent} 25%, transparent)`,
                }}
              >
                {l.industryPopupCta}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal scanner QR */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={closeScanner}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className={`${modalBg} rounded-2xl border p-5 w-full max-w-sm shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${modalTitle} flex items-center gap-2`}>
                  <ScanLine size={16} style={{ color: accent }} />
                  {l.scanTitle}
                </h3>
                <button
                  onClick={closeScanner}
                  className={`p-1.5 rounded-lg transition-all ${closeBtn}`}
                >
                  <X size={16} />
                </button>
              </div>

              <div
                id="vcard-qr-scanner"
                ref={scannerRef}
                className="w-full rounded-xl overflow-hidden bg-black aspect-square"
              />

              <p className={`${modalHint} text-xs text-center mt-3`}>
                {scannerReady ? l.scanHint : l.scanHintLoading}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
