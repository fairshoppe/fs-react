'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  Grid,
} from '@mui/material';
import { ShoppingCart, Close as CloseIcon } from '@mui/icons-material';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  size?: string;
  brand?: string;
  category: string;
  description?: string;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  condition,
  size,
  brand,
  category,
  description,
  onClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id,
        title,
        price,
        image,
        category,
        quantity: 1,
      },
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        <Box sx={{ position: 'relative', paddingTop: '100%' }}>
          <CardMedia
            component="img"
            image={image}
            alt={title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              cursor: 'pointer',
            }}
            onClick={handleClick}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontFamily: 'var(--font-markazi)',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          {brand && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {brand}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={condition}
              size="small"
              color="primary"
              variant="outlined"
            />
            {size && (
              <Chip
                label={size}
                size="small"
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
          <Typography variant="h6" color="primary" gutterBottom>
            ${price.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            fullWidth
            onClick={handleAddToCart}
            sx={{
              fontFamily: 'var(--font-markazi)',
            }}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      {/* Product Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ position: 'relative', p: 2 }}>
          <IconButton
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', paddingTop: '100%' }}>
                <Image
                  src={image}
                  alt={title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontFamily: 'var(--font-markazi)',
                  mb: 2,
                }}
              >
                {title}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                ${price.toFixed(2)}
              </Typography>
              {description && (
                <Typography variant="body1" paragraph>
                  {description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={condition}
                  color="primary"
                  variant="outlined"
                />
                {size && (
                  <Chip
                    label={size}
                    color="secondary"
                    variant="outlined"
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Brand: {brand}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Category: {category}
              </Typography>
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                fullWidth
                onClick={handleAddToCart}
                sx={{
                  mt: 2,
                  fontFamily: 'var(--font-markazi)',
                }}
              >
                Add to Cart
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
};

export default ProductCard; 