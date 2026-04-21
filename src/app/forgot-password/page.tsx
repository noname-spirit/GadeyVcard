'use client';

import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard/settings`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <a href="/login" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors w-fit">
          <ArrowLeft size={14} />
          Retour à la connexion
        </a>

        <div>
          <h1 className="text-2xl font-bold text-white">Mot de passe oublié</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Entrez votre email et nous vous enverrons un lien de réinitialisation.
          </p>
        </div>

        {sent ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex flex-col gap-2">
            <p className="text-green-400 font-medium text-sm">Email envoyé ✓</p>
            <p className="text-zinc-400 text-sm">
              Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-zinc-400 font-medium">Adresse email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@domaine.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-800/60 border border-zinc-700/40 text-zinc-100 rounded-xl placeholder:text-zinc-500 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                />
              </div>
            </div>
            <Button type="submit" loading={loading} className="w-full">
              Envoyer le lien
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
