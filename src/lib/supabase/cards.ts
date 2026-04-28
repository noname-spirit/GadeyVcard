import { createClient } from './client';
import type { CardData } from '@/types/card';

export interface SupabaseCard {
  id: string;
  uid: string;
  slug: string;
  name: string;
  title: string;
  photo: string | null;
  contact: {
    phone?: string | null;
    email?: string | null;
    whatsapp?: string | null;
    line?: string | null;
  };
  socials: {
    instagram?: string | null;
    youtube?: string | null;
    linkedin?: string | null;
    website?: string | null;
  };
  accent_color: string;
  template: string;
  plan: 'free' | 'starter' | 'pro' | null;
  vcf: string | null;
  created_at: string;
  updated_at: string;
}

export function supabaseCardToCardData(c: SupabaseCard): CardData {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    title: c.title,
    photo: c.photo ?? '',
    contact: {
      phone: c.contact?.phone ?? undefined,
      email: c.contact?.email ?? undefined,
      whatsapp: c.contact?.whatsapp ?? undefined,
      line: c.contact?.line ?? undefined,
    },
    socials: {
      instagram: c.socials?.instagram ?? undefined,
      youtube: c.socials?.youtube ?? undefined,
      linkedin: c.socials?.linkedin ?? undefined,
      website: c.socials?.website ?? undefined,
    },
    accentColor: c.accent_color ?? '#f97316',
    template: (c.template as CardData['template']) ?? 'dark',
    plan: (c.plan as CardData['plan']) ?? undefined,
    updatedAt: c.updated_at,
  };
}

export async function getCardBySlug(slug: string): Promise<SupabaseCard | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data as SupabaseCard;
}

export async function getCardsByUid(uid: string): Promise<SupabaseCard[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('uid', uid)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as SupabaseCard[];
}

export async function upsertCard(uid: string, card: {
  slug: string;
  name: string;
  title: string;
  photo?: string;
  contact?: Record<string, string | null>;
  socials?: Record<string, string | null>;
  accent_color?: string;
  template?: string;
  plan?: string;
}): Promise<{ slug: string } | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cards')
    .upsert(
      { ...card, uid, updated_at: new Date().toISOString() },
      { onConflict: 'slug' }
    )
    .select('slug')
    .single();
  if (error) { console.error(error); return null; }
  return data;
}
