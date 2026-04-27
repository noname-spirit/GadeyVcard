import { NextRequest, NextResponse } from 'next/server';
import { submitLead } from '@/lib/supabase/leads';
import type { Lead } from '@/types/lead';

// TODO(G): ajouter rate limiting par IP quand Supabase est actif
// import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { card_slug, nom, contact, telephone, domaine, message, source, language } = body;

    if (!card_slug || !nom?.trim() || !contact?.trim()) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (card_slug, nom, contact).' },
        { status: 400 }
      );
    }

    const lead: Lead = {
      card_slug,
      nom: nom.trim(),
      contact: contact.trim(),
      telephone: telephone?.trim() || undefined,
      domaine: domaine?.trim() || undefined,
      message: message?.trim() || undefined,
      source: source ?? 'formulaire',
      language: language ?? 'fr',
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
