import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';

interface FeaturePopupProps {
  open: boolean;
  onClose: () => void;
}

const FeaturePopup: React.FC<FeaturePopupProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#BCD5E6',
          borderRadius: 2,
          padding: 4,
          maxWidth: 500,
          width: '90%',
          boxShadow: 24,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            color: '#1a0033',
            '&:hover': {
              backgroundColor: 'rgba(26, 0, 51, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontFamily: 'var(--font-markazi)',
            color: '#1a0033',
            mb: 3,
            textAlign: 'center',
          }}
        >
          New to The Fair Shoppe: AI Agents by Buteos Systems
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Link href="/ai-page" passHref style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#1a0033',
                color: '#BCD5E6',
                fontFamily: 'var(--font-markazi)',
                '&:hover': {
                  backgroundColor: '#2d0047',
                },
              }}
            >
              Learn More!
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturePopup; 