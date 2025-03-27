"use client";

import React from 'react';
import Image from 'next/image';

const OpeningPanel = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/backgrounds/intro2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Image
            src="/fs_logo4.svg"
            alt="The Fair Shoppe Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#BCD5E6] mb-6 leading-snug font-markazi">
          At The Fair Shoppe, we believe in the power of creativity and technology to transform businesses and enrich lives.
        </h1>
        <p className="text-xl sm:text-2xl text-[#BCD5E6] font-markazi">
          Welcome to our shoppe!
        </p>
      </div>
    </div>
  );
};

export default OpeningPanel; 