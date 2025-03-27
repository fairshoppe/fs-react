'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { logger, logError } from '@/utils/logger';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('AdminLoginPage mounted');
    console.log('Current cookies:', document.cookie);
    
    // If already logged in, redirect to products page
    if (document.cookie.includes('isAdmin=true')) {
      console.log('Already authenticated, redirecting to products');
      router.push('/admin/products');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', {
        username: formData.username,
        password: formData.password,
      });

      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      console.log('Cookies after login:', document.cookie);
      logger.info('Admin login successful');
      router.push('/admin/products');
    } catch (error) {
      console.error('Login error:', error);
      logError(error instanceof Error ? error : new Error('Login failed'), 'Admin Login');
      setError(error instanceof Error ? error.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontFamily: 'var(--font-markazi)',
            mb: 4,
            textAlign: 'center',
          }}
        >
          Admin Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            error={!!error}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            error={!!error}
            helperText={error}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              mt: 3,
              fontFamily: 'var(--font-markazi)',
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 