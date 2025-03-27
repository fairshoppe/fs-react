'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, CircularProgress } from '@mui/material';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if we're on the login page
        const isLoginPage = window.location.pathname === '/admin/login';
        
        // Get the admin cookie
        const cookies = document.cookie.split(';');
        const isAdmin = cookies.some(cookie => 
          cookie.trim().startsWith('isAdmin=true')
        );
        
        console.log('Auth check:', {
          isLoginPage,
          isAdmin,
          cookies: document.cookie,
          parsedCookies: cookies,
        });
        
        // If not on login page and not admin, redirect to login
        if (!isLoginPage && !isAdmin) {
          console.log('Not authenticated, redirecting to login');
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure cookies are properly loaded
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
} 