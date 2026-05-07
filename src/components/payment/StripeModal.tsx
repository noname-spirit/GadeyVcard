'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CreditCard, ShieldCheck } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/Button';
import { updatePlan } from '@/lib/supabase/profile';
import { updateCardPlan } from '@/lib/supabase/cards';
import { useAuth } from '@/lib/supabase/AuthProvider';

const STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

const stripeAppearance = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#f97316',
    colorBackground: '#18181b',
    colorText: '#f4f4f5',
    colorDanger: '#f43f5e',
    fontFamily: 'inherit',
    borderRadius: '12px',
    colorIconTab: '#a1a1aa',
    colorIconTabSelected: '#f97316',
  },
  rules: {
    '.Input': {
      backgroundColor: '#27272a',
      border: '1px solid rgba(63,63,70,0.6)',
      boxShadow: 'none',
      color: '#f4f4f5',
    },
    '.Input:focus': {
      border: '1px solid rgba(249,115,22,0.5)',
      boxShadow: '0 0 0 2px rgba(249,115,22,0.1)',
    },
    '.Label': { color: '#a1a1aa', fontSize: '13px', fontWeight: '500' },
    '.Tab': { backgroundColor: '#27272a', border: '1px solid rgba(63,63,70,0.4)' },
    '.Tab--selected': { border: '1px solid rgba(249,115,22,0.5)', backgroundColor: '#3f3f46' },
  },
};

interface CheckoutFormProps {
  amount: number;
  planName: string;
  planId: string;
  billing: string;
  onSuccess: () => void;
  onClose: () => void;
}

function CheckoutForm({ amount, planName, planId, billing, onSuccess, onClose }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { uid } = useAuth();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError('');
    setPaying(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? 'Erreur de paiement');
      setPaying(false);
      return;
    }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, planName, billing }),
    });

    const { clientSecret, error: apiError } = await res.json();
    if (apiError || !clientSecret) {
      setError(apiError ?? 'Impossible de créer le paiement');
      setPaying(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: `${window.location.origin}/dashboard?upgraded=true` },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message ?? 'Paiement refusé');
      setPaying(false);
    } else {
      await updatePlan(planId as 'free' | 'starter' | 'pro' | 'business');
      if (uid) await updateCardPlan(uid, planId);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-sm text-zinc-400">Plan sélectionné</p>
          <p className="text-base font-semibold text-white">{planName} · {billing === 'yearly' ? 'Annuel' : 'Mensuel'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Total</p>
          <p className="text-2xl font-bold text-white">{amount}€</p>
        </div>
      </div>

      <div className="h-px bg-zinc-800" />

      <PaymentElement
        options={{ layout: 'tabs' }}
      />

      {error && (
        <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          loading={paying}
          disabled={!stripe}
          className="w-full flex items-center justify-center gap-2"
        >
          <Lock size={14} />
          {paying ? 'Traitement...' : `Payer ${amount}€`}
        </Button>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors text-center"
        >
          Annuler
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
          <ShieldCheck size={12} className="text-emerald-500" />
          Paiement sécurisé SSL
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
          <CreditCard size={12} />
          Powered by Stripe
        </div>
      </div>
    </form>
  );
}

interface StripeModalContentProps {
  onClose: () => void;
  planName: string;
  planId: string;
  amount: number;
  billing: string;
}

function StripeModalContent({ onClose, planName, planId, amount, billing }: StripeModalContentProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [loadingIntent, setLoadingIntent] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/stripe/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, planName, billing }),
    })
      .then((r) => r.json())
      .then(({ clientSecret: cs }) => { if (cs) setClientSecret(cs); })
      .catch(() => {})
      .finally(() => setLoadingIntent(false));
  }, [amount, planName, billing]);

  if (success) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 py-6 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <ShieldCheck size={24} className="text-emerald-400" />
      </div>
      <div>
        <p className="text-lg font-bold text-white">Paiement confirmé !</p>
        <p className="text-sm text-zinc-400 mt-1">Votre plan <span className="text-white font-medium">{planName}</span> est maintenant actif.</p>
      </div>
      <Button onClick={onClose} className="mt-2">Accéder au dashboard</Button>
    </motion.div>
  );

  if (loadingIntent) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
    </div>
  );

  if (!clientSecret) return (
    <p className="text-sm text-zinc-500 text-center py-8">Impossible de charger le formulaire de paiement.</p>
  );

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
      <CheckoutForm
        amount={amount}
        planName={planName}
        planId={planId}
        billing={billing}
        onSuccess={() => setSuccess(true)}
        onClose={onClose}
      />
    </Elements>
  );
}

interface StripeModalProps {
  open: boolean;
  onClose: () => void;
  planName: string;
  planId: string;
  amount: number;
  billing: string;
}

export function StripeModal({ open, onClose, planName, planId, amount, billing }: StripeModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800/60 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                  <CreditCard size={14} className="text-orange-400" />
                </div>
                <span className="font-semibold text-white text-sm">Finaliser l&apos;abonnement</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5">
              <StripeModalContent
                onClose={onClose}
                planName={planName}
                planId={planId}
                amount={amount}
                billing={billing}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
