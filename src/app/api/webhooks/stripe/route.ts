import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { logger, logError } from '@/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      if (err instanceof Error) {
        logError(err, 'Stripe Webhook Signature');
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        logger.info('Checkout completed', {
          sessionId: session.id,
          customerId: session.customer,
          amount: session.amount_total,
          currency: session.currency,
          status: session.payment_status,
        });

        // Log tax details if available
        if (session.total_details) {
          logger.info('Tax details', {
            amount_tax: session.total_details.amount_tax,
            breakdown: session.total_details.breakdown,
          });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info('Payment succeeded', { paymentIntentId: paymentIntent.id });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info('Payment failed', { paymentIntentId: paymentIntent.id });
        break;
      }

      default: {
        logger.info(`Unhandled event type: ${event.type}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logError(error instanceof Error ? error : new Error('Unknown error'), 'Stripe Webhook');
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 