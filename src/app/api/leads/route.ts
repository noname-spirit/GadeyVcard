import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/supabase/leads';
import { createAdminClient } from '@/lib/supabase/server';
import { sendLeadNotificationEmail } from '@/lib/email';
import type { Lead } from '@/types/lead';

const PLAN_LIMITS: Record<string, number> = {
  starter: 500,
  pro: 1000,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { card_id, nom, contact, telephone, domaine, message } = body;

    if (!card_id || card_id === 'demo' || !nom?.trim() || !contact?.trim()) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (card_id, nom, contact).' },
        { status: 400 }
      );
    }

    // Vérification limite de leads selon le plan
    const supabase = createAdminClient();
    const { data: card } = await supabase
      .from('cards')
      .select('user_id')
      .eq('id', card_id)
      .single();

    if (card?.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', card.user_id)
        .single();

      const plan = profile?.plan as string;
      const limit = PLAN_LIMITS[plan];

      if (limit !== undefined) {
        const { count } = await supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('card_id', card_id);

        if ((count ?? 0) >= limit) {
          return NextResponse.json(
            { error: 'LIMIT_REACHED', plan, limit },
            { status: 403 }
          );
        }
      }
    }

    const lead: Lead = {
      card_id,
      name: nom.trim(),
      email: contact.trim(),
      phone: telephone?.trim() || undefined,
      domain: domaine?.trim() || undefined,
      message: message?.trim() || undefined,
      status: undefined
    };

    const { error } = await submitLead(lead);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Notification email — fire and forget, ne bloque pas la réponse
    notifyOwner(card_id, lead).catch(() => {});

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}

async function notifyOwner(cardId: string, lead: Lead): Promise<void> {
  const supabase = createAdminClient();

  const { data: card } = await supabase
    .from('cards')
    .select('user_id, slug, name')
    .eq('id', cardId)
    .single();

  if (!card?.user_id) return;

  const { data: { user } } = await supabase.auth.admin.getUserById(card.user_id);
  if (!user?.email) return;

  await sendLeadNotificationEmail({
    to: user.email,
    ownerName: card.name,
    cardSlug: card.slug,
    lead: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      domain: lead.domain,
      message: lead.message,
    },
  });
}
