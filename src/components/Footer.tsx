import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Grid } from '@mui/material';
import Link from 'next/link';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              The Fair Shoppe
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your one-stop destination for custom prints and thrift finds.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/thrift" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography component="span" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  The Thrift Shoppe
                </Typography>
              </Link>
              <a
                href="https://the-fair-shoppe.printify.me"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <Typography
                  component="span"
                  sx={{ '&:hover': { textDecoration: 'underline' } }}
                >
                  Custom Print Shoppe
                </Typography>
              </a>
              <Link href="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography component="span" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  About Us
                </Typography>
              </Link>
              <Link href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>
                <Typography component="span" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  Contact
                </Typography>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Tech Solutions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Powered by Buteos Systems
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} The Fair Shop. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 