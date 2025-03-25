import React from 'react';
import { AppBar, Box, Container, Toolbar, Typography, IconButton, Badge } from '@mui/material';
import { ShoppingCart, Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            Fair Shoppe
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/thrift-shop" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography sx={{ '&:hover': { color: 'primary.main' } }}>
                Thrift Shop
              </Typography>
            </Link>
            <Link href="/custom-shop" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography sx={{ '&:hover': { color: 'primary.main' } }}>
                Custom Shop
              </Typography>
            </Link>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Fair Shoppe. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 