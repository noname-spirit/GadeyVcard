// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text(); // important : raw text, pas JSON

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    const { userId, planId } = intent.metadata; // ← on récupère les infos
   console.log(userId, planId, '<-- webhook data');
    const supabase = createAdminClient();
    await supabase.from('profiles').update({ plan: planId }).eq('id', userId);
    await supabase.from('cards').update({ plan: planId }).eq('user_id', userId);
  }

  return NextResponse.json({ received: true });
}
