import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, items } = body;

    // Log the incoming request data
    console.log('Received request body:', JSON.stringify(body, null, 2));

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided in the request' },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: 'No address provided in the request' },
        { status: 400 }
      );
    }

    // Create tax calculation with detailed line items
    const calculation = await stripe.tax.calculations.create({
      currency: 'usd',
      line_items: items.map(item => ({
        amount: Math.round(item.price * item.quantity * 100),
        reference: item.id,
        quantity: item.quantity
      })),
      customer_details: {
        address: {
          line1: address.street1,
          line2: address.street2 || '',
          city: address.city,
          state: address.state,
          postal_code: address.zip,
          country: address.country
        }
      }
    });

    return NextResponse.json({
      total: calculation.amount_total / 100,
      tax_amount: calculation.tax_amount_exclusive / 100,
      tax_breakdown: calculation.tax_breakdown
    });

  } catch (error) {
    console.error('Tax calculation error:', error);
    let errorMessage = 'Tax calculation failed';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = error.message as string;
    }
    
    return NextResponse.json(
      { error: `Tax calculation error: ${errorMessage}` },
      { status: 500 }
    );
  }
}