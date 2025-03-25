'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { logger, logError } from '@/utils/logger';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inventory: number;
  createdAt?: string;
  updatedAt?: string;
}

const categories = ['Clothing', 'Accessories', 'Home', 'Electronics', 'Books'];

const conditions = ['New','Excellent', 'Good', 'Fair', 'Poor'];

export default function AdminProductsPage() {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    logger.debug('Admin products page mounted');
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      logger.info('Loading products...');
      const response = await fetch('/api/products');
      const data = await response.json();
      logger.debug('Loaded products:', data);
      setProducts(data);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to load products'), 'Admin Products');
      setError('Failed to load products');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const productData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string || '0'),
        category: formData.get('category') as string,
        imageUrl: formData.get('imageUrl') as string,
        inventory: parseInt(formData.get('inventory') as string || '0', 10),
      };

      logger.info('Submitting product data:', productData);

      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';

      if (editingProduct) {
        logger.info('Updating product:', editingProduct.id);
      } else {
        logger.info('Creating new product');
      }

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      logger.info('Reloading products after save...');
      await loadProducts();
      setEditingProduct(null);
      setShowForm(false);
      setError('');
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to save product'), 'Admin Products');
      setError('Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await loadProducts();
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to delete product'), 'Admin Products');
      setError('Failed to delete product');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Products
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          sx={{ mb: 4 }}
        >
          Add New Product
        </Button>

        {showForm && (
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="title"
                  label="Title"
                  defaultValue={editingProduct?.title || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  defaultValue={editingProduct?.description || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="price"
                  label="Price"
                  type="number"
                  defaultValue={editingProduct?.price || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    defaultValue={editingProduct?.category || ''}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="imageUrl"
                  label="Image URL"
                  defaultValue={editingProduct?.imageUrl || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="inventory"
                  label="Inventory"
                  type="number"
                  defaultValue={editingProduct?.inventory || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  sx={{ ml: 2 }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {product.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {product.category}
                  </Typography>
                  <Typography variant="body2">
                    Price: ${product.price}
                  </Typography>
                  <Typography variant="body2">
                    Inventory: {product.inventory}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
} 