'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, User, Link, Palette, Image, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface OnboardingData {
  // Étape 1 — Identité
  name: string;
  title: string;
  // Étape 2 — Contact
  phone: string;
  email: string;
  whatsapp: string;
  line: string;
  // Étape 3 — Réseaux sociaux
  instagram: string;
  youtube: string;
  linkedin: string;
  website: string;
  // Étape 4 — Visuel
  photo: string;
  template: 'dark' | 'light' | 'color';
  accentColor: string;
  // Étape 5 — Slug
  slug: string;
}

const STEPS = [
  { id: 1, label: 'Identité', icon: User },
  { id: 2, label: 'Contact', icon: Link },
  { id: 3, label: 'Réseaux', icon: Link },
  { id: 4, label: 'Visuel', icon: Palette },
  { id: 5, label: 'Aperçu', icon: Eye },
];

const INITIAL_DATA: OnboardingData = {
  name: '', title: '', phone: '', email: '', whatsapp: '', line: '',
  instagram: '', youtube: '', linkedin: '', website: '',
  photo: '', template: 'dark', accentColor: '#f97316', slug: '',
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
}

function Field({ label, value, onChange, placeholder, type = 'text', prefix }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-zinc-400 font-medium">{label}</label>
      <div className="flex items-center gap-0">
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
            'placeholder:text-zinc-500 outline-none transition-all duration-200',
            'focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20',
            prefix ? 'rounded-r-xl' : 'rounded-xl',
          ].join(' ')}
        />
      </div>
    </div>
  );
}

// ─── Étapes ─────────────────────────────────────────────────────────────────

function Step1({ data, onChange }: { data: OnboardingData; onChange: (d: Partial<OnboardingData>) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-zinc-400 text-sm">Ces informations apparaissent en haut de votre carte.</p>
      <Field label="Nom complet" value={data.name} onChange={(v) => onChange({ name: v })} placeholder="Kevin Durand" />
      <Field label="Titre / Métier" value={data.title} onChange={(v) => onChange({ title: v })} placeholder="Graphiste & Brand Designer" />
    </div>
  );
}

function Step2({ data, onChange }: { data: OnboardingData; onChange: (d: Partial<OnboardingData>) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-zinc-400 text-sm">Boutons d&apos;action sur votre carte. Laissez vide ce que vous ne souhaitez pas afficher.</p>
      <Field label="Téléphone" value={data.phone} onChange={(v) => onChange({ phone: v })} placeholder="+33 6 12 34 56 78" type="tel" />
      <Field label="Email" value={data.email} onChange={(v) => onChange({ email: v })} placeholder="vous@domaine.com" type="email" />
      <Field label="WhatsApp" value={data.whatsapp} onChange={(v) => onChange({ whatsapp: v })} placeholder="+33 6 12 34 56 78" />
      <Field label="LINE" value={data.line} onChange={(v) => onChange({ line: v })} placeholder="https://line.me/ti/p/..." />
    </div>
  );
}

function Step3({ data, onChange }: { data: OnboardingData; onChange: (d: Partial<OnboardingData>) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-zinc-400 text-sm">Liens vers vos profils. Laissez vide ce que vous ne souhaitez pas afficher.</p>
      <Field label="Instagram" value={data.instagram} onChange={(v) => onChange({ instagram: v })} placeholder="https://instagram.com/vous" prefix="IG" />
      <Field label="YouTube" value={data.youtube} onChange={(v) => onChange({ youtube: v })} placeholder="https://youtube.com/@vous" prefix="YT" />
      <Field label="LinkedIn" value={data.linkedin} onChange={(v) => onChange({ linkedin: v })} placeholder="https://linkedin.com/in/vous" prefix="LI" />
      <Field label="Site web" value={data.website} onChange={(v) => onChange({ website: v })} placeholder="https://votre-site.com" prefix="🌐" />
    </div>
  );
}

const TEMPLATES = [
  { id: 'dark', label: 'Dark', bg: 'from-zinc-900 to-black', border: 'border-zinc-700' },
  { id: 'light', label: 'Light', bg: 'from-zinc-100 to-white', border: 'border-zinc-300' },
  { id: 'color', label: 'Color', bg: 'from-orange-500 to-orange-700', border: 'border-orange-400' },
] as const;

