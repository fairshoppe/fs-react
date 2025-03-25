'use client';

import React, { Suspense } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 4,
      }}
    >
      {sessionId ? (
        <>
          <Typography variant="h4" gutterBottom>
            Thank you for your purchase!
          </Typography>
          <Typography variant="body1" paragraph>
            Your order has been confirmed and will be processed shortly.
          </Typography>
          <Button
            component={Link}
            href="/thrift"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            No order found
          </Typography>
          <Typography variant="body1" paragraph>
            Please try making your purchase again.
          </Typography>
          <Button
            component={Link}
            href="/cart"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Return to Cart
          </Button>
        </>
      )}
    </Box>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 