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
    status: lead.status ?? null,
    notes: lead.notes ?? null,
    source: lead.source ?? null,  
  }]);
  if (error) return { error: error.message };
  return { error: null };
}

export async function updateLead(
  id: string,
  fields: { status?: string | null; notes?: string | null; source?: string | null }
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const dbFields: Record<string, string | null | undefined> = {};
  if ('status' in fields) dbFields['status'] = fields.status ?? null;
  if ('notes' in fields) dbFields['notes'] = fields.notes ?? null;
  if ('source' in fields) dbFields['source'] = fields.source ?? null;
  const { error } = await supabase.from('leads').update(dbFields).eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function deleteLead(id: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.from('leads').delete().eq('id', id);
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
