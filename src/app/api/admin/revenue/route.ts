import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const PLAN_PRICES: Record<string, number> = {
  starter: 9,
  pro: 22,
  business: 49,
};

export async function GET() {
  const supabase = createAdminClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('plan, created_at');

  const mrr = (profiles ?? []).reduce((sum: number, p: { plan: string }) => {
    return sum + (PLAN_PRICES[p.plan] ?? 0);
  }, 0);

  const planCounts: Record<string, number> = { free: 0, starter: 0, pro: 0, business: 0 };
  (profiles ?? []).forEach((p: { plan: string }) => {
    planCounts[p.plan] = (planCounts[p.plan] ?? 0) + 1;
  });

  // Monthly new paid users (this month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const newPaidThisMonth = (profiles ?? []).filter((p: { plan: string; created_at: string }) => {
    return p.plan !== 'free' && new Date(p.created_at) >= startOfMonth;
  }).length;

  let transactions: object[] = [];
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    try {
      const stripe = new Stripe(stripeKey);
      const intents = await stripe.paymentIntents.list({ limit: 50 });
      transactions = intents.data
        .filter((i) => i.status === 'succeeded')
        .map((i) => ({
          id: i.id,
          amount: i.amount / 100,
          currency: i.currency,
          planId: i.metadata?.planId ?? '—',
          userId: i.metadata?.userId ?? null,
          billing: i.metadata?.billing ?? 'monthly',
          created: i.created,
        }));
    } catch {
      transactions = [];
    }
  }

  return NextResponse.json({
    mrr,
    arr: mrr * 12,
    newPaidThisMonth,
    planCounts,
    transactions,
  });
}
