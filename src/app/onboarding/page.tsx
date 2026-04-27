"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import type { OnboardingData } from "@/components/onboarding/OnboardingWizard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/firebase/AuthProvider";
import { addOnboarding } from "@/lib/firebase/add-onboarding";
import { getCardsByUid } from "@/lib/firebase/get-cards";

export default function OnboardingPage() {
  const router = useRouter();
  const { uid, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!uid) { setChecking(false); return; }
    getCardsByUid(uid).then((cards) => {
      if (cards.length > 0) router.replace("/dashboard");
      else setChecking(false);
    }).catch(() => setChecking(false));
  }, [uid, loading, router]);

  /**
   * Appelée quand l'utilisateur valide la dernière étape du wizard.
   * Envoie les données de la carte dans Firestore puis redirige vers le dashboard.
   *
   * @param {OnboardingData} data - Données complètes saisies dans le wizard
   */
  const handleComplete = async (data: OnboardingData) => {
    if (!uid) return;

    // 1. Sauvegarde la carte dans Firestore et récupère le slug final
    const slug = await addOnboarding(uid, data);
    console.log("Carte créée avec le slug :", slug);
    // 2. Appelle la route VCF pour générer et persister le .vcf dans le document Firestore
    await fetch(`/api/cards/${slug}/vcf`);

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
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Smart vCard
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
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
