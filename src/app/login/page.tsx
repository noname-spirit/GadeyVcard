'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, getFirebaseAuthError } from '@/lib/firebase/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/onboarding';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Veuillez saisir votre email.');
      return;
    }
    if (!password) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(getFirebaseAuthError(err));
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoadingGoogle(true);

    try {
      await signInWithPopup(auth, googleProvider);
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(getFirebaseAuthError(err));
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.6)] flex flex-col gap-5">

      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5 text-rose-400 text-sm">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handleGoogle}
        disabled={loadingGoogle}
        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-zinc-700/40 bg-zinc-800/40 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600/60 hover:text-white transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
        {loadingGoogle ? 'Connexion...' : 'Continuer avec Google'}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs text-zinc-600">ou</span>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-zinc-400 font-medium">Email</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@email.com"
              required
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-400 font-medium">Mot de passe</label>
            <a href="/forgot-password" className="text-xs text-zinc-500 hover:text-orange-400 transition-colors">
              Oublié ?
            </a>
          </div>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-9 pr-10 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
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

        <Button type="submit" loading={loading} className="w-full mt-1">
          Se connecter
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center gap-8"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Smart vCard
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Connectez-vous à votre espace</p>
        </div>

        <Suspense fallback={<div className="w-full h-48 bg-zinc-900 rounded-2xl animate-pulse" />}>
          <LoginForm />
        </Suspense>

        <p className="text-sm text-zinc-600">
          Pas encore de compte ?{' '}
          <a href="/register" className="text-orange-500 hover:text-orange-400 transition-colors font-medium">
            Créer un compte
          </a>
        </p>
      </motion.div>
    </div>
  );
}
