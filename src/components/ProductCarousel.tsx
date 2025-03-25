"use client";

import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import ProductCard from './product/ProductCard';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: string;
  size?: string;
  brand?: string;
  category: string;
  description?: string;
}

interface ProductCarouselProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  onProductClick,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
        }}
      >
        {products.map((product, index) => (
          <Box
            key={product.id}
            sx={{
              flex: '0 0 100%',
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            <ProductCard {...product} />
          </Box>
        ))}
      </Box>

      {products.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'background.paper',
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default ProductCarousel; 