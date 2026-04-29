import { createClient } from './client';
import type { Lead } from '@/types/lead';

export async function submitLead(lead: Lead): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('leads').insert([{
    card_id: lead.card_id,
    name: lead.name,
    email: lead.email ?? null,
    phone: lead.phone ?? null,
    domain: lead.domain ?? null,
    message: lead.message ?? null,
  }]);
  if (error) return { error: error.message };
  return { error: null };
}

export async function getLeadsByCardId(cardId: string): Promise<Lead[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as Lead[];
}
