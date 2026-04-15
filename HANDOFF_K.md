# HANDOFF — K (Kevin)

## Session du 16/04/2026 (suite — Phase 1)

### Fait
- Création des branches : `dev`, `K/phase0`, `G/phase0`
- Nettoyage complet du projet :
  - Suppression Firebase, Neon, Vercel Postgres, JWT custom
  - Suppression 17 fichiers .md parasites, Dockerfile, scripts
  - Suppression routes API auth/contact/leads (sera reconstruit avec Supabase)
- Réorganisation en `src/` (app, components, hooks, lib, types, styles)
- Nettoyage package.json → 0 vulnérabilité
- Build propre ✓
- Commit pushé sur `K/phase0`

### Fait (Phase 0)
- Nettoyage Firebase/Neon, migration src/, build propre ✓
- Design system : tokens CSS + tokens.ts + Button/Card/Input ✓

### Fait (Phase 1)
- `src/types/card.ts` : CardData, CardSocials, CardContact, CardTheme, CardLanguage
- `src/components/card/` : VCard (flip 3D), CardFront, CardBack — tous prop-driven
- `src/components/onboarding/OnboardingWizard.tsx` : 5 étapes, progress bar, transitions
- `src/components/dashboard/` : StatCard, LeadsTable (search, CSV, delete)

### En cours / bloqué
- Attente accès Supabase et Stripe pour que G puisse démarrer
- Pas de routes API encore (tout est UI statique pour l'instant)

### À savoir pour G
- Les composants card acceptent `CardData` comme props → brancher sur l'API Supabase quand prêt
- `OnboardingWizard` retourne `OnboardingData` via `onComplete(data)` → à connecter à la route POST /api/cards
- `LeadsTable` attend `LeadRow[]` → à brancher sur GET /api/leads
- `src/app/page.tsx` = démo vCard de Kevin, conservée comme référence visuelle
