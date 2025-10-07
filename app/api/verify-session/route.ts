import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ paid: false, error: 'Missing session_id' }, { status: 400 });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid' || session.status === 'complete';
    return NextResponse.json({ paid });
  } catch (e: any) {
    return NextResponse.json({ paid: false, error: e?.message ?? 'Stripe error' }, { status: 400 });
  }
}
