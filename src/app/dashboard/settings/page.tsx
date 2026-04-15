'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, ExternalLink, Palette, User, Link2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const TABS = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'links', label: 'Liens', icon: Link2 },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
] as const;

type Tab = typeof TABS[number]['id'];

function Field({ label, value, onChange, placeholder, type = 'text', prefix }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; prefix?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-zinc-400 font-medium">{label}</label>
      <div className="flex">
        {prefix && (
          <span className="px-3 py-2.5 bg-zinc-800 border border-r-0 border-zinc-700/40 rounded-l-xl text-zinc-500 text-sm">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={[
            'w-full px-4 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 text-zinc-100',
            'placeholder:text-zinc-500 outline-none transition-all',
            'focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20',
            prefix ? 'rounded-r-xl' : 'rounded-xl',
          ].join(' ')}
        />
      </div>
    </div>
  );
}

const TEMPLATES = [
  { id: 'dark', label: 'Dark', bg: 'from-zinc-900 to-black', text: 'text-white' },
  { id: 'light', label: 'Light', bg: 'from-zinc-100 to-white', text: 'text-zinc-800' },
  { id: 'color', label: 'Color', bg: 'from-orange-500 to-orange-700', text: 'text-white' },
] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile
  const [name, setName] = useState('Noname Spirit');
  const [title, setTitle] = useState('Graphiste Logo & Web | Branding');
  const [slug, setSlug] = useState('noname-spirit');

  // Links
  const [phone, setPhone] = useState('+33 6 00 00 00 00');
  const [email, setEmail] = useState('hello@noname-spirit.com');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('https://instagram.com');
  const [website, setWebsite] = useState('https://noname-spirit.com');

  // Design
  const [template, setTemplate] = useState<'dark' | 'light' | 'color'>('dark');
  const [accent, setAccent] = useState('#f97316');

  // Notifications
  const [notifLead, setNotifLead] = useState(true);
  const [notifView, setNotifView] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO : PATCH /api/cards/[id]
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">

      {/* Sidebar */}
      <aside className="w-60 min-h-screen bg-zinc-900 border-r border-zinc-800/60 flex flex-col p-4 gap-6 fixed top-0 left-0">
        <div className="pt-2">
          <h1 className="text-lg font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">Smart vCard</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Paramètres</p>
        </div>
        <nav className="flex flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                tab === t.id
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
              ].join(' ')}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <a
            href={`/${slug}`}
            target="_blank"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-orange-400 transition-colors"
          >
            <ExternalLink size={12} />
            Voir ma carte
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60 p-8 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Paramètres</h2>
          <Button onClick={handleSave} loading={saving} size="sm" className="flex items-center gap-2">
            <Save size={14} />
            {saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
          </Button>
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col gap-6"
        >

          {tab === 'profile' && (
            <>
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Identité</h3>
                <Field label="Nom complet" value={name} onChange={setName} placeholder="Kevin Durand" />
                <Field label="Titre / Métier" value={title} onChange={setTitle} placeholder="Graphiste & Brand Designer" />
                <Field label="URL de votre carte" value={slug} onChange={(v) => setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="votre-nom" prefix="vcard.app/" />
              </div>

              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Photo de profil</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">Changer la photo</Button>
                    <p className="text-xs text-zinc-500">JPG, PNG — max 2 Mo</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'links' && (
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Contact & Réseaux</h3>
              <Field label="Téléphone" value={phone} onChange={setPhone} placeholder="+33 6 12 34 56 78" type="tel" />
              <Field label="Email" value={email} onChange={setEmail} placeholder="vous@email.com" type="email" />
              <Field label="WhatsApp" value={whatsapp} onChange={setWhatsapp} placeholder="+33 6 12 34 56 78" />
              <Field label="Instagram" value={instagram} onChange={setInstagram} placeholder="https://instagram.com/vous" prefix="IG" />
              <Field label="Site web" value={website} onChange={setWebsite} placeholder="https://votre-site.com" prefix="🌐" />
            </div>
          )}

          {tab === 'design' && (
            <>
              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Template</h3>
                <div className="flex gap-3">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={[
                        `flex-1 h-20 rounded-xl bg-linear-to-br ${t.bg} border-2 transition-all duration-200 flex items-end p-2`,
                        template === t.id ? 'border-orange-500 scale-105' : 'border-transparent opacity-60 hover:opacity-90',
                      ].join(' ')}
                    >
                      <span className={`text-xs font-semibold ${t.text}`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Couleur d'accent</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-zinc-700/40 bg-zinc-800 cursor-pointer"
                  />
                  <span className="text-zinc-400 text-sm font-mono">{accent}</span>
                  <button onClick={() => setAccent('#f97316')} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                    Réinitialiser
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === 'notifications' && (
            <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 flex flex-col gap-5">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Alertes email</h3>

              {[
                { label: 'Nouveau lead capté', sub: 'Quand quelqu\'un remplit votre formulaire', value: notifLead, set: setNotifLead },
                { label: 'Vues de votre carte', sub: 'Résumé hebdomadaire des visites', value: notifView, set: setNotifView },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{n.label}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{n.sub}</p>
                  </div>
                  <button
                    onClick={() => n.set(!n.value)}
                    className={[
                      'relative w-11 h-6 rounded-full border transition-all duration-300',
                      n.value ? 'bg-orange-500/20 border-orange-500/40' : 'bg-zinc-800 border-zinc-700/40',
                    ].join(' ')}
                  >
                    <motion.div
                      animate={{ x: n.value ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`absolute top-0.5 w-5 h-5 rounded-full shadow-sm ${n.value ? 'bg-orange-400' : 'bg-zinc-500'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

        </motion.div>
      </main>
    </div>
  );
}
