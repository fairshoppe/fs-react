import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logger, logError } from '@/utils/logger';
import { handleApiError } from '@/utils/api-error';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, amounts } = body;

    console.log('Received checkout data:', {
      items,
      amounts
    });

    logger.info('Creating checkout session', { itemCount: items.length });

    if (!items?.length) {
      logger.warn('No items provided for checkout');
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const sessionData: Stripe.Checkout.SessionCreateParams = {
      line_items,
      mode: 'payment' as const,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/summary`,
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        tax_amount: Math.round(amounts.tax * 100).toString(),
        subtotal: Math.round(amounts.subtotal * 100).toString(),
        total: Math.round(amounts.total * 100).toString(),
      }
    };

    console.log('Creating session with data:', sessionData);

    try {
      const session = await stripe.checkout.sessions.create(sessionData);
      logger.info('Checkout session created', { sessionId: session.id });
      return NextResponse.json({ url: session.url });
    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      return handleApiError(stripeError, 'Checkout');
    }
  } catch (error) {
    console.error('General checkout error:', error);
    return handleApiError(error, 'Checkout');
  }
} 