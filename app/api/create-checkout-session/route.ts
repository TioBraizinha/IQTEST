import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const currency = String((body.currency ?? 'eur')).toLowerCase();
    if (!['eur', 'usd'].includes(currency)) {
      return NextResponse.json({ error: 'Moeda inválida' }, { status: 400 });
    }

    const amounts: Record<'eur' | 'usd', number> = { eur: 99, usd: 99 };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amounts[currency as 'eur' | 'usd'],
            product_data: { name: 'Instant IQ – Acesso ao relatório' },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/?canceled=1`,
    });

    return NextResponse.json({ id: session.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Stripe error' }, { status: 400 });
  }
}
