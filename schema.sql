-- ============================================================
-- Smart vCard — Schéma Supabase
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- TABLE : profiles
-- Données complémentaires liées à auth.users (Supabase Auth)
-- ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  plan        text not null default 'free' check (plan in ('free', 'pro', 'business')),
  trial_ends_at timestamptz default (now() + interval '14 days'),
  stripe_customer_id text unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ────────────────────────────────────────────────────────────
-- TABLE : cards
-- Une carte par utilisateur (peut évoluer vers plusieurs)
-- ────────────────────────────────────────────────────────────
create table if not exists public.cards (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  slug          text not null unique,
  name          text not null,
  title         text,
  photo         text,
  accent_color  text default '#f97316',
  template      text not null default 'dark' check (template in ('dark', 'light', 'color', 'restaurant', 'influencer')),

  -- Contact
  phone         text,
  email         text,
  whatsapp      text,
  line_contact  text,

  -- Socials
  instagram     text,
  youtube       text,
  website       text,
  linkedin      text,
  tiktok        text,
  twitter       text,

  -- Meta
  is_active     boolean not null default true,
  view_count    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists cards_slug_idx on public.cards(slug);
create index if not exists cards_user_id_idx on public.cards(user_id);

-- ────────────────────────────────────────────────────────────
-- TABLE : leads
-- Contacts récupérés via la carte publique
-- ────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id          uuid primary key default uuid_generate_v4(),
  card_id     uuid not null references public.cards(id) on delete cascade,
  name        text not null,
  email       text,
  phone       text,
  domain      text,
  message     text,
  created_at  timestamptz not null default now()
);

create index if not exists leads_card_id_idx on public.leads(card_id);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

-- ────────────────────────────────────────────────────────────
-- TABLE : menu_items
-- Pour le template Restaurant uniquement
-- ────────────────────────────────────────────────────────────
create table if not exists public.menu_items (
  id          uuid primary key default uuid_generate_v4(),
  card_id     uuid not null references public.cards(id) on delete cascade,
  category    text not null,
  name        text not null,
  description text,
  price       numeric(10,2),
  available   boolean not null default true,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists menu_items_card_id_idx on public.menu_items(card_id);

-- ────────────────────────────────────────────────────────────
-- TRIGGERS : updated_at automatique
-- ────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_cards_updated_at
  before update on public.cards
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────────────────
-- TRIGGER : créer un profil automatiquement à l'inscription
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- RLS (Row Level Security)
-- ────────────────────────────────────────────────────────────

-- profiles : chaque user voit uniquement son profil
alter table public.profiles enable row level security;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- cards : propriétaire = accès total / public = lecture si slug connu
alter table public.cards enable row level security;

create policy "cards: owner full access" on public.cards
  for all using (auth.uid() = user_id);

create policy "cards: public read by slug" on public.cards
  for select using (is_active = true);

-- leads : propriétaire de la carte = accès total
alter table public.leads enable row level security;

create policy "leads: owner read/delete" on public.leads
  for all using (
    exists (
      select 1 from public.cards
      where cards.id = leads.card_id
        and cards.user_id = auth.uid()
    )
  );

create policy "leads: public insert" on public.leads
  for insert with check (true);

-- menu_items : propriétaire = accès total / public = lecture
alter table public.menu_items enable row level security;

create policy "menu_items: owner full access" on public.menu_items
  for all using (
    exists (
      select 1 from public.cards
      where cards.id = menu_items.card_id
        and cards.user_id = auth.uid()
    )
  );

create policy "menu_items: public read" on public.menu_items
  for select using (true);
