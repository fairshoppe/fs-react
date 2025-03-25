"use client";

import React, { Suspense } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Button, ButtonGroup } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/services/db';
import ServicePageLayout from '@/components/ServicePageLayout';

const backgroundImages = [
  '/backgrounds/store1.jpeg',
  '/backgrounds/store2.jpeg',
  '/backgrounds/store3.jpeg',
  '/backgrounds/store4.jpeg',
  '/backgrounds/store5.jpeg'
];

function ThriftContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  const { products, loading, error } = useProducts(category);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2, fontFamily: 'var(--font-markazi)' }}>
          Loading products...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error" sx={{ fontFamily: 'var(--font-markazi)' }}>
          Error loading products: {error}
        </Typography>
      </Box>
    );
  }

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <ServicePageLayout title="The Thrift Shoppe" backgroundImages={backgroundImages}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{
            textAlign: 'center', 
            mb: 6,
            fontFamily: 'var(--font-markazi)'
          }}
        >
          Discover unique treasures and vintage finds in our carefully curated collection.
        </Typography>

        {/* Search Results Message */}
        {searchQuery && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            Showing results for "{searchQuery}"
          </Typography>
        )}

        {/* No Results Message */}
        {!loading && filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" sx={{ fontFamily: 'var(--font-markazi)' }}>
              No products found
            </Typography>
          </Box>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <Grid container spacing={4}>
            {filteredProducts.map((product: Product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard {...product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ServicePageLayout>
  );
}

export default function ThriftPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThriftContent />
    </Suspense>
  );
} 