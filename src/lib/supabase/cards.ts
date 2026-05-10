import { createClient } from './client';
import type { CardData } from '@/types/card';

export interface SupabaseCard {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  title: string | null;
  photo: string | null;
  accent_color: string;
  template: string;
  plan: 'free' | 'starter' | 'pro' | null;
  // Contact — colonnes plates
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  line_contact: string | null;
  // Socials — colonnes plates
  instagram: string | null;
  youtube: string | null;
  linkedin: string | null;
  website: string | null;
  tiktok: string | null;
  twitter: string | null;
  // Pro features
  calendly_url: string | null;
  availability_status: string | null;
  availability_text: string | null;
  // Meta
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export function supabaseCardToCardData(c: SupabaseCard): CardData {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    title: c.title ?? '',
    photo: c.photo ?? '',
    contact: {
      phone: c.phone ?? undefined,
      email: c.email ?? undefined,
      whatsapp: c.whatsapp ?? undefined,
      line: c.line_contact ?? undefined,
    },
    socials: {
      instagram: c.instagram ?? undefined,
      youtube: c.youtube ?? undefined,
      linkedin: c.linkedin ?? undefined,
      website: c.website ?? undefined,
      tiktok: c.tiktok ?? undefined,
      twitter: c.twitter ?? undefined,
    },
    accentColor: c.accent_color ?? '#f97316',
    template: (c.template as CardData['template']) ?? 'dark',
    plan: (c.plan as CardData['plan']) ?? undefined,
    updatedAt: c.updated_at,
    calendlyUrl: c.calendly_url ?? undefined,
    availabilityStatus: c.availability_status ?? undefined,
    availabilityText: c.availability_text ?? undefined,
  };
}

export async function getCardBySlug(slug: string): Promise<SupabaseCard | null> {
  console.log(slug, "slug in getCardBySlug");
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) {
    console.log('getCardBySlug error:', error.message, data);
    return null;
  }
  return data as SupabaseCard | null;
}

export async function getCardsByUid(uid: string): Promise<SupabaseCard[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as SupabaseCard[];
}

export async function updateCard(id: string, card: {
  slug?: string;
  name?: string;
  title?: string;
  photo?: string;
  contact?: { phone?: string | null; email?: string | null; whatsapp?: string | null; line?: string | null };
  socials?: { instagram?: string | null; youtube?: string | null; linkedin?: string | null; website?: string | null; tiktok?: string | null; twitter?: string | null };
  accent_color?: string;
  template?: string;
  calendly_url?: string | null;
  availability_status?: string | null;
  availability_text?: string | null;
}): Promise<boolean> {
  const supabase = createClient();
  const { contact, socials, ...rest } = card;
  console.log('Updating card with id:', id, 'and data:', card,contact, socials, rest);
  const { error } = await supabase
    .from('cards')
    .update({
      ...rest,
      phone: contact?.phone ?? null,
      email: contact?.email ?? null,
      whatsapp: contact?.whatsapp ?? null,
      line_contact: contact?.line ?? null,
      instagram: socials?.instagram ?? null,
      youtube: socials?.youtube ?? null,
      linkedin: socials?.linkedin ?? null,
      website: socials?.website ?? null,
      tiktok: socials?.tiktok ?? null,
      twitter: socials?.twitter ?? null,
       accent_color: card.accent_color,
       template: card.template,
       calendly_url: card.calendly_url ?? null,
       availability_status: card.availability_status ?? null,
       availability_text: card.availability_text ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) { console.error('updateCard:', error.message); return false; }
  return true;
}

export async function upsertCard(uid: string, card: {
  slug: string;
  name: string;
  title?: string;
  photo?: string;
  contact?: { phone?: string | null; email?: string | null; whatsapp?: string | null; line?: string | null };
  socials?: { instagram?: string | null; youtube?: string | null; linkedin?: string | null; website?: string | null; tiktok?: string | null; twitter?: string | null };
  accent_color?: string;
  template?: string;
  plan?: string;
  calendly_url?: string | null;
  availability_status?: string | null;
  availability_text?: string | null;
}): Promise<{ slug: string } | null> {
  const supabase = createClient();
  const { contact, socials, ...rest } = card;
  const { data, error } = await supabase
    .from('cards')
    .upsert(
      {
        ...rest,
        user_id: uid,
        phone: contact?.phone ?? null,
        email: contact?.email ?? null,
        whatsapp: contact?.whatsapp ?? null,
        line_contact: contact?.line ?? null,
        instagram: socials?.instagram ?? null,
        youtube: socials?.youtube ?? null,
        linkedin: socials?.linkedin ?? null,
        website: socials?.website ?? null,
        tiktok: socials?.tiktok ?? null,
        twitter: socials?.twitter ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    )
    .select('slug')
    .single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function getAllCards(): Promise<{ id: string; user_id: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('cards').select('id, user_id');
  if (error) { console.error('getAllCards:', error.message); return []; }
  return (data ?? []) as { id: string; user_id: string }[];
}

export async function updateCardPlan(uid: string, plan: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('cards').update({ plan }).eq('user_id', uid);
  if (error) console.error('updateCardPlan:', error.message);
}
