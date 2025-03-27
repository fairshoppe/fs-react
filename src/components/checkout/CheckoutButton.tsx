'use client';

import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useCart } from '@/contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { logger, logError } from '@/utils/logger';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutButtonProps {
  userId?: string;
  onCheckout?: () => void;
}

export default function CheckoutButton({ userId, onCheckout }: CheckoutButtonProps) {
  const { state } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (!url) {
        throw new Error('No checkout URL received');
      }

      // Call the onCheckout callback if provided
      if (onCheckout) {
        onCheckout();
      }

      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Checkout failed'), 'Checkout Button');
      alert('Failed to start checkout process. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleCheckout}
      disabled={loading || state.items.length === 0}
      fullWidth
      sx={{
        fontFamily: 'var(--font-markazi)',
        fontSize: '1.2rem',
        py: 1.5,
      }}
    >
      {loading ? 'Processing...' : 'Proceed to Checkout'}
    </Button>
  );
} 