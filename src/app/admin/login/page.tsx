'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield, X, ShieldX } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getProfile } from '@/lib/supabase/profile';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDenied, setShowDenied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Veuillez saisir votre email.'); return; }
    if (!password)     { setError('Veuillez saisir votre mot de passe.'); return; }

    setLoading(true);
    const supabase = createClient();
    const { data, error: authErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authErr) {
      setError(authErr.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : authErr.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('Erreur d\'authentification.');
      setLoading(false);
      return;
    }

    const profile = await getProfile();
    if (profile?.is_super_admin === true) {
      router.push('/admin');
      router.refresh();
    } else {
      await supabase.auth.signOut();
      setLoading(false);
      setShowDenied(true);
    }
  };

  return (
    <div
      className="min-h-screen bg-zinc-950 flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.06) 0%, transparent 60%), #09090b' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Shield size={22} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Accès Administration</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Smart vCard · Super Admin</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 shadow-2xl flex flex-col gap-5">

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5 text-rose-400 text-sm"
            >
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smartvcard.app"
                  required
                  autoComplete="username"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Mot de passe</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-1 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(to right, #f97316, #ea580c)', boxShadow: '0 4px 20px rgba(249,115,22,0.25)' }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield size={14} />
                  Accéder au panneau admin
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-700">
          Accès restreint · Smart vCard Administration
        </p>
      </motion.div>

      {/* Popup accès refusé */}
      <AnimatePresence>
        {showDenied && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowDenied(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-rose-500/20 rounded-2xl p-6 w-full max-w-xs shadow-2xl flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <ShieldX size={18} className="text-rose-400" />
                </div>
                <button
                  onClick={() => setShowDenied(false)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-white">Accès refusé</h3>
                <p className="text-sm text-zinc-400">
                  Votre compte ne dispose pas des droits administrateur nécessaires pour accéder à ce panneau.
                </p>
              </div>
              <button
                onClick={() => setShowDenied(false)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
