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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { VCard } from "@/components/card";
import { CardFrontInfluencer } from "@/components/card/CardFrontInfluencer";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { getCardsByUid } from "@/lib/firebase/get-cards";

const TABS = [
  { id: "profile", label: "Profil", icon: User },
  { id: "links", label: "Liens", icon: Link2 },
  { id: "design", label: "Design", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
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
    pro: false,
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
    await signOut(auth);
    router.push("/");
  };

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [template, setTemplate] = useState<
    "dark" | "light" | "color" | "influencer"
  >("dark");
  const [accent, setAccent] = useState("#f97316");
  const [notifLead, setNotifLead] = useState(true);
  const [notifView, setNotifView] = useState(false);
 const [photo, setphoto] = useState("");
  useEffect(() => {
    if (!uid) return;
    getCardsByUid(uid).then((cards) => {
      if (cards.length === 0) return;
      const c = cards[0];
      setName(c.name ?? "");
      setTitle(c.title ?? "");
      setSlug(c.slug ?? "");
      setPhone(c.contact?.phone ?? "");
      setEmail(c.contact?.email ?? "");
      setWhatsapp(c.contact?.whatsapp ?? "");
      setInstagram(c.socials?.instagram ?? "");
      setWebsite(c.socials?.website ?? "");
      setTemplate((c.template as "dark" | "light" | "color" | "influencer") ?? "dark");
      setAccent(c.accentColor ?? "#f97316");
      setphoto(c.photo ?? "");
    }).catch(() => {});
  }, [uid]);

  const handleSave = async () => {
    if (!slug) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'cards', slug), {
        name,
        title,
        contact: {
          phone: phone || null,
          email: email || null,
          whatsapp: whatsapp || null,
        },
        socials: {
          instagram: instagram || null,
          website: website || null,
        },
        photo: photo || null,
        template,
        accentColor: accent,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Erreur lors de la sauvegarde :', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout active="Paramètres">
      <div className="max-w-2xl flex flex-col gap-6">
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
                label="Site web"
                value={website}
                onChange={setWebsite}
                prefix="🌐"
              />
            </div>
          )}

          {tab === "design" && (
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Contrôles */}
              <div className="flex flex-col gap-5 flex-1">
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-4">
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                    Template
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() =>
                          t.pro
                            ? router.push("/dashboard/upgrade")
                            : setTemplate(t.id as typeof template)
                        }
                        className={[
                          `relative h-20 rounded-xl bg-linear-to-br ${t.bg} border-2 transition-all flex flex-col items-start justify-end p-2.5 overflow-hidden`,
                          !t.pro && template === t.id
                            ? "border-orange-500 scale-105"
                            : "border-transparent opacity-70 hover:opacity-100",
                          t.pro ? "cursor-pointer" : "",
                        ].join(" ")}
                      >
                        <span
                          className={`text-xs font-semibold ${t.text} leading-tight`}
                        >
                          {t.label}
                        </span>
                        {t.pro && (
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                            <Lock size={9} className="text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-400">
                              Pro
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                    Couleur d&apos;accent
                  </h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-zinc-700/40 bg-zinc-800 cursor-pointer"
                    />
                    <span className="text-zinc-400 text-sm font-mono">
                      {accent}
                    </span>
                    <button
                      onClick={() => setAccent("#f97316")}
                      className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview live */}
              <div className="flex flex-col gap-2 lg:w-72 w-full">
                <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">
                  Aperçu en direct
                </p>
                <div className="scale-90 origin-top">
                  {template === "influencer" ? (
                    <div style={{ "--accent": accent } as React.CSSProperties}>
                      <CardFrontInfluencer
                        card={{
                          id: "preview",
                          slug: "preview",
                          name,
                          handle: `@${slug || "votre-pseudo"}`,
                          niche: title || "Votre niche · Lifestyle · Créatif",
                          photo: "/noname-spirit.jpg",
                          stats: {
                            followers: "—",
                            engagement: "—",
                            collab: "—",
                          },
                          links: {
                            instagram: instagram || undefined,
                            website: website || undefined,
                          },
                          accentColor: accent,
                        }}
                        theme="dark"
                        language="fr"
                        onSaveContact={() => {}}
                      />
                    </div>
                  ) : (
                    <VCard
                      card={{
                        id: "preview",
                        slug: "preview",
                        name,
                        title,
                        photo: "/noname-spirit.jpg",
                        socials: {
                          instagram: instagram || undefined,
                          website: website || undefined,
                        },
                        contact: {
                          phone: phone || undefined,
                          email: email || undefined,
                        },
                        accentColor: accent,
                        template,
                      }}
                      theme={template === "light" ? "light" : "dark"}
                      language="fr"
                      onSaveContact={() => {}}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 flex flex-col gap-5">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                Alertes email
              </h3>
              {[
                {
                  label: "Nouveau lead",
                  sub: "Quand quelqu'un remplit votre formulaire",
                  value: notifLead,
                  set: setNotifLead,
                },
                {
                  label: "Vues carte",
                  sub: "Résumé hebdomadaire des visites",
                  value: notifView,
                  set: setNotifView,
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
                  <button
                    onClick={() => n.set(!n.value)}
                    className={`relative w-11 h-6 rounded-full border transition-all shrink-0 ${n.value ? "bg-orange-500/20 border-orange-500/40" : "bg-zinc-800 border-zinc-700/40"}`}
                  >
                    <motion.div
                      animate={{ x: n.value ? 20 : 2 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                      className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm ${n.value ? "bg-orange-400" : "bg-zinc-500"}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
