import { useState, useEffect } from 'react';
import { logger, logError } from '@/utils/logger';
import { productService, Product } from '@/services/db';

export function useProducts(category?: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const allProducts = await productService.getAllProducts();
        
        if (category && category !== 'all') {
          setProducts(allProducts.filter(product => product.category === category));
        } else {
          setProducts(allProducts);
        }
      } catch (err) {
        logError(err instanceof Error ? err : new Error('Failed to fetch products'), 'Products Hook');
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [category]);

  return { products, loading, error };
} 