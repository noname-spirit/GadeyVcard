import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminClient();

  const [
    { data: profiles },
    { data: cards },
    { data: leads },
    { data: { users: authUsers } },
  ] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('cards').select('id, user_id, slug'),
    supabase.from('leads').select('id, card_id'),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  const emailMap: Record<string, string> = {};
  const lastSignInMap: Record<string, string> = {};
  (authUsers ?? []).forEach((u) => {
    emailMap[u.id] = u.email ?? '';
    lastSignInMap[u.id] = u.last_sign_in_at ?? '';
  });

  // First card per user
  const cardByUser: Record<string, { slug: string; id: string }> = {};
  (cards ?? []).forEach((c: { id: string; user_id: string; slug: string }) => {
    if (!cardByUser[c.user_id]) cardByUser[c.user_id] = { slug: c.slug, id: c.id };
  });

  // Leads count per card
  const leadsByCard: Record<string, number> = {};
  (leads ?? []).forEach((l: { card_id: string }) => {
    leadsByCard[l.card_id] = (leadsByCard[l.card_id] ?? 0) + 1;
  });

  // Leads count per user
  const leadsByUser: Record<string, number> = {};
  Object.entries(cardByUser).forEach(([userId, card]) => {
    leadsByUser[userId] = leadsByCard[card.id] ?? 0;
  });

  return NextResponse.json({
    profiles: profiles ?? [],
    cardByUser,
    leadsByUser,
    emailMap,
    lastSignInMap,
  });
}

export async function PATCH(req: NextRequest) {
  const { userId, plan } = await req.json();
  if (!userId || !plan) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const supabase = createAdminClient();
  const [{ error: e1 }, { error: e2 }] = await Promise.all([
    supabase.from('profiles').update({ plan }).eq('id', userId),
    supabase.from('cards').update({ plan }).eq('user_id', userId),
  ]);

  if (e1 || e2) return NextResponse.json({ error: e1?.message ?? e2?.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
