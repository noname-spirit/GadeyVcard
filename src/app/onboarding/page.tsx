'use client';

import { useRouter } from 'next/navigation';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import type { OnboardingData } from '@/components/onboarding/OnboardingWizard';
import { Link } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = async (data: OnboardingData) => {
    // TODO : POST /api/cards quand G a créé la route
    console.log('Card data:', data);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-950 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Smart vCard
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Créez votre carte digitale en 2 minutes</p>
      </div>

      {/* Wizard */}
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800/60 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <OnboardingWizard onComplete={handleComplete} />
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-zinc-600">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-orange-500 hover:text-orange-400 transition-colors">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
