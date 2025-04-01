'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
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
  TextField,
  Alert,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { logger, logError } from '@/utils/logger';
import { useProducts } from '@/hooks/useProducts';
import { Product, productService } from '@/services/db';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminProductsPage() {
  const router = useRouter();
  const { products, loading, error, setProducts } = useProducts();
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check authentication on mount and page reloads
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/admin/check');
        if (!response.ok) {
          router.push('/admin/login');
        }
      } catch (error) {
        logError(error instanceof Error ? error : new Error('Auth check failed'), 'Admin Products');
        router.push('/admin/login');
      }
    };

    checkAuth();

    // Set up real-time listener for products
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      try {
        if (!db) {
          logger.error('Firestore not initialized');
          return;
        }

        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('title'));
        
        unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const updatedProducts = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              price: Number(doc.data().price),
            })) as Product[];
            setProducts(updatedProducts);
          },
          (error) => {
            logError(error, 'Products Listener');
          }
        );
      } catch (error) {
        logError(error instanceof Error ? error : new Error('Failed to setup products listener'), 'Admin Products');
      }
    };

    setupListener();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router, setProducts]);

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Update existing product
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        // Add new product
        await productService.createProduct(formData as Omit<Product, 'id'>);
      }

      handleClose();
      logger.info(`Product ${editingProduct ? 'updated' : 'created'} successfully`);
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to save product'), 'Admin Products');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productService.deleteProduct(id);
      logger.info('Product deleted successfully');
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to delete product'), 'Admin Products');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/admin/logout', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to logout');

      logger.info('Admin logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to logout'), 'Admin Products');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontFamily: 'var(--font-markazi)' }}
        >
          Manage Products
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={() => handleOpen()}
            sx={{ mr: 2, fontFamily: 'var(--font-markazi)' }}
          >
            Add Product
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ fontFamily: 'var(--font-markazi)' }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.title}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.condition}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* Basic Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </Grid>
            </Grid>

            {/* Product Details */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Product Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={formData.category || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Condition"
                  value={formData.condition || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand (Optional)"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                />
              </Grid>
            </Grid>

            {/* Dimensions and Shipping */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Dimensions and Shipping
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Length (inches)"
                  type="number"
                  value={formData.length || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Width (inches)"
                  type="number"
                  value={formData.width || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (inches)"
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (pounds)"
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Size (Optional)"
                  value={formData.size || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                />
              </Grid>
            </Grid>

            {/* Image and Inventory */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Image and Inventory
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  value={formData.image || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Inventory"
                  type="number"
                  value={formData.inventory || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, inventory: parseInt(e.target.value) }))}
                  required
                />
              </Grid>
            </Grid>

            {/* Hidden fields for units */}
            <input type="hidden" value="in" name="distanceUnit" />
            <input type="hidden" value="lb" name="massUnit" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (editingProduct ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 