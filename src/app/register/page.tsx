'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { createProfile } from '@/lib/supabase/profile';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Faible', 'Moyen', 'Fort'];
  const strengthColor = ['', 'bg-rose-500', 'bg-orange-400', 'bg-emerald-400'];

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Veuillez saisir votre nom complet.'); return; }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }

    setLoading(true);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    if (err) { setError(err.message); }
    else {
      if (data.user) await createProfile(data.user.id, name.trim());
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    setLoadingGoogle(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
    });
    if (err) { setError(err.message); setLoadingGoogle(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-950 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Mail size={28} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Compte créé !</h2>
            <p className="text-zinc-400 text-sm mt-2">
              Bienvenue <span className="text-white font-medium">{name}</span>.<br />
              Un email de vérification a été envoyé à <span className="text-white font-medium">{email}</span>.
            </p>
          </div>
          <Link href="/login" className="text-sm text-orange-500 hover:text-orange-400 transition-colors font-medium">Se connecter</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-950 flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Image src="/logo/logo-vertical-white.svg" alt="vCard" width={200} height={200} className="h-44 w-auto" priority />
          <p className="text-zinc-500 text-sm">Créez votre carte en 2 minutes</p>
        </div>

        <div className="w-full bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.6)] flex flex-col gap-5">
          <div className="flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl py-2.5">
            <span className="text-sm font-semibold text-orange-400">14 jours Pro gratuits</span>
            <span className="text-xs text-zinc-500">· Sans CB</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5 text-rose-400 text-sm">
              <AlertCircle size={14} className="shrink-0" />{error}
            </div>
          )}

          <button onClick={handleGoogle} disabled={loadingGoogle}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-zinc-700/40 bg-zinc-800/40 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600/60 hover:text-white transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            {loadingGoogle ? 'Connexion...' : 'Continuer avec Google'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-800" /><span className="text-xs text-zinc-600">ou</span><div className="flex-1 h-px bg-zinc-800" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400 font-medium">Nom complet</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Kevin Durand" required
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400 font-medium">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@email.com" required
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400 font-medium">Mot de passe</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((lvl) => (
                      <div key={lvl} className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength >= lvl ? strengthColor[strength] : 'bg-zinc-700'}`} />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strength === 1 ? 'text-rose-400' : strength === 2 ? 'text-orange-400' : 'text-emerald-400'}`}>{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400 font-medium">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type={showConfirmPwd ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required
                  className={`w-full pl-9 pr-10 py-2.5 text-sm bg-zinc-800/60 border rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none transition-all ${confirmPassword.length > 0 && confirmPassword !== password ? 'border-rose-500/50 focus:ring-1 focus:ring-rose-500/20' : 'border-zinc-700/40 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20'}`} />
                <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors">
                  {showConfirmPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-xs text-rose-400 mt-0.5">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full mt-1">Créer mon compte</Button>
            <p className="text-xs text-zinc-600 text-center">
              En créant un compte, vous acceptez nos{' '}
              <Link href="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors underline">CGU</Link>
              {' '}et notre{' '}
              <Link href="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors underline">politique de confidentialité</Link>.
            </p>
          </form>
        </div>

        <p className="text-sm text-zinc-600">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-orange-500 hover:text-orange-400 transition-colors font-medium">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
}
