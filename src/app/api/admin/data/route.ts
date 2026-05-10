import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminClient();

  const [{ data: profiles, error: pe }, { data: cards, error: ce }] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('cards').select('id, user_id'),
  ]);

  if (pe) return NextResponse.json({ error: pe.message }, { status: 500 });
  if (ce) return NextResponse.json({ error: ce.message }, { status: 500 });

  return NextResponse.json({ profiles: profiles ?? [], cards: cards ?? [] });
}
