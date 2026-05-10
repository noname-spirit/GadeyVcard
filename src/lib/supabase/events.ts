import { createClient } from './client';

export type LinkType =
  | 'instagram' | 'youtube' | 'linkedin' | 'website'
  | 'phone' | 'email' | 'whatsapp' | 'line'
  | 'calendly' | 'save'
  | 'mobile' | 'desktop' | 'tablet'
  | 'view';

// Un événement brut de la table card_events
export interface CardEvent {
  id: string;
  card_id: string;
  link_type: string;
  created_at: string;
}

// Résultat de getCardStats : vues et clics séparés avec toutes les colonnes
export interface CardStats {
  views: CardEvent[];
  clicks: CardEvent[];
}

export function trackCardEvent(cardId: string, linkType: LinkType): void {
  if (!cardId || cardId === 'demo' || cardId === 'preview') return;
  const supabase = createClient();
  supabase.from('card_events').insert({ card_id: cardId, link_type: linkType }).then();
}

export async function getCardStats(cardId: string): Promise<CardStats> {
  if (!cardId) return { views: [], clicks: [] };
  const supabase = createClient();
  const { data, error } = await supabase
    .from('card_events')
    // On sélectionne tout pour avoir created_at (nécessaire pour les graphiques)
    .select('*')
    .eq('card_id', cardId);
  if (error || !data) return { views: [], clicks: [] };
  // Sépare les vues de page des clics sur les liens
  const views = data.filter((e) => e.link_type === 'view') as CardEvent[];
  const clicks = data.filter((e) => e.link_type !== 'view') as CardEvent[];
  return { views, clicks };
}
