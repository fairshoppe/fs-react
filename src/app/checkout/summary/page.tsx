'use client';

import React, { useEffect, useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutSummaryPage() {
  const { state } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  // Safely get and parse the shipping address
  const shippingAddressStr = searchParams.get('shippingAddress');
  const shippingAddress = shippingAddressStr 
    ? JSON.parse(decodeURIComponent(shippingAddressStr))
    : {};

  useEffect(() => {
    const calculateTotals = async () => {
      try {
        setLoading(true);
        
        // Parse shipping rate and address from URL params
        const shippingRate = JSON.parse(decodeURIComponent(searchParams.get('shippingRate') || '{}'));
        
        // Calculate subtotal
        const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Get shipping cost from selected rate
        const shippingCost = parseFloat(shippingRate.amount) || 0;

        // Calculate tax
        const requestBody = {
          address: {
            street1: shippingAddress.street1,
            street2: shippingAddress.street2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zip: shippingAddress.zipCode,
            country: shippingAddress.country
          },
          items: state.items.map(item => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
          }))
        };

        console.log('Request Body:', requestBody);

        const taxResponse = await fetch('/api/tax/calculate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!taxResponse.ok) {
          throw new Error('Failed to calculate tax');
        }

        const taxData = await taxResponse.json();
        // If Stripe returns 0 tax, calculate default 8.25%
        const taxAmount = taxData.tax_amount || (subtotal * 0.0825);

        // Update summary
        setSummary({
          subtotal,
          shipping: shippingCost,
          tax: taxAmount,
          total: subtotal + shippingCost + taxAmount
        });

      } catch (err) {
        console.error('Error calculating totals:', err);
        setError('Failed to calculate order totals');
      } finally {
        setLoading(false);
      }
    };

    calculateTotals();
  }, [state.items, searchParams]);

  const handleCheckout = async () => {
    try {
      const checkoutData = {
        items: state.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          title: item.title
        })),
        shipping_address: {
          name: shippingAddress.name,
          street1: shippingAddress.street1,
          street2: shippingAddress.street2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.zipCode,
          country: shippingAddress.country
        },
        amounts: {
          subtotal: summary.subtotal,
          shipping: summary.shipping,
          tax: summary.tax,
          total: summary.total
        }
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      router.push(url); // Redirect to Stripe checkout
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Failed to proceed to checkout');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Order Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            {state.items.map((item) => (
              <Box key={item.id} sx={{ py: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={9} sm={10}>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Order Totals */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Details
            </Typography>
            <Box sx={{ my: 2 }}>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${summary.subtotal.toFixed(2)}</Typography>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>${summary.shipping.toFixed(2)}</Typography>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Tax</Typography>
                <Typography>${summary.tax.toFixed(2)}</Typography>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container justifyContent="space-between">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${summary.total.toFixed(2)}</Typography>
              </Grid>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{ mt: 2 }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}