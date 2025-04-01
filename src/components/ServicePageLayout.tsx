"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from './Navbar';
import ServicePopup from './ServicePopup';

interface ServicePageLayoutProps {
  children: React.ReactNode;
  title: string;
  backgroundImages: string[];
  textFileName?: string; // Optional because some services might not have additional info
}

const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({
  children,
  title,
  backgroundImages,
  textFileName,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#BCD5E6' }}>
      <Navbar />
      
      {/* Title Banner with Slideshow */}
      <Box sx={{ position: 'relative', height: '300px', mt: 8 }}>
        {/* Slideshow Background */}
        <Box sx={{ position: 'absolute', inset: 0 }}>
          {backgroundImages.map((image, index) => (
            <Box
              key={image}
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: index === currentImageIndex ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
            }}
          />
        </Box>

        {/* Title Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#BCD5E6',
              textAlign: 'center',
              fontFamily: 'var(--font-markazi)',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 6,
          cursor: textFileName ? 'pointer' : 'default',
          '&:hover': textFileName ? {
            opacity: 0.9,
            transition: 'opacity 0.2s ease-in-out',
          } : {},
        }}
        onClick={() => textFileName && setShowPopup(true)}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: '4xl', mx: 'auto' }}>
            {children}
          </Box>
        </Container>
      </Box>

      {/* Service Popup */}
      {textFileName && (
        <ServicePopup
          open={showPopup}
          onClose={() => setShowPopup(false)}
          textFileName={textFileName}
        />
      )}

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#1a0033',
          color: 'white',
          py: 3,
        }}
      >
        <Container>
          <Typography
            align="center"
            sx={{
              fontFamily: 'var(--font-markazi)',
            }}
          >
            © {new Date().getFullYear()} The Fair Shoppe. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ServicePageLayout; 