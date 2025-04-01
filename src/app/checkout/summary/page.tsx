'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutSummaryPage() {
  const { state } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0825; // Default 8.25% tax rate
  const total = subtotal + tax;

  const handleCheckout = async () => {
    try {
      setLoading(true);
      // Here you would integrate with your payment processor
      // For now, we'll just redirect to success page
      router.push('/checkout/success');
    } catch (err) {
      console.error('Checkout failed:', err);
      setError('Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: 'var(--font-markazi)' }}>
        Order Summary
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'var(--font-markazi)' }}>
              Items
            </Typography>
            {state.items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover' }}
                  />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price.toFixed(2)} each
                  </Typography>
                </Box>
                <Typography variant="subtitle1">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'var(--font-markazi)' }}>
              Order Total
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax (8.25%):</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </Box>
            </Box>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              disabled={loading || state.items.length === 0}
            >
              {loading ? <CircularProgress size={24} /> : 'Complete Purchase'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}