"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import type { OnboardingData } from "@/components/onboarding/OnboardingWizard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { getCardsByUid, upsertCard } from "@/lib/supabase/cards";

export default function OnboardingPage() {
  const router = useRouter();
  const { uid, loading } = useAuth();
  const [cardsChecked, setCardsChecked] = useState(false);
  const checking = loading || (!!uid && !cardsChecked);

  useEffect(() => {
    if (loading || !uid) return;
    getCardsByUid(uid).then((cards) => {
      if (cards.length > 0) router.replace("/dashboard");
      else setCardsChecked(true);
    }).catch(() => setCardsChecked(true));
  }, [uid, loading, router]);

  const handleComplete = async (data: OnboardingData): Promise<void> => {
    if (!uid) throw new Error('Non authentifié');

    const finalSlug = data.slug?.trim() || data.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || uid;

    const result = await upsertCard(uid, {
      slug: finalSlug,
      name: data.name ?? '',
      title: data.title ?? '',
      photo: data.photo || undefined,
      contact: {
        phone: data.phone || null,
        email: data.email || null,
        whatsapp: data.whatsapp || null,
        line: data.line || null,
      },
      socials: {
        instagram: data.instagram || null,
        youtube: data.youtube || null,
        linkedin: data.linkedin || null,
        website: data.website || null,
      },
      accent_color: data.accentColor ?? '#f97316',
      template: data.template ?? 'dark',
      plan: 'free',
    });

    if (!result) throw new Error('Échec de la création de la carte');
    router.push("/dashboard");
  };

  if (checking) return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-950 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-zinc-950 via-black to-zinc-950 flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Image src="/logo/logo-vertical-white.svg" alt="vCard" width={200} height={200} className="h-44 w-auto" priority />
          <p className="text-zinc-500 text-sm">
            Créez votre carte digitale en 2 minutes
          </p>
        </div>

        <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800/60 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <OnboardingWizard onComplete={handleComplete} />
        </div>

        <p className="mt-8 text-xs text-zinc-600">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-orange-500 hover:text-orange-400 transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </ProtectedRoute>
  );
}
