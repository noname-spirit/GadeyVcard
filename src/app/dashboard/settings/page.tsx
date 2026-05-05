"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Save,
  ExternalLink,
  Palette,
  User,
  Link2,
  Bell,
  ArrowLeft,
  LogOut,
  Lock,
  Zap,
  Copy,
  Check,
  CalendarDays,
  CircleDot,
  Download,
  QrCode,
} from "lucide-react";
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from "@/components/ui/Button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { VCard } from "@/components/card";
import { CardFrontInfluencer } from "@/components/card/CardFrontInfluencer";
import { LeadCaptureForm } from "@/components/card/LeadCaptureForm";
import { LeadCaptureFormInfluencer } from "@/components/card/LeadCaptureFormInfluencer";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { getCardsByUid, upsertCard } from "@/lib/supabase/cards";
import { getProfile } from "@/lib/supabase/profile";
import { LockedFeature } from "@/components/ui/LockedFeature";

const TABS = [
  { id: "profile", label: "Profil", icon: User },
  { id: "links", label: "Liens", icon: Link2 },
  { id: "design", label: "Design", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "pro", label: "Pro", icon: Zap },
] as const;

type Tab = (typeof TABS)[number]["id"];

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-zinc-400 font-medium">{label}</label>
      <div className="flex">
        {prefix && (
          <span className="px-3 py-2.5 bg-zinc-800 border border-r-0 border-zinc-700/40 rounded-l-xl text-zinc-500 text-sm shrink-0">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            "w-full px-4 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 text-zinc-100",
            "placeholder:text-zinc-500 outline-none transition-all",
            "focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20",
            prefix ? "rounded-r-xl" : "rounded-xl",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

const TEMPLATES = [
  {
    id: "dark",
    label: "Freelance Dark",
    bg: "from-zinc-900 to-black",
    text: "text-white",
    pro: false,
  },
  {
    id: "light",
    label: "Freelance Light",
    bg: "from-zinc-100 to-white",
    text: "text-zinc-800",
    pro: false,
  },
  {
    id: "color",
    label: "Freelance Color",
    bg: "from-orange-500 to-orange-700",
    text: "text-white",
    pro: false,
  },
  {
    id: "influencer",
    label: "Influenceur",
    bg: "from-purple-600 to-violet-800",
    text: "text-white",
    pro: true,
  },
  {
    id: "restaurant",
    label: "Restaurant",
    bg: "from-emerald-700 to-emerald-900",
    text: "text-white",
    pro: true,
  },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const { uid } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [line, setLine] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  const [template, setTemplate] = useState<
    "dark" | "light" | "color" | "influencer"
  >("dark");
  const [accent, setAccent] = useState("#f97316");
  const [notifLead, setNotifLead] = useState(true);
  const [notifView, setNotifView] = useState(false);
  const [photo, setphoto] = useState("");
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [availabilityText, setAvailabilityText] = useState("");
  const [copiedSignature, setCopiedSignature] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'starter' | 'pro' | 'business'>('free');
  const isPro = userPlan === 'pro' || userPlan === 'business';
  const canExportQr = userPlan !== 'free';

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smartvcard.app';
  const cardUrl = `${appUrl}/${slug}`;

  const handleDownloadQr = () => {
    const canvas = document.getElementById('qr-export-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `qrcode-${slug || 'carte'}.png`;
    link.click();
  };

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('vcard_settings') || '{}');
    localStorage.setItem('vcard_settings', JSON.stringify({ ...current, template, accent }));
  }, [template, accent]);
  useEffect(() => {
    if (!uid) return;
    getProfile().then((profile) => {
      if (profile) setUserPlan(profile.plan ?? 'free');
    }).catch(() => {});
    getCardsByUid(uid).then((cards) => {
      if (cards.length === 0) return;
      const c = cards[0];
      setName(c.name ?? "");
      setTitle(c.title ?? "");
      setSlug(c.slug ?? "");
      setPhone(c.phone ?? "");
      setEmail(c.email ?? "");
      setWhatsapp(c.whatsapp ?? "");
      setInstagram(c.instagram ?? "");
      setYoutube(c.youtube ?? "");
      setLinkedin(c.linkedin ?? "");
      setLine(c.line_contact ?? "");
      setTiktok(c.tiktok ?? "");
      setTwitter(c.twitter ?? "");
      setWebsite(c.website ?? "");
      setTemplate((c.template as "dark" | "light" | "color" | "influencer") ?? "dark");
      setAccent(c.accent_color ?? "#f97316");
      setphoto(c.photo ?? "");
      setCalendlyUrl(c.calendly_url ?? "");
      setAvailabilityStatus(c.availability_status ?? "");
      setAvailabilityText(c.availability_text ?? "");
    }).catch(() => {});
  }, [uid]);

  const handleSave = async () => {
    if (!slug || !uid) return;
    setSaving(true);
    try {
      await upsertCard(uid, {
        slug,
        name,
        title,
        photo: photo || '',
        contact: { phone: phone || null, email: email || null, whatsapp: whatsapp || null, line: line || null },
        socials: { instagram: instagram || null, youtube: youtube || null, linkedin: linkedin || null, tiktok: tiktok || null, twitter: twitter || null, website: website || null },
        accent_color: accent,
        template,
        calendly_url: calendlyUrl || null,
        availability_status: availabilityStatus || null,
        availability_text: availabilityText || null,
      });
      localStorage.setItem('vcard_settings', JSON.stringify({ name, title, slug, phone, email, whatsapp, instagram, website, template, accent }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Erreur lors de la sauvegarde :', e);
    } finally {
      setSaving(false);
    }
  };

  const previewCard = {
    id: 'preview',
    slug: 'preview',
    name,
    title,
    photo: photo || '',
    socials: { instagram: instagram || undefined, youtube: youtube || undefined, linkedin: linkedin || undefined, tiktok: tiktok || undefined, twitter: twitter || undefined, website: website || undefined },
    contact: { phone: phone || undefined, email: email || undefined, whatsapp: whatsapp || undefined, line: line || undefined },
    accentColor: accent,
    template,
  };

  return (
    <DashboardLayout active="Paramètres">
      <div className="flex flex-col xl:flex-row gap-8 items-start">

      {/* Colonne formulaire */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors w-fit"
            >
              <ArrowLeft size={13} />
              Retour au dashboard
            </Link>
            <h2 className="text-xl lg:text-2xl font-bold text-white">
              Paramètres
            </h2>
            <Link
              href={`/${slug}`}
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-orange-400 transition-colors"
            >
              <ExternalLink size={11} />
              vcard.app/{slug}
            </Link>
          </div>
          <Button
            onClick={handleSave}
            loading={saving}
            size="sm"
            className="flex items-center gap-2 self-start sm:self-auto"
          >
            <Save size={14} />
            {saved ? "Sauvegardé ✓" : "Sauvegarder"}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800/60 rounded-2xl p-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                tab === t.id
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-200",
              ].join(" ")}
            >
              <t.icon size={14} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-5"
        >
          {tab === "profile" && (
            <>
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                  Identité
                </h3>
                <Field
                  label="Nom complet"
                  value={name}
                  onChange={setName}
                  placeholder="Kevin Durand"
                />
                <Field
                  label="Titre / Métier"
                  value={title}
                  onChange={setTitle}
                  placeholder="Graphiste & Brand Designer"
                />
                <Field
                  label="URL"
                  value={slug}
                  onChange={(v) =>
                    setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                  }
                  placeholder="votre-nom"
                  prefix="vcard.app/"
                />
              </div>
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                  Photo de profil
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full shrink-0 overflow-hidden border border-zinc-700/40 bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    {photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-white">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <input
                      type="text"
                      value={photo}
                      onChange={(e) => setphoto(e.target.value)}
                      placeholder="https://exemple.com/photo.jpg"
                      className="w-full px-3 py-2 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                    />
                    <p className="text-xs text-zinc-500">URL publique de l&apos;image · sauvegardée avec le bouton ci-dessus</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-zinc-600 hover:text-red-400 transition-colors w-fit"
              >
                <LogOut size={14} />
                Se déconnecter
              </button>
            </>
          )}

          {tab === "links" && (
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                Contact & Réseaux
              </h3>
              <Field
                label="Téléphone"
                value={phone}
                onChange={setPhone}
                type="tel"
              />
              <Field
                label="Email"
                value={email}
                onChange={setEmail}
                type="email"
              />
              <Field
                label="WhatsApp"
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder="+33 6 …"
              />
              <Field
                label="Instagram"
                value={instagram}
                onChange={setInstagram}
                prefix="IG"
              />
              <Field
                label="YouTube"
                value={youtube}
                onChange={setYoutube}
                prefix="YT"
              />
              <Field
                label="LinkedIn"
                value={linkedin}
                onChange={setLinkedin}
                prefix="in"
              />
              <Field
                label="TikTok"
                value={tiktok}
                onChange={setTiktok}
                prefix="TK"
              />
              <Field
                label="Twitter / X"
                value={twitter}
                onChange={setTwitter}
                prefix="X"
              />
              <Field
                label="LINE"
                value={line}
                onChange={setLine}
                prefix="LINE"
              />
              <Field
                label="Site web"
                value={website}
                onChange={setWebsite}
                prefix="🌐"
              />
            </div>
          )}

          {tab === 'design' && (
            <div className="flex flex-col gap-5">
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Template</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => t.pro ? router.push('/dashboard/upgrade') : setTemplate(t.id as typeof template)}
                      className={[
                        `relative h-20 rounded-xl bg-linear-to-br ${t.bg} border-2 transition-all flex flex-col items-start justify-end p-2.5 overflow-hidden`,
                        !t.pro && template === t.id ? 'border-orange-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100',
                        t.pro ? 'cursor-pointer' : '',
                      ].join(' ')}
                    >
                      <span className={`text-xs font-semibold ${t.text} leading-tight`}>{t.label}</span>
                      {t.pro && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                          <Lock size={9} className="text-amber-400" />
                          <span className="text-[10px] font-bold text-amber-400">Pro</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {isPro ? (
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Couleur d&apos;accent</h3>
                  <div className="flex items-center gap-3">
                    <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-10 h-10 rounded-lg border border-zinc-700/40 bg-zinc-800 cursor-pointer" />
                    <span className="text-zinc-400 text-sm font-mono">{accent}</span>
                    <button onClick={() => setAccent('#f97316')} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Reset</button>
                  </div>
                </div>
              ) : (
                <LockedFeature plan="pro" label="Couleur d'accent personnalisée" desc="Choisissez la couleur de votre marque pour toute votre carte">
                  <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3 min-h-48">
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Couleur d&apos;accent</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500 border border-zinc-700/40" />
                      <span className="text-zinc-400 text-sm font-mono">#f97316</span>
                    </div>
                  </div>
                </LockedFeature>
              )}

              {/* QR Code export */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <QrCode size={14} className="text-orange-400" />
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">QR Code</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="bg-white rounded-xl p-3 shrink-0">
                    <QRCodeCanvas
                      id="qr-export-canvas"
                      value={cardUrl || 'https://smartvcard.app'}
                      size={140}
                      level="H"
                      marginSize={1}
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <p className="text-xs text-zinc-400 break-all font-mono">{cardUrl}</p>
                    <p className="text-xs text-zinc-600">PNG haute résolution · fond blanc · niveau de correction H</p>
                    {canExportQr ? (
                      <button
                        onClick={handleDownloadQr}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/40 rounded-xl text-zinc-300 hover:text-white transition-all w-fit mt-1"
                      >
                        <Download size={13} />
                        Télécharger PNG
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => router.push('/dashboard/upgrade')}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-800/50 border border-zinc-700/40 rounded-xl text-zinc-500 cursor-pointer hover:border-orange-500/40 hover:text-zinc-300 transition-all w-fit"
                        >
                          <Lock size={11} className="text-orange-400" />
                          Télécharger PNG
                        </button>
                        <span className="text-[11px] text-orange-400 font-medium">Plan Starter</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "pro" && !isPro && (
            <LockedFeature
              plan="pro"
              label="Fonctionnalités Pro"
              desc="Calendly · Statut de disponibilité · Signature email"
            >
              <div className="flex flex-col gap-5">
                {/* Calendly preview */}
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-orange-400" />
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Lien Calendly</p>
                  </div>
                  <div className="w-full px-4 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-500">
                    https://calendly.com/votre-nom
                  </div>
                </div>
                {/* Disponibilité preview */}
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Statut de disponibilité</p>
                  <div className="flex flex-col gap-2">
                    {['🟢 Disponible pour de nouveaux projets', '🟡 Occupé — contactez-moi quand même', '🔴 Indisponible pour le moment'].map((l) => (
                      <div key={l} className="px-4 py-3 rounded-xl border border-zinc-700/40 bg-zinc-800/40 text-sm text-zinc-400">{l}</div>
                    ))}
                  </div>
                </div>
                {/* Signature preview */}
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Signature email</p>
                  <div className="bg-zinc-950 border border-zinc-800/40 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500 shrink-0" />
                    <div className="flex flex-col gap-1">
                      <div className="h-2.5 w-24 bg-zinc-700 rounded-full" />
                      <div className="h-2 w-16 bg-zinc-800 rounded-full" />
                      <div className="h-2 w-32 bg-orange-500/30 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </LockedFeature>
          )}

          {tab === "pro" && isPro && (
            <div className="flex flex-col gap-5">

              {/* Calendly */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-orange-400" />
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Lien Calendly</h3>
                </div>
                <p className="text-xs text-zinc-500">Un bouton &quot;Prendre RDV&quot; s&apos;affichera sur votre carte.</p>
                <Field label="URL Calendly" value={calendlyUrl} onChange={setCalendlyUrl}
                  placeholder="https://calendly.com/votre-nom" type="url" />
              </div>

              {/* Disponibilité */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <CircleDot size={14} className="text-emerald-400" />
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Statut de disponibilité</h3>
                </div>
                <p className="text-xs text-zinc-500">Affiché sur votre carte publique en temps réel.</p>
                <div className="flex flex-col gap-3">
                  {[
                    { value: 'available', label: '🟢 Disponible pour de nouveaux projets' },
                    { value: 'busy', label: '🟡 Occupé — contactez-moi quand même' },
                    { value: 'unavailable', label: '🔴 Indisponible pour le moment' },
                  ].map((opt) => (
                    <button key={opt.value} onClick={() => setAvailabilityStatus(availabilityStatus === opt.value ? '' : opt.value)}
                      className={['flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left',
                        availabilityStatus === opt.value
                          ? 'border-orange-500/40 bg-orange-500/10 text-orange-300'
                          : 'border-zinc-700/40 bg-zinc-800/40 text-zinc-400 hover:border-zinc-600/60',
                      ].join(' ')}>
                      {opt.label}
                    </button>
                  ))}
                  <Field label="Texte personnalisé (optionnel)" value={availabilityText}
                    onChange={setAvailabilityText} placeholder="Ex: Complet jusqu'en juillet" />
                </div>
              </div>

              {/* Signature email */}
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" />
                    <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Signature email</h3>
                  </div>
                  <button
                    onClick={() => {
                      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartvcard.app';
                      const html = `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif"><tr><td style="padding-right:16px;vertical-align:top">${photo ? `<img src="${photo}" width="56" height="56" style="border-radius:50%;display:block" alt="${name}" />` : `<div style="width:56px;height:56px;border-radius:50%;background:#f97316;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:bold;color:#fff">${name.charAt(0).toUpperCase()}</div>`}</td><td style="vertical-align:top"><strong style="font-size:14px;color:#18181b">${name}</strong><br/><span style="font-size:12px;color:#71717a">${title}</span><br/><a href="${appUrl}/${slug}" style="font-size:12px;color:#f97316;text-decoration:none">${appUrl}/${slug}</a>${calendlyUrl ? `<br/><a href="${calendlyUrl}" style="font-size:12px;color:#f97316;text-decoration:none">📅 Prendre RDV</a>` : ''}</td></tr></table>`;
                      navigator.clipboard.writeText(html).then(() => {
                        setCopiedSignature(true);
                        setTimeout(() => setCopiedSignature(false), 2000);
                      });
                    }}
                    className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {copiedSignature ? <><Check size={12} className="text-emerald-400" />Copié !</> : <><Copy size={12} />Copier le HTML</>}
                  </button>
                </div>
                <p className="text-xs text-zinc-500">Collez ce code HTML dans votre signature Gmail / Outlook.</p>
                <div className="bg-zinc-950 border border-zinc-800/40 rounded-xl p-4">
                  <table cellPadding={0} cellSpacing={0} style={{ fontFamily: 'Arial, sans-serif' }}>
                    <tbody><tr>
                      <td style={{ paddingRight: 12, verticalAlign: 'top' }}>
                        {photo
                          ? <img src={photo} width={48} height={48} style={{ borderRadius: '50%' }} alt={name} />
                          : <div style={{ width: 48, height: 48, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>{name.charAt(0).toUpperCase()}</div>
                        }
                      </td>
                      <td style={{ verticalAlign: 'top' }}>
                        <strong style={{ fontSize: 13, color: '#f4f4f5' }}>{name || 'Votre Nom'}</strong><br />
                        <span style={{ fontSize: 11, color: '#71717a' }}>{title || 'Votre titre'}</span><br />
                        <a href={`/${slug}`} style={{ fontSize: 11, color: '#f97316' }}>smartvcard.app/{slug || 'votre-nom'}</a>
                        {calendlyUrl && <><br /><a href={calendlyUrl} style={{ fontSize: 11, color: '#f97316' }}>📅 Prendre RDV</a></>}
                      </td>
                    </tr></tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="relative bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-5 opacity-50 pointer-events-none select-none">
              <div className="absolute inset-0 rounded-2xl z-10 flex items-center justify-center">
                <span className="text-xs font-medium text-zinc-500 bg-zinc-900/90 border border-zinc-700/40 px-3 py-1.5 rounded-full">Bientôt disponible</span>
              </div>
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                Alertes email
              </h3>
              {[
                {
                  label: "Nouveau lead",
                  sub: "Quand quelqu'un remplit votre formulaire",
                  value: false,
                },
                {
                  label: "Vues carte",
                  sub: "Résumé hebdomadaire des visites",
                  value: false,
                },
              ].map((n) => (
                <div
                  key={n.label}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {n.label}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{n.sub}</p>
                  </div>
                  <div className="relative w-11 h-6 rounded-full border bg-zinc-800 border-zinc-700/40 shrink-0">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-zinc-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>{/* fin colonne formulaire */}

      {/* Colonne aperçu persistante */}
      <div className="xl:w-80 w-full flex flex-col gap-3 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto xl:pb-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Aperçu en direct</p>
        {template === 'influencer' ? (
          <div style={{ '--accent': accent } as React.CSSProperties} className="flex flex-col gap-2">
            <CardFrontInfluencer
              card={{
                id: 'preview',
                slug: 'preview',
                name,
                handle: `@${slug || 'votre-pseudo'}`,
                niche: title || 'Votre niche · Lifestyle · Créatif',
                photo: '/noname-spirit.jpg',
                stats: { followers: '—', engagement: '—', collab: '—' },
                links: { instagram: instagram || undefined, website: website || undefined },
                accentColor: accent,
              }}
              theme="dark"
              language="fr"
              onSaveContact={() => {}}
            />
            <LeadCaptureFormInfluencer
              card={{ ...previewCard, template: 'influencer' }}
              theme="dark"
              language="fr"
              locked={userPlan === 'free'}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <VCard
              card={previewCard}
              theme={template === 'light' ? 'light' : 'dark'}
              language="fr"
              onSaveContact={() => {}}
            />
            <LeadCaptureForm
              card={previewCard}
              theme={template === 'light' ? 'light' : 'dark'}
              language="fr"
              locked={userPlan === 'free'}
            />
          </div>
        )}
        <a
          href={`/${slug}`}
          target="_blank"
          className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-orange-400 transition-colors py-2"
        >
          <ExternalLink size={11} />
          Voir ma carte en ligne
        </a>
      </div>

      </div>{/* fin flex row */}
    </DashboardLayout>
  );
}
