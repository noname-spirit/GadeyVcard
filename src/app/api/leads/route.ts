import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/supabase/leads';
import type { Lead } from '@/types/lead';

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

    const lead: Lead = {
      card_id,
      name: nom.trim(),
      email: contact.trim(),
      phone: telephone?.trim() || undefined,
      domain: domaine?.trim() || undefined,
      message: message?.trim() || undefined,
    };

    const { error } = await submitLead(lead);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
