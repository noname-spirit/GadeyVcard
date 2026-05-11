import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createAdminClient();

  const [{ data: cards }, { data: leads }, { data: profiles }] = await Promise.all([
    supabase.from('cards').select('*').order('created_at', { ascending: false }),
    supabase.from('leads').select('id, card_id'),
    supabase.from('profiles').select('id, full_name, plan'),
  ]);

  const leadsByCard: Record<string, number> = {};
  (leads ?? []).forEach((l: { card_id: string }) => {
    leadsByCard[l.card_id] = (leadsByCard[l.card_id] ?? 0) + 1;
  });

  const profileMap: Record<string, { full_name: string | null; plan: string }> = {};
  (profiles ?? []).forEach((p: { id: string; full_name: string | null; plan: string }) => {
    profileMap[p.id] = { full_name: p.full_name, plan: p.plan };
  });

  return NextResponse.json({
    cards: (cards ?? []).map((c: { id: string; user_id: string }) => ({
      ...c,
      leadsCount: leadsByCard[c.id] ?? 0,
      ownerName: profileMap[c.user_id]?.full_name ?? '—',
      ownerPlan: profileMap[c.user_id]?.plan ?? 'free',
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const { cardId, is_active } = await req.json();
  if (!cardId) return NextResponse.json({ error: 'Missing cardId' }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from('cards').update({ is_active }).eq('id', cardId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
