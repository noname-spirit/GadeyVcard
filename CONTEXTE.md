# CONTEXTE — generateur_Vcard

Session handoff. Lire au démarrage avant tout travail.

---

## Identité & règles globales

- **Appeler l'utilisateur "nns"** — jamais Kevin.
- **Branche de travail : `K/phase0`** — jamais commit sur `main`.
- **Aucun commit auto.** nns valide chaque commit.
- **Aucun déploiement sans validation explicite.**
- Avant installation package : lire `.claude/security/SECURITY_LOG.md`.
- Modes actifs par défaut : `/caveman` (terse), `/impeccable`, `/frontend-design`.

## Mémoire persistante

Voir `~/.claude/projects/-Users-user-Documents-MesSites-generateur-Vcard/memory/MEMORY.md` :
- `project_vcard_saas.md` — décisions de conception complètes
- `user_identity.md` — surnom nns
- `feedback_git_branch.md` — branche K/phase0

---

## Stack

- Next.js 16 (App Router) + TypeScript strict
- Tailwind v4
- Supabase (auth + DB) + Prisma
- Stripe (paiements)
- Framer Motion
- `next/navigation` `useRouter()` partout (pas de `<Link>` pour routes internes)

## Architecture clé

- `src/app/(card)/[slug]/page.tsx` — page vCard publique (live)
- `src/app/templates/page.tsx` — preview des templates
- `src/app/dashboard/settings/page.tsx` — éditeur carte + preview
- `src/app/dashboard/upgrade/page.tsx` — page pricing/checkout
- `src/components/card/VCard.tsx` — carte 3D flip (freelance)
- `src/components/card/CardFooter.tsx` — © + lien login (rendu **par la page**, pas par VCard)
- `src/components/card/LeadCaptureForm.tsx` + `LeadCaptureFormInfluencer.tsx` — formulaires
- `src/components/dashboard/DashboardLayout.tsx` — sidebar + nav

---

## État au 2026-05-20

### Branche : K/phase0

### Travaux réalisés (sessions récentes)

1. **Plan marketing** — `docs/marketing/PLAN_COMMUNICATION.md` créé.

2. **Footer vCard partout**
   - `CardFooter.tsx` : © 2026 Noname-spirit + bouton "Accéder à mon compte" → `/login`.
   - **Position : sous carte ET sous formulaire** (pas entre).
   - VCard.tsx ne rend plus le footer (retiré pour éviter affichage milieu).
   - Footer rendu explicitement par chaque page :
     - `[slug]/page.tsx` après le form
     - `templates/page.tsx` après le form (un seul footer pour tous templates)
     - `settings/page.tsx` branche freelance après le form
     - Branches restaurant/influencer settings : footer déjà OK (form rendu avant)

3. **Refactor navigation interne**
   - Tous `<Link>` / `<a href="...">` pointant vers routes **internes** → `router.push()` via `useRouter` de `next/navigation`.
   - Liens **externes intacts** : `mailto:`, `tel:`, `https://`, anchors `#section`.
   - `target="_blank"` interne (settings page) → `window.open(url, '_blank')` pour préserver nouvel onglet.
   - Fichiers touchés :
     - `app/not-found.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `forgot-password/page.tsx`
     - `app/templates/page.tsx`, `app/page.tsx` (landing), `app/login/page.tsx`, `app/register/page.tsx`
     - `app/(card)/[slug]/page.tsx`, `app/onboarding/page.tsx`
     - `app/dashboard/settings/page.tsx`, `app/dashboard/upgrade/page.tsx`
     - `components/card/CardFooter.tsx`, `LeadCaptureForm.tsx`, `LeadCaptureFormInfluencer.tsx`
     - `components/ui/LockedFeature.tsx`
     - `components/dashboard/DashboardLayout.tsx` (Sidebar + mobile header)

### Modifications non-commitées

Vérifier `git status`. Tous les changements ci-dessus sont dans le working tree, **non commitées** (nns valide).

### Build status

- `npx tsc --noEmit` → 2 erreurs **préexistantes** (non liées au refactor) :
  - `admin/*` pages absentes (validator.ts généré)
  - `dashboard/upgrade/page.tsx:189` → `StripeModal` manque prop `planId`
- Refactor lui-même : zéro nouvelle erreur.

---

## Points d'attention (dette / bugs connus)

1. **Back navigation parfois cassé** : cause réelle = `router.replace()` dans :
   - `src/app/onboarding/page.tsx:22`
   - `src/components/ProtectedRoute.tsx:16`
   
   Remplacer par `router.push()` si nns veut corriger.

2. **StripeModal `planId` manquant** dans `dashboard/upgrade/page.tsx:189` — à corriger.

3. **Pages admin référencées par le validator Next mais absentes** :
   - `src/app/admin/cards/page.tsx`
   - `src/app/admin/login/page.tsx`
   - `src/app/admin/revenue/page.tsx`
   - `src/app/admin/utilisateurs/page.tsx`
   - + routes API : `api/admin/cards`, `api/admin/data`, `api/admin/revenue`, `api/admin/users`, `api/stripe/webhook`
   
   Soit créer, soit nettoyer le validator.

---

## Prochaines étapes possibles (à valider par nns)

- [ ] Commit des changements sur K/phase0
- [ ] Fix `router.replace` → `router.push` dans onboarding + ProtectedRoute
- [ ] Fix `StripeModal.planId`
- [ ] Décider sort des pages admin manquantes
- [ ] Tester la navigation back en local après le refactor

---

## Conventions de code (rappel)

- Indentation 2 espaces · `;` toujours · doubles guillemets en JSX, simples en TS pur
- Composants PascalCase · utils kebab-case · variables camelCase
- Pas de `any` sauf justifié · interfaces > types pour objets
- Pas de console.log avec données sensibles
- Variables env jamais dans le code
