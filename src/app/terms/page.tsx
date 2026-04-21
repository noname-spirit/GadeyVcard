import { ArrowLeft } from 'lucide-react';

export const metadata = { title: "Conditions d'utilisation — Smart vCard" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-8">

        <a href="/" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors w-fit">
          <ArrowLeft size={14} />
          Retour à l'accueil
        </a>

        <div>
          <h1 className="text-3xl font-bold text-white">Conditions d'utilisation</h1>
          <p className="text-zinc-500 text-sm mt-2">Dernière mise à jour : avril 2026</p>
        </div>

        <div className="flex flex-col gap-6 text-zinc-400 text-sm leading-relaxed">
          <section className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-zinc-200">Acceptation des conditions</h2>
            <p>
              En utilisant Smart vCard, vous acceptez les présentes conditions d'utilisation. Si vous n'êtes
              pas d'accord, veuillez ne pas utiliser le service.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-zinc-200">Utilisation du service</h2>
            <p>
              Smart vCard vous permet de créer et partager une carte de visite numérique. Vous êtes responsable
              du contenu que vous publiez. Il est interdit d'utiliser le service à des fins illégales ou
              pour diffuser du contenu nuisible.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-zinc-200">Plans et paiements</h2>
            <p>
              Le plan gratuit est limité en fonctionnalités. Les plans payants sont facturés selon la
              périodicité choisie (mensuelle ou annuelle). Aucun remboursement n'est possible sauf obligation
              légale.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-zinc-200">Résiliation</h2>
            <p>
              Vous pouvez supprimer votre compte à tout moment depuis les paramètres ou en nous contactant
              à{' '}
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
