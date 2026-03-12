import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123');

export async function POST(req: Request) {
  try {
    const { plan, email } = await req.json();

    if (!plan) {
      return NextResponse.json(
        { error: 'Missing plan' },
        { status: 400 }
      );
    }

    if (plan !== 'basic' && plan !== 'premium') {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Set prices according to the task: Basic = $3, Premium = $9
    const priceAmount = plan === 'basic' ? 300 : 900; // in cents
    const priceName = plan === 'basic' ? 'Basic Plan' : 'Premium Plan';
    const priceDescription = plan === 'basic' ? 'Basic features - One-time payment' : 'All Premium features - One-time payment';

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Checkout Sessions from body params.
    const checkoutOptions: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: priceName,
              description: priceDescription,
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${origin}/pricing`,
    };

    if (email) {
      checkoutOptions.customer_email = email;
    } else {
      checkoutOptions.customer_creation = 'always';
    }

    const session = await stripe.checkout.sessions.create(checkoutOptions);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
