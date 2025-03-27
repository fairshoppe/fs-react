'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Box, Typography, Button, Grid, Paper, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import CheckoutButton from '@/components/checkout/CheckoutButton';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleContinueShopping = () => {
    router.push('/thrift');
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  if (state.isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (state.items.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        p={3}
      >
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Looks like you haven't added any items to your cart yet.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleContinueShopping}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {state.items.map((item) => (
            <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Grid>
                <Grid item xs={9}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">{item.title}</Typography>
                      <Typography color="text.secondary">Quantity: {item.quantity}</Typography>
                      <Typography color="primary">${item.price.toFixed(2)}</Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label="remove item"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Subtotal</Typography>
              <Typography>${state.total.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Shipping</Typography>
              <Typography>Free</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${state.total.toFixed(2)}</Typography>
            </Box>
            <CheckoutButton />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 