function Step4({ data, onChange }: { data: OnboardingData; onChange: (d: Partial<OnboardingData>) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-zinc-400 font-medium">Template</p>
        <div className="flex gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ template: t.id })}
              className={[
                `flex-1 h-20 rounded-xl bg-linear-to-br ${t.bg} border-2 transition-all duration-200 flex items-end p-2`,
                data.template === t.id ? 'border-orange-500 scale-105' : `${t.border} opacity-60 hover:opacity-90`,
              ].join(' ')}
            >
              <span className={`text-xs font-semibold ${t.id === 'light' ? 'text-zinc-700' : 'text-white'}`}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-zinc-400 font-medium">Couleur d&apos;accent</p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={data.accentColor}
            onChange={(e) => onChange({ accentColor: e.target.value })}
            className="w-10 h-10 rounded-lg border border-zinc-700/40 bg-zinc-800 cursor-pointer"
          />
          <span className="text-zinc-400 text-sm font-mono">{data.accentColor}</span>
        </div>
      </div>

      <Field label="Photo de profil (URL)" value={data.photo} onChange={(v) => onChange({ photo: v })} placeholder="https://..." />
    </div>
  );
}

function Step5({ data, onChange }: { data: OnboardingData; onChange: (d: Partial<OnboardingData>) => void }) {
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div className="flex flex-col gap-6">
      <p className="text-zinc-400 text-sm">Votre carte sera accessible à cette URL.</p>

      <Field
        label="URL personnalisée"
        value={data.slug}
        onChange={(v) => onChange({ slug: v.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
        placeholder={slug || 'votre-nom'}
        prefix="vcard.app/"
      />

      <div className="bg-zinc-800/40 rounded-xl p-4 flex flex-col gap-2 border border-zinc-700/40">
        <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Récapitulatif</p>
        <p className="text-zinc-300 text-sm"><span className="text-zinc-500">Nom :</span> {data.name || '—'}</p>
        <p className="text-zinc-300 text-sm"><span className="text-zinc-500">Titre :</span> {data.title || '—'}</p>
        <p className="text-zinc-300 text-sm"><span className="text-zinc-500">Template :</span> {data.template}</p>
        <p className="text-zinc-300 text-sm"><span className="text-zinc-500">URL :</span> vcard.app/{data.slug || slug || '…'}</p>
      </div>
    </div>
  );
}

// ─── Wizard ──────────────────────────────────────────────────────────────────

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => Promise<void>;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (partial: Partial<OnboardingData>) => setData((d) => ({ ...d, ...partial }));

  const next = async () => {
    if (step < 5) { setStep(step + 1); return; }
    setSubmitError('');
    setSubmitting(true);
    try {
      await onComplete(data);
    } catch {
      setSubmitError('Une erreur est survenue. Veuillez réessayer.');
      setSubmitting(false);
    }
  };

  const prev = () => step > 1 && setStep(step - 1);

  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1 data={data} onChange={update} />,
    2: <Step2 data={data} onChange={update} />,
    3: <Step3 data={data} onChange={update} />,
    4: <Step4 data={data} onChange={update} />,
    5: <Step5 data={data} onChange={update} />,
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className={[
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0',
                done ? 'bg-orange-500 text-white' : active ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-400' : 'bg-zinc-800 border border-zinc-700 text-zinc-500',
              ].join(' ')}>
                {done ? <Check size={14} /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-all duration-300 ${done ? 'bg-orange-500' : 'bg-zinc-800'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          {STEPS[step - 1].label}
        </h2>
        <p className="text-zinc-500 text-sm">Étape {step} sur {STEPS.length}</p>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-64"
        >
          {stepComponents[step]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {submitError && (
        <p className="mt-4 text-sm text-rose-400 text-center">{submitError}</p>
      )}
      <div className="flex gap-3 mt-4">
        {step > 1 && (
          <Button variant="outline" onClick={prev} disabled={submitting} className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Retour
          </Button>
        )}
        <Button onClick={next} loading={submitting} disabled={submitting} className="flex-1 flex items-center justify-center gap-2">
          {step === 5 ? (submitting ? 'Création…' : 'Créer ma carte') : 'Continuer'}
          {step < 5 && <ChevronRight size={16} />}
        </Button>
      </div>
    </div>
  );
}
