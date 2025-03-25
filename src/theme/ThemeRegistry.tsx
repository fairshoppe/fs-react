'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'var(--font-markazi), Roboto, Arial, sans-serif',
    h1: {
      fontFamily: 'var(--font-markazi)',
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'var(--font-markazi)',
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'var(--font-markazi)',
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'var(--font-markazi)',
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontFamily: 'var(--font-markazi)',
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontFamily: 'var(--font-markazi)',
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 