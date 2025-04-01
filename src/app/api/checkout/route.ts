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
    const { items, shipping_address, amounts } = body;

    console.log('Received checkout data:', {
      items,
      shipping_address,
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

    const sessionData = {
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/summary`,
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(amounts.shipping * 100),
              currency: 'usd',
            },
            display_name: 'Selected Shipping Method',
          },
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        tax_amount: Math.round(amounts.tax * 100),
        subtotal: Math.round(amounts.subtotal * 100),
        total: Math.round(amounts.total * 100),
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