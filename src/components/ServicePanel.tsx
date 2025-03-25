"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ServicePanelProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  backgroundImages?: string[];
  variant?: 'tech' | 'design' | 'contact';
}

const ServicePanel = ({ 
  title, 
  description, 
  buttonText, 
  buttonLink, 
  backgroundImage,
  backgroundImages,
  variant = 'contact'
}: ServicePanelProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!backgroundImages) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages]);

  const fontClass = variant === 'contact' 
    ? 'font-[var(--font-caveat)]' 
    : 'font-[var(--font-markazi)]';

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImages ? (
          // Slideshow Background
          backgroundImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))
        ) : (
          // Single Background Image
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className={`text-4xl sm:text-5xl font-bold text-white mb-8 drop-shadow-lg ${fontClass}`}>
          {title}
        </h2>
        <p className={`text-lg sm:text-xl text-white mb-8 drop-shadow-md leading-relaxed ${fontClass}`}>
          {description}
        </p>
        <Link
          href={buttonLink}
          className={`inline-block px-8 py-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full font-semibold hover:bg-white transition-colors shadow-lg ${fontClass}`}
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default ServicePanel; 