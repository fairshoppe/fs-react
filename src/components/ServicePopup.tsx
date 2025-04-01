"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ServicePopupProps {
  open: boolean;
  onClose: () => void;
  textFileName: string;
  title: string;
}

const ServicePopup: React.FC<ServicePopupProps> = ({ open, onClose, textFileName, title }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/info/${textFileName}`);
        if (!response.ok) {
          throw new Error('Failed to load content');
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
        console.error('Error loading content:', err);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadContent();
    }
  }, [open, textFileName]);

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
          maxWidth: 600,
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
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
          sx={{
            color: '#1a0033',
            fontFamily: 'var(--font-markazi)',
            textAlign: 'center',
            mb: 3,
            mt: 1,
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>

        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: '#1a0033' }} />
            </Box>
          ) : error ? (
            <Typography
              color="error"
              sx={{
                textAlign: 'center',
                fontFamily: 'var(--font-markazi)',
              }}
            >
              {error}
            </Typography>
          ) : (
            <Typography
              sx={{
                color: '#1a0033',
                fontFamily: 'var(--font-markazi)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {content}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ServicePopup; 