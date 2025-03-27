import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logger, logError } from '@/utils/logger';
import { handleApiError } from '@/utils/api-error';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    logger.info('Creating checkout session', { itemCount: items.length });

    if (!items?.length) {
      logger.warn('No items provided for checkout');
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: item.description,
          images: [item.imageUrl],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'],
      },
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
        }))),
      },
    });

    logger.info('Checkout session created', { sessionId: session.id });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return handleApiError(error, 'Checkout');
  }
} 