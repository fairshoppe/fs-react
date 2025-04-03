"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CompanyPanel = () => {
  return (
    // Main container: Full screen, flex centering, soft blueish-gray background
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#2d2d32] mt-24 md:mt-0">

      {/* Content Area - Split Layout */}
      {/* Using flex-col for small screens, md:flex-row for medium and up */}
      {/* max-w-7xl limits width on very large screens, mx-auto centers it */}
      {/* p-8 md:p-16 provides padding */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full max-w-7xl mx-auto p-8 md:p-16 items-stretch md:items-center">
          {/* Added items-stretch for columns to potentially fill height better if needed, md:items-center centers them vertically on wider screens */}

        {/* Left Column */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center md:pr-8 lg:pr-12 mb-8 md:mb-0">
          {/* Custom Border Container */}
          <div className="relative w-full h-[30vh] md:h-[45vh] lg:h-[52vh] max-h-[450px]
                        border-r-2 border-t-2 border-[#bcd5e6] rounded-tr-[40px] overflow-hidden">
            {/* Note: Height classes are now smaller */}

            {/* Image */}
            <Image
              // Replace with your actual image path
              src="/backgrounds/tech5.jpeg" // <<< CHANGE THIS TO YOUR IMAGE PATH
              alt="Featured Content"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2 h-full flex flex-col items-center mb-8 md:mb-0 md:pl-8 lg:pl-12">
          {/* Logo Container */}
          <div className="w-28 h-28 bg-[#bcd5e6] rounded-full mb-8 flex-shrink-0">
             {/* Optional: Place your actual <Image> component here */}
             <Image src="/Buteos.jpg" alt="Buteos Systems Logo" width={112} height={112} className="rounded-full" />
          </div>

          {/* Text Content */}
          <p className="text-lg lg:text-xl text-[#BCD5E6] font-markazi my-auto flex-grow text-center">
             {/* Consider changing text-gray-700 if your default background is dark */}
             {/* Remove text-center if you only want the block centered, not the text inside it */}
             Innovative tech solutions tailored to your business needs. We provide cutting-edge technology solutions designed to empower your business and drive growth.
          </p>

          {/* Button */}
          <Link href="/buteos" className="mt-8 bg-[#bcd5e6] text-gray-900 py-2 px-6 rounded-lg hover:bg-white transition-colors flex-shrink-0">
            Explore Solutions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyPanel;