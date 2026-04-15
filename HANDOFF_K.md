# HANDOFF — K (Kevin)
# Dernière mise à jour : 16/04/2026 — Session finale Phase 0 → 96% UI

---

## ÉTAT GLOBAL : 96% UI complète — en attente backend G

---

## Ce qui est fait (Phase 0 + Phase 1 UI)

### Infrastructure
- Branches créées : `main`, `dev`, `K/phase0`, `G/phase0`
- Nettoyage complet : suppression Firebase, Neon, Vercel Postgres, JWT custom
- Migration vers `src/` (app, components, hooks, lib, types, styles)
- 0 vulnérabilité npm — build propre ✓

### Design system
- `src/styles/tokens.ts` — constantes couleurs, glass, radius, shadows
- `src/app/globals.css` — tokens CSS (`--color-brand`, `--color-bg`, etc.)
- `src/components/ui/` — Button (primary/ghost/outline), Card (default/glass/raised), Input

### Types
- `src/types/card.ts` → `CardData`, `CardSocials`, `CardContact`, `CardTheme`, `CardLanguage`

### Composants Card
- `VCard.tsx` — flip 3D (Framer Motion), injecte `--accent` CSS variable, scoped hover styles
- `CardFront.tsx` — photo ronde, nom, titre, socials, actions (tel/email/WhatsApp), save button
- `CardBack.tsx` — QR code (qrcode.react), liens socials
- `CardFrontRestaurant.tsx` — photo ronde + infos + bouton **"Notre menu"** → overlay animé pleine carte avec menu groupé par catégorie
- `CardFrontInfluencer.tsx` — cover photo, stats (followers/engagement/collabs), liens, media kit
- `Watermark.tsx` — watermark visible uniquement plan Free

### Dashboard
- `DashboardLayout.tsx` — sidebar fixe desktop + drawer hamburger mobile (AnimatePresence)
- `StatCard.tsx` — metric + trend ↑/↓
- `LeadsTable.tsx` — recherche, badges, CSV export, delete, overflow responsive
- `MenuManager.tsx` — toggle épuisé animé, add/delete items, catégories, realtime indicator

### Pages
| Route | Description |
|---|---|
| `/` | Landing marketing — hero, pricing, features, CTA |
| `/[slug]` | Carte publique — lit `localStorage('vcard_settings')` |
| `/dashboard` | Dashboard utilisateur — stats + leads |
| `/dashboard/settings` | 4 tabs : Profil, Liens, Design (preview live), Notifs |
| `/dashboard/upgrade` | Plans + Stripe checkout summary |
| `/pricing` | Page pricing publique |
| `/login` | Auth Google + email/password |
| `/register` | Inscription + barre force mot de passe |
| `/onboarding` | Wizard 5 étapes → slug, design, contact |
| `/admin` | Super admin — MRR, plans, users table |
| `/templates` | Showcase de tous les templates |

### Couleur accent dynamique
- Injectée via `style={{ '--accent': card.accentColor }}` sur le wrapper VCard
- Tous les éléments colorés utilisent `color-mix(in srgb, var(--accent) X%, ...)` en inline style
- Les hover states utilisent un `<style>` scoped par `.vcard-${card.id}`

### Bridge localStorage (temporaire, remplacer par Supabase)
- `dashboard/settings/page.tsx` → sauvegarde dans `localStorage('vcard_settings')` au clic "Sauvegarder"
- `(card)/[slug]/page.tsx` → lit `localStorage('vcard_settings')` au mount

---

## Ce que G doit connecter (points d'intégration)

### 1. Route GET /api/cards/[slug]
```ts
// Remplace le BASE_CARD mock dans src/app/(card)/[slug]/page.tsx
// Retourne CardData depuis Supabase
```

### 2. Route POST /api/cards
```ts
// Appelée par OnboardingWizard via onComplete(data: OnboardingData)
// Crée la carte en DB et retourne le slug
```

### 3. Route GET /api/leads
```ts
// LeadsTable attend : LeadRow[] { id, name, email, phone, message, createdAt }
```

### 4. Route DELETE /api/leads/[id]
```ts
// Bouton delete dans LeadsTable
```

### 5. Route GET /api/cards/[slug]/vcf
```ts
// handleSaveContact dans (card)/[slug]/page.tsx appelle cette route
// Doit retourner un fichier .vcf
```

### 6. Supabase Realtime — statut épuisé
```ts
// MenuManager.tsx a un toggle épuisé → doit mettre à jour la colonne menu_items.available
// CardFrontRestaurant lit card.menu[] → doit se subscribre aux changements realtime
```

### 7. Auth Supabase
```ts
// /login et /register sont UI-only pour l'instant
// Brancher sur supabase.auth.signInWithOAuth({ provider: 'google' })
// et supabase.auth.signInWithPassword()
```

### 8. Stripe
```ts
// /dashboard/upgrade a le checkout summary UI
// Brancher sur stripe.checkout.sessions.create()
```

### 9. Supprimer le bridge localStorage
```ts
// Une fois GET /api/cards/[slug] opérationnel, supprimer le useEffect localStorage
// dans src/app/(card)/[slug]/page.tsx
```

---

## Stack attendue côté G

- **DB** : Supabase (PostgreSQL)
- **ORM** : Prisma
- **Auth** : Supabase Auth (Google OAuth + email)
- **Paiement** : Stripe
- **Realtime** : Supabase Realtime (statut épuisé restaurant)
- **VCF** : génération côté serveur Node.js

---

## Branches

```
main          → production (ne pas toucher)
dev           → intégration K + G
K/phase0      → travail UI de Kevin (96% complet, à merger dans dev)
G/phase0      → travail backend de G
```

**Workflow :**
1. G crée ses routes sur `G/phase0`
2. Merge `G/phase0` → `dev`
3. Merge `K/phase0` → `dev`
4. Test intégration sur `dev`
5. Merge `dev` → `main` + deploy Vercel

---

## Ce qui reste à faire (4%)

- [ ] Brancher les vraies routes API (G)
- [ ] Tester l'intégration end-to-end
- [ ] Configurer les variables d'environnement Vercel (Supabase URL/key, Stripe key)
- [ ] Générer les fichiers VCF côté serveur
- [ ] Supabase Realtime sur le toggle épuisé restaurant
