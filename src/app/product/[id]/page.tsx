import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  Button,
  Paper,
} from '@mui/material';
import Image from 'next/image';
import { ShoppingCart } from '@mui/icons-material';

// This will be replaced with actual data fetching from your database
const getProduct = (id: string) => {
  // Mock product data
  return {
    id,
    title: 'Vintage Denim Jacket',
    price: 45.99,
    image: '/images/placeholder.jpg',
    condition: 'Excellent',
    size: 'M',
    brand: 'Levi\'s',
    category: 'Outerwear',
    description: 'Classic vintage denim jacket in excellent condition. Features traditional styling with button front closure, chest pockets, and adjustable waist tabs. The denim has a perfect worn-in look while maintaining its structural integrity.',
  };
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={6}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '500px',
              }}
            >
              <Image
                src={product.image}
                alt={product.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.title}
            </Typography>

            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip
                label={product.condition}
                color="secondary"
                sx={{ borderRadius: 1 }}
              />
              {product.size && (
                <Chip
                  label={`Size: ${product.size}`}
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              )}
              {product.brand && (
                <Chip
                  label={product.brand}
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Box>

            <Typography variant="body1" color="text.secondary" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ mt: 'auto', pt: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                fullWidth
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
} 