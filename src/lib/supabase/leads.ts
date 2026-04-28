import { createClient } from './client';
import type { Lead } from '@/types/lead';

// TODO(G): ajouter rate limiting par IP quand Supabase est actif

export async function submitLead(lead: Lead): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('leads').insert([lead]);
  if (error) return { error: error.message };
  return { error: null };
}

export async function getLeadsBySlug(slug: string): Promise<Lead[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('card_slug', slug)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data ?? [];
}
