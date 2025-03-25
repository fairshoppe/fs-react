'use client';

import { Box, Container, Typography, Paper, Grid, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '@/contexts/CartContext';
import CheckoutButton from '@/components/checkout/CheckoutButton';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { data: session } = useSession();

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (state.items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography color="text.secondary">
            Add some items to your cart to proceed with checkout
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {state.items.map((item) => (
              <Box key={item.id}>
                <Grid container spacing={2} alignItems="center" sx={{ py: 2 }}>
                  {/* Product Image */}
                  <Grid item xs={3}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '100%',
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  </Grid>

                  {/* Product Details */}
                  <Grid item xs={6}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography color="text.secondary">
                      ${item.price.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity}
                    </Typography>
                  </Grid>

                  {/* Remove Button */}
                  <Grid item xs={3} sx={{ textAlign: 'right' }}>
                    <IconButton
                      onClick={() => removeFromCart(item.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${total.toFixed(2)}</Typography>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container justifyContent="space-between">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </Grid>
            </Box>

            {/* Checkout Button */}
            <CheckoutButton userId={session?.user?.id} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 