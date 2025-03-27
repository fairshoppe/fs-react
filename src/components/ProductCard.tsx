"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useCart } from '@/contexts/CartContext';
import { logger } from '@/utils/logger';
import { Product } from '@/services/db';


interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

//type ProductCardProps = {
  //product: Pick<Product, 'id' | 'title' | 'price' | 'image'>;
  //onClick: () => void;
//};

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { dispatch } = useCart();

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handleAddToCart = () => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { ...product, quantity: 1 } 
    });
    logger.info('Added to cart', { productId: product.id, title: product.title });
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {truncateText(product.description, 100)}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <span className="font-semibold">Specs:</span>{' '}
          {truncateText(product.size.split('\n')[0], 50)}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <span className="font-semibold">Size:</span> {product.size}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="h6" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            disabled={product.inventory === 0}
          >
            {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 