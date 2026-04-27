# SUPABASE_SETUP.md — Guide de configuration pour G

Ce projet utilise **Supabase** pour l'authentification et la base de données.
Tout le code est déjà écrit. Tu as juste à :
1. Créer le projet Supabase
2. Coller les 3 variables d'environnement
3. Lancer le SQL de schéma
4. (Optionnel) Activer Google OAuth

---

## 1. Créer le projet Supabase

1. Va sur [https://supabase.com](https://supabase.com) → **New project**
2. Choisis un nom (ex: `smartvcard`)
3. Génère un mot de passe fort et **sauvegarde-le**
4. Région : `West EU` (Paris) ou la plus proche des utilisateurs

---

## 2. Variables d'environnement

Dans le dashboard Supabase : **Settings → API**

Copie ces 3 valeurs dans `.env.local` ET dans Vercel (Settings → Environment Variables) :

```env
# URL du projet (ex: https://abcdefgh.supabase.co)
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_PROJECT_ID.supabase.co

# Clé publique anon (safe côté client)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clé service role (PRIVÉE — jamais exposée côté client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` bypass toutes les règles de sécurité.
> Ne jamais la mettre dans une variable `NEXT_PUBLIC_*`.

---

## 3. Schéma de base de données

Dans le dashboard Supabase : **SQL Editor → New query**
Colle et exécute le SQL suivant :

```sql
-- ─── TABLE : cards ─────────────────────────────────────────────────────────
create table if not exists public.cards (
  id          uuid primary key default gen_random_uuid(),
  uid         uuid not null references auth.users(id) on delete cascade,
  slug        text not null unique,
  name        text not null,
  title       text not null default '',
  photo       text,
  contact     jsonb not null default '{}',
  socials     jsonb not null default '{}',
  accent_color text not null default '#f97316',
  template    text not null default 'dark',
  plan        text check (plan in ('free','starter','pro')),
  vcf         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index pour les lookups par uid (dashboard) et par slug (page carte)
create index if not exists cards_uid_idx  on public.cards(uid);
create index if not exists cards_slug_idx on public.cards(slug);

-- ─── TABLE : leads ─────────────────────────────────────────────────────────
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  card_slug   text not null,
  nom         text not null,
  contact     text not null,
  telephone   text,
  domaine     text,
  message     text,
  source      text not null default 'formulaire',
  language    text,
  created_at  timestamptz not null default now()
);

create index if not exists leads_slug_idx on public.leads(card_slug);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────

-- Cards : chaque utilisateur ne voit que ses propres cartes
alter table public.cards enable row level security;

create policy "Lecture propre" on public.cards
  for select using (auth.uid() = uid);

create policy "Insertion propre" on public.cards
  for insert with check (auth.uid() = uid);

create policy "Mise à jour propre" on public.cards
  for update using (auth.uid() = uid);

create policy "Suppression propre" on public.cards
  for delete using (auth.uid() = uid);

-- Lecture publique des cartes par slug (page /[slug] visible sans connexion)
create policy "Lecture publique par slug" on public.cards
  for select using (true);

-- Leads : insertion publique (formulaire de contact), lecture réservée au propriétaire
alter table public.leads enable row level security;

create policy "Insertion publique" on public.leads
  for insert with check (true);

create policy "Lecture propriétaire" on public.leads
  for select using (
    exists (
      select 1 from public.cards
      where cards.slug = leads.card_slug
        and cards.uid = auth.uid()
    )
  );
```

> **Note** : La politique "Lecture publique par slug" permet à n'importe qui de
> voir une carte via son slug. C'est intentionnel (page publique).
> La lecture dans le dashboard utilise la politique "Lecture propre" (uid).

---

## 4. Google OAuth (optionnel mais recommandé)

### Dans Supabase

1. **Authentication → Providers → Google** → activer
2. Copie le **Callback URL** affiché (ex: `https://abcdefgh.supabase.co/auth/v1/callback`)

### Dans Google Cloud Console

1. Va sur [https://console.cloud.google.com](https://console.cloud.google.com)
2. Créer un projet ou en sélectionner un existant
3. **APIs & Services → Credentials → Create Credentials → OAuth Client ID**
4. Application type : **Web application**
5. **Authorized redirect URIs** → colle le Callback URL de Supabase
6. Copie le **Client ID** et **Client Secret**

### Retour dans Supabase

1. Colle le **Client ID** et **Client Secret** dans Authentication → Google
2. Save

### Dans le code

Le code est déjà prêt. Le redirect est configuré dans :
- `src/app/login/page.tsx` → `redirectTo: .../auth/callback?next=/dashboard`
- `src/app/register/page.tsx` → `redirectTo: .../auth/callback?next=/onboarding`

---

## 5. URL de l'application (Vercel)

Dans Vercel → Settings → Environment Variables, ajouter aussi :

```env
NEXT_PUBLIC_APP_URL=https://TON_DOMAINE.com
```

Cela génère les liens corrects dans les fichiers `.vcf`.

---

## 6. Vérification rapide

Après configuration, tester dans l'ordre :

- [ ] `/register` → créer un compte → email de confirmation reçu
- [ ] `/login` → se connecter → redirection `/dashboard`
- [ ] `/dashboard/settings` → remplir la carte → sauvegarder
- [ ] `/TON_SLUG` → la carte s'affiche
- [ ] Bouton "Enregistrer le contact" → `.vcf` téléchargé
- [ ] Formulaire de lead → soumission → entrée dans la table `leads`

---

## Récapitulatif des fichiers Supabase créés

| Fichier | Rôle |
|---|---|
| `src/lib/supabase/client.ts` | Client navigateur |
| `src/lib/supabase/server.ts` | Clients SSR + admin (API routes) |
| `src/lib/supabase/AuthProvider.tsx` | Contexte auth React |
| `src/lib/supabase/cards.ts` | CRUD cartes |
| `src/lib/supabase/leads.ts` | Insert / lecture leads |
| `src/app/auth/callback/route.ts` | Échange code OAuth → session |
| `middleware.ts` | Refresh session sur chaque requête |
