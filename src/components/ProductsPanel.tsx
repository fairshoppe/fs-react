"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Offering {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  external?: boolean;
}

const ProductsPanel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/backgrounds/store1.jpeg',
    '/backgrounds/store2.jpeg',
    '/backgrounds/store3.jpeg',
    '/backgrounds/store4.jpeg',
    '/backgrounds/store5.jpeg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const offerings = [
    {
      title: "Custom Print Shoppe",
      description: "Design your dream apparel! Upload your own image or let our AI create a unique design for shirts, bags, and more.",
      buttonText: "Design Now",
      buttonLink: "https://the-fair-shoppe.printify.me",
      external: true
    },
    {
      title: "The Thrift Shoppe",
      description: "Discover hidden gems! A curated, ever-changing selection of modern and vintage finds from our warehouse.",
      buttonText: "Shop Now",
      buttonLink: "/thrift"
    }
  ];

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Slideshow Background */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
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
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-12 drop-shadow-lg">
          Products
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {offerings.map((offering, index) => (
            <div key={index} className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 drop-shadow-lg">
                {offering.title}
              </h3>
              <p className="text-lg text-white mb-6 drop-shadow-md leading-relaxed">
                {offering.description}
              </p>
              <a
                href={offering.buttonLink}
                target={offering.external ? '_blank' : undefined}
                rel={offering.external ? 'noopener noreferrer' : undefined}
                className="inline-block px-8 py-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full font-semibold hover:bg-white transition-colors shadow-lg"
              >
                {offering.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPanel; 