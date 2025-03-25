"use client";

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Store as StoreIcon,
  Brush as BrushIcon,
  Home as HomeIcon,
  Code as TechIcon,
  Palette as DesignIcon,
  ContactSupport as ContactIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CartDrawer from './CartDrawer';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { state } = useCart();
  const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const isHomePage = pathname === '/';

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Thrift Shoppe', icon: <StoreIcon />, path: '/thrift' },
    { 
      text: 'Custom Shoppe', 
      icon: <BrushIcon />, 
      path: 'https://the-fair-shoppe.printify.me',
      external: true 
    },
    { text: 'Buteos Systems', icon: <TechIcon />, path: '/tech-solutions' },
    { text: 'Design and Consulting', icon: <DesignIcon />, path: '/design-consulting' },
    { text: 'Contact Us', icon: <ContactIcon />, path: '/contact' },
  ];

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
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
              fontFamily: 'var(--font-markazi)',
            }}
          >
            The Fair Shoppe
          </Typography>

          {!isHomePage && (
            <IconButton
              color="inherit"
              onClick={() => setCartOpen(true)}
              sx={{ ml: 2 }}
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-markazi)',
              mb: 2,
            }}
          >
            Menu
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={item.external ? 'a' : Link}
                href={item.path}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => setMenuOpen(false)}
                selected={!item.external && pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontFamily: 'var(--font-markazi)',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
} 