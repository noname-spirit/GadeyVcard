'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-8">

        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          Retour à l'accueil
        </button>

        <div>
          <h1 className="text-3xl font-bold text-white">Politique de confidentialité</h1>
          <p className="text-zinc-500 text-sm mt-2">Dernière mise à jour : avril 2026</p>
        </div>

        <div className="flex flex-col gap-6 text-zinc-400 text-sm leading-relaxed">
          <section className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-zinc-200">Données collectées</h2>
            <p>
              Nous collectons uniquement les informations nécessaires au fonctionnement du service : adresse email,
              nom, et les informations que vous renseignez sur votre carte de visite. Ces données sont stockées
              de manière sécurisée.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-zinc-200">Utilisation des données</h2>
            <p>
              Vos données sont utilisées exclusivement pour faire fonctionner votre carte de visite numérique.
              Nous ne vendons ni ne partageons vos données avec des tiers à des fins commerciales.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-zinc-200">Cookies</h2>
            <p>
              Nous utilisons des cookies de session pour vous maintenir connecté. Aucun cookie de tracking
              publicitaire tiers n'est utilisé.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-zinc-200">Vos droits</h2>
            <p>
              Vous pouvez demander la suppression de votre compte et de vos données à tout moment en nous
              contactant à{' '}
              <a href="mailto:hello@vcard.app" className="text-orange-400 hover:underline">
                hello@vcard.app
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
