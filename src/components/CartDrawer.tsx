'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  TextField,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { logger, logError } from '@/utils/logger';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useRouter } from 'next/navigation';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface ShippingAddress {
  name: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity: newQuantity } });
  };

  const handleRemoveItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Checkout failed'), 'Cart Checkout');
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestCheckout = () => {
    onClose();
    router.push('/shipping');
  };

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          Shopping Cart
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
        {state.items.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            Your cart is empty
          </Typography>
        ) : (
          <List>
            {state.items.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.price.toFixed(2)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      size="small"
                      sx={{ width: 60 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveItem(item.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography>${total.toFixed(2)}</Typography>
        </Box>
        <Typography color="text.secondary" gutterBottom align="center" sx={{ mt: 2 }}>
          Please log in or continue as guest to proceed with checkout
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            disabled={state.items.length === 0 || loading}
            onClick={handleGuestCheckout}
          >
            Log In
          </Button>
          <Button
            variant="outlined"
            fullWidth
            disabled={state.items.length === 0 || loading}
            onClick={handleGuestCheckout}
          >
            Continue as Guest
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CartDrawer; 