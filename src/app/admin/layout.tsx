'use client';

import React, { useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { logger, logError } from '@/utils/logger';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (status === 'unauthenticated') {
          logger.warn('Unauthorized access attempt to admin area');
          router.push('/auth/signin?callbackUrl=/admin');
        }
      } catch (error) {
        logError(error instanceof Error ? error : new Error('Auth check failed'), 'Admin Layout');
        router.push('/auth/signin?callbackUrl=/admin');
      }
    };

    void checkAuth();
  }, [status, router]);

  if (status === 'loading') {
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

  if (!session) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {children}
    </Box>
  );
} 