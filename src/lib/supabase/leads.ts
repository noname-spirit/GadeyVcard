import type { Lead } from '@/types/lead';

// TODO(G): activer quand la table `leads` est créée dans Supabase
// Schema attendu :
//   id          uuid primary key default gen_random_uuid()
//   card_slug   text not null
//   nom         text not null
//   contact     text not null
//   telephone   text
//   domaine     text
//   message     text
//   source      text not null default 'formulaire'
//   language    text
//   created_at  timestamptz not null default now()

export async function submitLead(lead: Lead): Promise<{ error: string | null }> {
  // -- SUPABASE (décommenter quand la table est prête) --
  // const { createClient } = await import('./client');
  // const supabase = createClient();
  // const { error } = await supabase.from('leads').insert([lead]);
  // if (error) return { error: error.message };
  // return { error: null };

  // -- MODE MOCK (visuel seulement) --
  await new Promise((r) => setTimeout(r, 800));
  console.info('[leads] mock submit:', lead);
  return { error: null };
}

export async function getLeadsBySlug(slug: string): Promise<Lead[]> {
  // -- SUPABASE (décommenter quand la table est prête) --
  // const { createClient } = await import('./client');
  // const supabase = createClient();
  // const { data, error } = await supabase
  //   .from('leads')
  //   .select('*')
  //   .eq('card_slug', slug)
  //   .order('created_at', { ascending: false });
  // if (error) return [];
  // return data ?? [];

  return [];
}
