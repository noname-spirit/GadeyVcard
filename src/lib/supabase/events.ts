import { createClient } from './client';

export type LinkType =
  | 'instagram' | 'youtube' | 'linkedin' | 'website'
  | 'phone' | 'email' | 'whatsapp' | 'line'
  | 'view';

export function trackCardEvent(cardId: string, linkType: LinkType): void {
  if (!cardId || cardId === 'demo' || cardId === 'preview') return;
  const supabase = createClient();
  supabase.from('card_events').insert({ card_id: cardId, link_type: linkType }).then();
}

export async function getCardStats(cardId: string): Promise<{ views: number; clicks: number }> {
  if (!cardId) return { views: 0, clicks: 0 };
  const supabase = createClient();
  const { data, error } = await supabase
    .from('card_events')
    .select('link_type')
    .eq('card_id', cardId);
  if (error || !data) return { views: 0, clicks: 0 };
  const views = data.filter((e) => e.link_type === 'view').length;
  const clicks = data.filter((e) => e.link_type !== 'view').length;
  return { views, clicks };
}
