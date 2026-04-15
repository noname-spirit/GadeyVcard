# HANDOFF — K (Kevin)

## Session du 16/04/2026

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

### En cours / bloqué
- Design system à faire (tokens couleurs, typo, composants de base)
- Attente accès Supabase et Stripe (G ne peut pas démarrer sans)

### À savoir pour l'autre (G)
- `src/app/page.tsx` = blueprint visuel de référence — la vCard finale attendue
- `data/contact.json` + `data/leads.json` = structure de données de référence
- Stack propre, prêt pour Supabase + Prisma
- Quand les accès Supabase/Stripe arrivent → G démarre sur `G/phase0`
